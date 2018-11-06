/*** Conventions ****/
module.exports = {
  "API_DISCOVERY_ENDPOINTS": [
    "/discovery/spec/openapi.json"
  ],
  'SERVICE_ENV_VAR_PATTERN': "API_HOST",
  'API_DISCOVERY_ENV_VAR': "API_DISCOVERY",
  'DESIGN_COMPONENT_SPEC_BUILD_PATH': "build/spec",
  'DESIGN_COMPONENT_WORKDIR': "spec",
  // TODO only this one works atm
  // FIXME this has to be camelcase like other packake.json properties
  'API_LANDSCAPE_PACKAGE_JSON_NAMESPACE': "api-landscape",
  // FIXME this should be $.x-lifecycle.name
  'OPENAPI_LIFECYCLE_NAME_KEY_LOCATION': "$.info.x-lifecycle.",
  'API_LANDSCAPE_DOTENV_PATH': ".env",
  'PROVIDE_PORTS': {min: 3000, max: 3099},
  'CONSUME_PORTS': {min: 8000, max: 8099}
}

