var dotenv = require('dotenv')

// load to process.env
dotenv.config();

var fs = require('fs');
var path = require('path')
var which = require('which');
var packageJson = require('read-pkg').sync();
var changeCase = require('change-case')

var configuration = require('./configuration.js')

// TODO: Conventions for the package.json API metadata namesapce
// Suggestion: #/api/designName and fallback to package name 
var DESIGN_NAME = packageJson['name'];

// Check prism command availability, 
// if not available, assuming it's installed as a docker container
// https://github.com/stoplightio/prism
var prismAvailable = function(){
  return (which.sync('prism', {'nothrow': true}) != null)
}

module.exports = function(grunt) {
 grunt.initConfig({
    apiLandscape: configuration,
    // TODO: Performance! I'd like to see this rewritten using JS API of everything
    exec: { 
      validate: {
        //TODO entrypoint to config
        command: "npx swagger-cli validate ./spec/openapi.yaml",
        stdout: true,
        stderr: true,
        sync: true 
      },

      bundle: {
        command: "npx swagger-cli bundle --dereference --outfile ./build/spec/openapi.json ./spec/openapi.yaml"
      },

      // Like Webpack, but not really
      // Just copy the JS from node_modules to the build
      webpack: {
        command: "mkdir -p build/doc && mkdir -p build/doc/js && "+
          "cp " + path.dirname(require.resolve('redoc')) + "/redoc.standalone.js build/doc/js && " +
          "cp " + path.dirname(require.resolve('api-landscape')) + "/static/index.html build/doc"
      },

      //Start mock
      "mock-backend-start": {
        command: function(designName) {
          console.log(designName)
          if(designName == "design"){
            // if mocking an API Landscape Design component
            var mockPort = 8117
            var specDir = "build/spec"
          } else {
            // TODO FIXME Now supporting only one mock, whem more supported DOT ENV VAR port lookup
            // will happen here. Or even better the mock will have the discovery endpoint in-built
            // and ther won't be any mock-backend and mock-frontend
            var mockPort = 8117
            // if mocking consumed design in the Service API Landscape component
            // TODO the path segments should be probably configurable
            var specDir = "api-landscape/consume/" + designName
            if(!fs.existsSync(specDir)){
              throw(new Error("The dir '" + specDir + "' for the consumed design doesn't exist. "))
            }
          }

          grunt.log.writeln("Mocking API Design conponent in: " + specDir)


          if(! prismAvailable()){ 
            var paramSpecPath = "spec/openapi.json"
            var params = "mock -p " + mockPort + "  --spec " + paramSpecPath + " --debug &"
            var cmd = "docker run --name prism-mock -v `pwd`/"+ specDir +":/spec -p " + 
              mockPort + ":" + mockPort + " stoplight/prism";
          } else{
            var paramSpecPath = path.join(spedDir, "openapi.json")
            var params = "mock -p " + mockPort + "  --spec " + specPath + " --debug &" 
            var cmd = "prism";
          }

          var fullCommand = cmd + " " + params;
          return fullCommand;
        },
      },
      
      //Stop mock
      "mock-backend-stop": {
        command: function(){
          if(! prismAvailable()){
            var cmd = "docker rm -f prism-mock"
          } else {
            var cmd = "killall prism"
          }
          return cmd
        },
        sync: true,
        exitCode: [0,1]
      },
      
      //TODO This needs to use env vars - at least for the port from API_HOST
      //FIXME ^^^ This is wrong, Dredd is client and it should use API_ENTRYPOINT
      //FUXNE ^^^ Well not entirely, Dredd should use API_ENTRYPOINT, but Dredd shuold run 
      // the server on the API_HOST :) WOOF
      "dredd": {
        command: function(designName) {
          if(!designName){
            throw new Error("exec:dredd:[designName] expected ")
          } else {
            // FIXME this is a dirty hack for now, find better way to tell dredd to start mock
            // probably look to pakcage.json if this is a mock or service API Landscape component
            if(designName != "mock") {

              /***** DOT ENV VAR LOOKUP *****/
              // TODO DRY this
              var freshDotenv = dotenv.parse(fs.readFileSync(".env", {encoding: 'utf-8'}))
              
              //Lookup already added API_HOSTS in current dotenv and remove them 
              variablePattern = changeCase.constantCase(designName) + "_API_HOST"
              
              var keys = Object.keys(freshDotenv)
              var apiLandscapeKeys = keys.filter(function(key){
                return key.indexOf(variablePattern) != -1
              })

              if(apiLandscapeKeys.length > 0){
                designNameApiLandscapeHostEnvVarKey = apiLandscapeKeys[0]
                // setting port here
                var serviceHost = freshDotenv[designNameApiLandscapeHostEnvVarKey]
                var servicePort = serviceHost.split(":")[1]
                grunt.log.writeln("Found env var key '" + designNameApiLandscapeHostEnvVarKey + 
                  "' using port " + servicePort +".")
  
                // setting start script here
                var cwdPkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf-8'}));
                if(cwdPkg['scripts']){
                  if(cwdPkg['scripts']['start']){
                    var serverStartCommand = "yarn run start --verbose --stack"
                  }
                }

                if(!serverStartCommand){
                  throw new Error("Property scripts/start not found. " +
                      "If testing service providing design. Set it it package.json. ")
                }

              } else {
                throw new Error("Env var not found for provided design '"+ designName +"'")
              }
              /***** DOTENV VAR LOOKUP END *****/

            } else {
              // fallback to mock
              var servicePort = 8000
              var serverStartCommand = "yarn run api-landscape mock-start:design"
            }
          }
          
          var dreddCommand = "dredd " + 
          "http://localhost:" + servicePort + "/discovery/spec/openapi.json " +
          "http://localhost:"+ servicePort + " " +
          "--server '"+ serverStartCommand +"' " +
          "--hookfiles=./dredd-hooks.js " +
          //FIXME Introducing a possible race condition. On very slow systems it may take longer
          // than 10 seconds to start the server.
          "--server-wait=10"

          return dreddCommand
        }
      },
      
      
      "now-deploy": {
        // FIXME: One-liners suck, mixing ENV variables and local constants 
        command: "now --docker --public --team $NOW_TEAM --token $NOW_TOKEN | xargs -I% " +
          "now --team $NOW_TEAM --token $NOW_TOKEN alias % " + DESIGN_NAME + ".mocks.$API_LANDSCAPE_DOMAIN",
        sync: true,
        options: {
          env: process.env
        },
      },

      "now-deploy-pr": {
        // FIXME: One-liners suck, mixing ENV variables and local constants
        // FIXME: DRY mock pr url!
        command: "now --docker --public --team $NOW_TEAM --token $NOW_TOKEN | xargs -I% " +
          "now --team $NOW_TEAM --token $NOW_TOKEN alias % " + DESIGN_NAME + "-pr-$TRAVIS_PULL_REQUEST.mocks.$API_LANDSCAPE_DOMAIN",
        sync: true,
        options: {
          env: process.env
        }
      },
      
      // TODO: This should check if the BUILD repo is the same repo given in the package.json
      // TODO: Make the DNS namespace shohow compatible with CONSUL DNS interface:
      // https://www.consul.io/docs/agent/dns.html#standard-lookup
      "github-comment-pr-deploy":{
        options: {
          env: process.env
        },
        command: function(){
          // FIXME Needs DRYing
          var mockUrl ="http://" + DESIGN_NAME + "-pr-$TRAVIS_PULL_REQUEST.mocks.$API_LANDSCAPE_DOMAIN"
          // TODO Pull the commewnt text to a template, Markdown in Bash CLI is a hot mess
          var comment = "API Mock deployed to [\\`" + mockUrl + "\\`](" + mockUrl + ")"
          var cmd = "docker run -i --rm " +
                "-e GITHUB_TOKEN=$GITHUB_TOKEN " + 
                '-e GITHUB_OWNER=$(echo $TRAVIS_REPO_SLUG | awk -F \\/ \'{print $1}\') ' + 
                '-e GITHUB_REPO=$(echo $TRAVIS_REPO_SLUG | awk -F \\/ \'{print $2}\') ' +
                "-e GITHUB_COMMENT_TYPE=issue " +
                "-e GITHUB_PR_ISSUE_NUMBER=$TRAVIS_PULL_REQUEST " +
                '-e GITHUB_COMMENT_FORMAT=\"<h1>Good API Lifecycle :robot: </h1>\n\n{{.}}\" ' +
                '-e GITHUB_COMMENT=\"' + comment + '\" ' +
                "cloudposse/github-commenter"
          console.log(cmd);
          return cmd
        }
      }
    },

    watch: {
      //rebuild
      build:{
        files: ['spec/**/*', 'package.json'],
        tasks: [
          'build',
          'exec:mock-backend-stop',
          'exec:mock-backend-start'
        ]
      },

      //reload
      livereload: {
        files: ['spec/**/*', 'package.json'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.task.loadTasks('./tasks');
  
  grunt.registerTask('build', function(){
    grunt.task.run([
      'exec:validate',
      'exec:webpack',
      'exec:bundle',
      'sprinkle'
    ])
  });

  grunt.registerTask('design-develop', function(designName){
    grunt.task.run([
      'build',
      'exec:mock-backend-stop',

      // the :design part is important, it runs mock for the builded spec from /build
      // unless it would look into ./api-landscape/consume/:designName
      'exec:mock-backend-start:design',
      'mock-frontend:design',
      'watch'
    ])
  })



  /* this is used when configuring clients (plugging them into an environment)
  grunt.registerTask('discover', function(){
    // discover API design (and version) in the API Landscape
    // if no params it reads the API_DISCOVERY_ENTRYPOINT and dumps the map of the landscape 
    // to the api-landscape  directory
    // ^^^ probs apis.jsons
    // and looks for the consumed designs
    // input: API design, version, landscape
    // output: URL
    // fetch the API Landscape entrypoint
    // walk through the "conventional" API design discovery endpoints
    // find the design name in the API spec
    // build the API Landscape map (cache, lockfile :), save it to api-landscape
    // if found return URL
  })
  
  // Freaking Chicken Egg problem
  // - is the service first runnning and then exposes entrypoint and that determines its port
  // - 
  // Virtualize local API Environment Discovery Hub
  // How do I determine the port/url the service should be running on?
  // This should run a mini local API Developer portal  Management
  // The thing is the service doesn't necesarilly know its own FQDN
  // FQDN = locally PORT

  // Virtualize API Environment Locally

  grunt.registerTask('virtualize', function(){
    // THIS SOLVES THE NAMING DILEMA! AND INVALIDATING CACHES TOO!
    // assign free ports to all **consumed** services
    // mocks should listen on these ports
    // run a local mini API Discovery hub exporting the local provided API hosts

    // clients (in the service) should configure themselves to use these port
    // assign free ports to all **provided** services (this should be 3000 and increments)
    // service providing the design name should always pick it up from the local environment and should run on that port 
    // tag - design name to hostname,fqdn/port/entrypoint resolution client
    // 
  })
  */
  grunt.registerTask('mock-start', function(designName){
    // TODO FIXME Start shouldn't watch
    // The problem is when the connect has keepalive option, the first one blocks and the discovery never ever starts
 
    grunt.task.run([
      'exec:mock-backend-stop',
      'exec:mock-backend-start:' + designName,
      'mock-frontend:' + designName
    ])
  })


  grunt.registerTask('design-test', function(){
    grunt.task.run([
      "build",
      "exec:dredd:mock"
    ])
  })

  grunt.registerTask('deploy',function(){
    // TODO: Pull from package.json dependency services, resolve entrypoints 
    // and export as env variables here if real service, not a mock
    var requiredEnvVariables = [
      //'SERVICE_SELF_PORT',
      'API_LANDSCAPE_DOMAIN',
      'NOW_TOKEN',
      'NOW_TEAM'
    ]

    arrayLength = requiredEnvVariables.length
    for(var index = 0; index < arrayLength; index++){
      item = requiredEnvVariables[index]
      if(process.env[item] == null){
        grunt.fail.fatal(new Error("Environment variable "+ item + " requried, but not set. If on local, add to your `.env`."));
      };
    }

    grunt.task.run([
      'build',
      'exec:now-deploy'
    ])
  });

  // FIXME: Refactor COPY&PASTE SIN Massively cutting conrners here.  
  grunt.registerTask('deploy-pr',function(){
    // TODO: Pull from package.json dependency services, resolve entrypoints 
    // and export as env variables here if real service, not a mock
    var requiredEnvVariables = [
      //'SERVICE_SELF_PORT',
      'API_LANDSCAPE_DOMAIN',
      'NOW_TOKEN',
      'NOW_TEAM'
    ]

    arrayLength = requiredEnvVariables.length
    for(var index = 0; index < arrayLength; index++){
      item = requiredEnvVariables[index]
      if(process.env[item] == null){
        grunt.fail.fatal(new Error("Environment variable "+ item + " requried, but not set. If on local add to your `.env`."));
      };
    }

    grunt.task.run([
      'build',
      'exec:now-deploy-pr',
      'exec:github-comment-pr-deploy'
    ])
  });
  
  // Doing this because freaking grunt doesn't load npm tasks recursively si it doesn't work
  // with yarn worksapces
	require('load-grunt-tasks')(grunt, {
    config: __dirname + '/package.json',
		scope: 'dependencies',
		requireResolution: true
	}); 
  
  // Catch CTRL+C gratefully
  process.on('SIGINT', function(){
    console.log("SIGINT Cuaght. Cleaning up.")
    grunt.task.run(['exec:mock-stop']);
    process.exit()
  })
 
  //grunt.registerTask('default', ['dev']);
  
  // This is super important, it runs all tasks in the directory where the CLI was run
  // Not in the directory where the Gruntfile is located
  grunt.file.setBase(process.env['PWD']);
};
