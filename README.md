# DO NOT USE; massively WIP

[![Build Status](https://travis-ci.com/netmilk/api-design-lifecycle-skeleton.svg?branch=master)](https://travis-ci.com/netmilk/api-design-lifecycle-skeleton)


# API Design Lifecycle Skeleton
- Human Entrypoint TODO
- Machine Discovery

# Requirements

## Accounts
- NPM account
- GitHub account
- Travis CI account 
- ZEIT Now account
- Docker HUB account
- Infrastructural Domain in ZEIT (optional) 

## Local Development
- Docker

# Collaborate
- fork or create branch
- `dev`

# Env Varianbles
`API_LANDSCAPE_DOMAIN`
`APIS_DOMAINS`

## Local
`SERVICE_SELF_PORT`

## CI/CD
`SERVICE_SELF_PORT`
`NOW_TOKEN`
`NOW_TEAM`
`API_LANDSCAPE_DOMAIN`
`TRAVIS_PULL_REQUEST` - Travis specific

## Production

### Build
`SERVICE_SELF_PORT`

### Runtime
`BASE_URL` - It templates itself when the container starts

## Dependencies
- supermodels
- governance repo

# Commands
## `test`
- does the readme contain the right branch
- dredd test the mock
- governance

## `build`
X - syntax validation
X - dereferencing

- generates readme
  - doc url
  - mock url
  - changelog

- compiles and dereferences the templated and decomposed spec
  - github
  - version
  - host
  - license

## `serve` maybe `mock`
- starts a server
  - with the mock for the api
  - and the discovery endpoint service the compiled spec
  - and the human readable documentaion

## `dev`
X - it builds the spec document
- it starts the mock server
- the mock server
  - is mocking the API
  - is serving the /discovery endpoint
X  - compat /discovery/doc endpoint
X  - compat /discovery/spec endpoint
X  - is serving the doc
  - is serving the spec document
X - when the spec changes
X  - it rebuilds the spec
X  - it reloads the browser automatically
  - it reloads the mock

## `release`
- locally
  - for master branch
    - fail
  - for other branches
    - fail
- in CI
  - for master branch 
    - semantic release
  - for other branches
    - fail


## `deploy`
- locally
  - for master branch
  - for other branches

- in CI
  - for master branch
    - 
  - for other branches
    - if PR
      - deploy to PR 
    - if not PR
      - do nothing

# References
- yarn https://yarnpkg.com/en/
- yarn workspaces https://yarnpkg.com/lang/en/docs/workspaces/
- package.json https://docs.npmjs.com/files/package.json
- restful json https://restfuljson.org/
- grunt https://gruntjs.com/
- grunt-contrib-watch https://github.com/gruntjs/grunt-contrib-watch#optionslivereload
- grunt-contrib-connect https://github.com/gruntjs/grunt-contrib-connect
- grunt-exec https://github.com/jharding/grunt-exec
- livereload https://github.com/gruntjs/grunt-contrib-watch/blob/master/docs/watch-examples.md#enabling-live-reload-in-your-html
- change case https://github.com/blakeembrey/change-casec
- dotenv https://www.npmjs.com/package/dotenv
- dotenv edit https://github.com/stevenvachon/edit-dotenv
- portastic https://www.npmjs.com/package/portastic
- ReDoc https://github.com/Rebilly/ReDoc
- Stoplight Prism https://github.com/stoplightio/prism
- Dredd http://github.com/apiaryio/dredd
- Dredd Hooks http://dredd.org/en/latest/hooks-nodejs.html
- Swagger CLI https://github.com/APIDevTools/swagger-cli
- Swagger Praser https://github.com/APIDevTools/swagger-parser
- Semantic Release https://github.com/semantic-release/semantic-release
- Github Protected Branches, Required reviiews and stats checks https://help.github.com/articles/about-protected-branches/
- Github CLI for Comments https://github.com/stephencelis/ghi
- Travis CI CLI https://github.com/travis-ci/travis.rb
- Travis CI Build Environment Variables https://docs.travis-ci.com/user/environment-variables/
- Travis CI Conditions https://docs.travis-ci.com/user/conditions-v1
- ZEIT Now CLI https://zeit.co/now
- ZEIT Now Build Environment Variables https://zeit.co/docs/features/build-env-and-secrets
- ZEIT Now Runtime Environment Variables https://zeit.co/docs/features/env-and-secrets


# TODO

## Security
- [] Make sure tokens are secure for forks in CI
- [] Figure out PR deployment for forks reflecting ^^^


## Infra
- [] Conventions for environment varirables and configuration
  - service configuration
  - discovery: surrounding environment (local (mocking), stage, prod etc..)

## Developer Experience
- [] STDOUT from deploy task 
- [] Faster Docker build using arbitrary binary node-alpine + stoplight/prism images
- [] mock component binary, problematic license
- [] performance degradation by reverse proxying
- [] show OAS validation errors with line numbers
- [] faster build 
  - [] using JS API instead of CLI
  - [] triggering mock reloadng instead of the full entire process/container lifecycle 
- [] not only API Specification is the contract
  - [] scenarios
  - [] prose

