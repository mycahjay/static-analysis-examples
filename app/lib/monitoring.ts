import prometheus, { Counter, Histogram, HistogramConfiguration } from 'prom-client';

const CLIENT_BUCKETS = [0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, 30.0, 60.0, 120.0];
const HTTP_REQUEST_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0];
const HTTP_REQUEST_LABELS = ['operation', 'method', 'url', 'status_code'];

// Basic metrics types
export type Labels = { [label: string]: string | number };
export interface Timer<TStart = Labels, TFinish = Labels> {
    histogram: Histogram<string>;
    startTimer(labels: TStart): StartedTimer<TFinish>;
}
export interface StartedTimer<TFinish = Labels> {
    finish(labels?: TFinish): void;
}

// HTTP metrics types
export interface HttpRequestLabels {
    operation: string;
    method: string;
    url: string;
    statusCode?: string;
}
export type HttpTimer = Timer<HttpRequestLabels, { statusCode?: string }>;
export type HttpCounter = Counter<string> & { submit(labels: HttpRequestLabels): void }

// Client metrics types
export interface ClientTimer {
    histogram: Histogram<string>;
    submitSpan(startTime: number, finishTime: number, tags: object | null): void;
}

function incHttpCounter (metric: Counter<string>, { operation, method, url, statusCode }: HttpRequestLabels) {
  metric.labels(operation, method, url, statusCode || '').inc();
}
function makeHttpCounter ({ name, help }: { name: string, help: string }): HttpCounter {
  const counter = new prometheus.Counter({ name, help, labelNames: HTTP_REQUEST_LABELS });
  return Object.assign(counter, {
    submit: (labels: HttpRequestLabels) => {
      incHttpCounter(counter, labels);
    }
  });
}
function makeHttpTimer ({ name, help }: { name: string, help: string }): HttpTimer {
  const histogram = new prometheus.Histogram({
    name,
    help,
    labelNames: HTTP_REQUEST_LABELS,
    buckets: HTTP_REQUEST_BUCKETS
  });
  return {
    histogram,
    startTimer: (labels: HttpRequestLabels) => {
      const { operation, method, url, statusCode: _ } = labels;
      const finishFn = histogram.startTimer({ operation, method, url });
      return {
        finish: (labels?: { statusCode?: string }) => {
          return finishFn({ status_code: labels?.statusCode || '' });
        }
      };
    }
  };
}
function makeClientTimer ({ name, help, labelMap }: { name: string, help: string, labelMap: object }): ClientTimer {
  const tagsIterator = Object.entries(labelMap);
  const labelNames = Object.keys(labelMap);
  const histogram = new prometheus.Histogram({
    name,
    help,
    labelNames,
    buckets: CLIENT_BUCKETS
  });
  return {
    histogram,
    submitSpan: (startTimestamp, finishTimestamp, tags: { [tag: string]: any } | null) => {
      tags = tags || {};
      const millis = Math.max(finishTimestamp - startTimestamp, 1);
      const seconds = millis / 1e3;
      const labels: { [label: string]: string | number } = {};
      for (const el of tagsIterator) {
        const [label, tag] = el;
        const tagValue = tags[tag];
        if (tagValue !== undefined && tagValue !== null && tagValue !== '') {
          labels[label] = tagValue;
        }
      }
      histogram.observe(labels, seconds);
    }
  };
}
function makeTimer (config: HistogramConfiguration<string>): Timer {
  const histogram = new prometheus.Histogram(config);
  return {
    histogram,
    startTimer: (labels: object) => {
      return { finish: histogram.startTimer(labels) };
    }
  };
}

/**
 * Starts collecting process-wide metrics.
 *
 * Should be called during app initialization (e.g. in `app.ts` or `app/bootstrap`).
 * Not called by default to avoid any possible (unmeasured) overhead in tests.
 */
const init = (version: string): void => {
  prometheus.register.setDefaultLabels({
    service: 'sx-api',
    version
  });

  // Do nothing for now.  We aren't collecting prometheus metrics right now.
  // Waits (up to) 15 seconds to begin collecting metrics so that all of
  // there is no clock jitter in the reported metrics.
  // const STARTUP_TIMEOUT = 15000;
  // pm2prometheus.timeSyncRun(STARTUP_TIMEOUT, () => {
  //   prometheus.collectDefaultMetrics();
  //   const startGcStats = gcStats(prometheus.register);
  //   startGcStats();
  // });
};

const startServer = (server: any): Promise<void> => {
  // server.route({
  //   method: 'GET',
  //   path: '/metrics',
  //   handler: (_request) => {
  //     return pm2prometheus.getAggregateMetrics().then((register) => register.metrics());
  //   }
  // });
  return server.start();
};

/**
 * Convert a count into a bucketed order of magnitude.
 *
 * Useful for create labels for metricsthat measure the performance of operations
 * which accept a variable number of objects, like the number of database records or model instances.
 */
const MAX_COUNT_BUCKET_SIZE = 100000;
const MAX_COUNT_BUCKET_LABEL = '+Inf';
export function countToBucket (count: any[] | number | null | undefined): string {
  if (Array.isArray(count)) {
    count = count.length;
  } else if (!count) {
    count = 0;
  }
  if (count <= 0) { return '0'; }
  for (let bucket = 1; bucket < MAX_COUNT_BUCKET_SIZE; bucket = bucket * 10) {
    if (count <= bucket) {
      return `${bucket}`;
    }
  }
  return MAX_COUNT_BUCKET_LABEL;
}

/**
 * Predefined Counter metrics.
 */
export const counters = {
  httpRequestsTotal: makeHttpCounter({
    name: 'sx_http_requests_total',
    help: 'The number of processed HTTP requests.'
  }),
  httpRequestErrorsTotal: makeHttpCounter({
    name: 'sx_http_request_errors_total',
    help: 'The number of processed HTTP requests which responded with an error.'
  })
};

/**
 * Predefined Timer metrics.
 */
export const timers = {
  httpRequest: makeHttpTimer({
    name: 'sx_http_request_duration_seconds',
    help: 'The duration of processed HTTP requests.'
  }),
  serializePayload: makeTimer({
    name: 'sx_serialize_duration_seconds',
    help: 'The duration to serialize a payload into a response format.',
    labelNames: ['controller', 'records', 'operation', 'serializer']
  }),
  permissionsLoad: makeTimer({
    name: 'sx_permissions_load_duration_seconds',
    help: 'The duration to load and calculate permissions for a payload.',
    labelNames: ['controller', 'records']
  }),
  permissionsLoadModels: makeTimer({
    name: 'sx_permissions_load_models_duration_seconds',
    help: 'The duration to load permissions model dependencies for a payload.',
    labelNames: ['controller', 'records']
  }),
  permissionsCalculate: makeTimer({
    name: 'sx_permissions_calculate_duration_seconds',
    help: 'The duration to calculate permissions for a payload.',
    labelNames: ['controller', 'records']
  }),
  clientInitialRender: makeClientTimer({
    name: 'sx_client_initial_render_duration_seconds',
    help: 'The duration of rendering the initial page after initial login.',
    labelMap: {
      client_version: 'sx.client.version',
      router_to: 'sx.client.transition.to'
    }
  }),
  clientTransition: makeClientTimer({
    name: 'sx_client_transition_duration_seconds',
    help: 'The duration of a page or route transition in the client application.',
    labelMap: {
      client_version: 'sx.client.version',
      router_from: 'sx.client.transition.from',
      router_to: 'sx.client.transition.to'
    }
  })
};

export default {
  init,
  startServer
};
