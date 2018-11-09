var express = require('express')
var expressProxy = require('express-http-proxy')
var dotenv = require('dotenv')
var fs = require('fs')
var changeCase = require('change-case')

var app = express()

// This could be theoretically dogfooded - tested and mocked with api-landscape itself
// Or even better replaced with mock with the discvery endpoint in-built
module.exports = function(grunt){
  grunt.registerTask('mock-frontend', function(designName){
    done = this.async()

    // TODO this is static as long as we support only one mock at the time
    var mockBackendPort = 8117
    // set the mock-frontend mockPort

    if(designName == 'design'){
      var mockFrontendPort = 8000
    } else {
      /***** DOTENV VAR LOOKUP *****/
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
        var mockFrontendHost = freshDotenv[designNameApiLandscapeHostEnvVarKey]
        var mockFrontendPort = mockFrontendHost.split(":")[1]
        grunt.log.writeln("Found env var key '" + designNameApiLandscapeHostEnvVarKey + 
          "' using port " + mockFrontendPort +".")
      } else {
        throw new Error("Env var not found for consumed design '"+ designName +"'")
      }
      /***** DOTENV VAR LOOKUP END *****/
    }

    // FIXME this sucks: api-landscape link should probably link the entire /build
    // not only /build/spec 
    if(designName == "design"){
      var consumedSpecDir = 'build'
      app.use('/discovery', express.static(consumedSpecDir))
    } else {
      var consumedSpecDir = 'api-landscape/consume/' + designName
      app.use('/discovery/spec', express.static(consumedSpecDir)) 
    }
    grunt.log.writeln("API Landscape Mock Frontend forwards requests to the Mock Backend "+
        "loaclhost:" + mockBackendPort+".")
    
    app.use('/', expressProxy('localhost:' + mockBackendPort))

    app.listen(mockFrontendPort, function() {
      if(designName != "design"){
        console.log("API Landscape Consumed Service Mock Frontend for design '"+ designName +"' "+
          "listening on port "+ mockFrontendPort  + "!")
      } else {
         console.log("API Landscape Design Component Mock Frontend"+
          "listening on port "+ mockFrontendPort  + "!")     
      }
    })
  })
}
