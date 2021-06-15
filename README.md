# static analysis examples

## setup

set up dev-env for environment variables et al.
```
echo export DEV_ENVRC_LOCATION=/Users/you/dev-env-directory >> .env

direnv allow
```

install global npm packages under correct node version
```
nvm install // Now using node v15.14.0

npm install -g pm2 yarn
```

install all the things
```
yarn install
```

<!-- ## testing -->

## local analysis

### sonarqube

update `.env`:
```
export SONARQUBE_CONTAINER_NAME=sonar
export SONAR_HOST_URL=http://localhost:8080
```

**option 1**: use `bin/sonar` and follow the prompts:

```
sonar
```

**option 2**: follow each step below:

docker up!
```
docker compose -f docker-compose.sonar.yml up -d
```

log in to the dashboard at `localhost:8080`
```
username: admin
password: admin
```

generate token at `localhost:8080/account/security` and add to project
```
echo export SONARQUBE_TOKEN=TOKEN_HERE >> .env

direnv allow
```

analyze
```
sonar-scanner
```

results at `localhost:8080/dashboard?id=sonar-project`

### shiftleft

### codeql
