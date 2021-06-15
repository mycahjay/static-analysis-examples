const hello = async (req, h) => {
  const { name } = req.query;
  const res = `Hello, ${name}!`;
  return h.response(res).code(200);
};

const helloWorld = async (req, h) => {
  const res = 'Hello, World';
  return h.response(res).code(200);
};

export default [
  {
    method: 'GET',
    path: '/hello',
    handler: hello
  },

  {
    method: 'GET',
    path: '/hello-world',
    handler: helloWorld
  }
];
