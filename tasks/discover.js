var request = require('request')
var url = require('url')
var async = require('async')
var fs = require('fs')

// Discovering the API Landscape and build the map unless HIC SUNT LEONES :)
// This is assuming the hub and the (mocked) consumed services that are being doscovered  are running
module.exports = function(grunt){
  grunt.registerTask('discover', function(){
    var done = this.async();

    // TODO Make the env var name configurable
    // The var name should be independent / decouopled from the rest of the ecosystem especially: 
    //   - the Design Commponent name conventions
    //   - Service Component evn var  convertions
    
    if(!process.env['API_ENVIRONMENT_DISCOVERY_ENTRYPOINT']){
      return done(new Error("'API_ENVIRONEMNT_DISCOVERY_ENTRYPOINT'" +
        "env var must be set for discovery."))
    }

    var discoveryEntrypoint = process.env['API_ENVIRONMENT_DISCOVERY_ENTRYPOINT']
    var discoveryUrl = url.parse(discoveryEntrypoint)
    grunt.log.writeln("Discovering API Landscape through: " + discoveryUrl.href)

    // OK, this is the secret sauce, this won't scale for a large amount of APIs
    // querinng GET /apis
    var requestOptions = {
      url: url.resolve(discoveryUrl.href, '/apis'),
      method: "GET",
      headers: {
        // this is importand, I think the API should return doc to the user if not queried
        // with a machine readable accept content-type
        "Accept": "application/json"
      }
    }
    
    // this might one day in the APIS.json format, not sure atm
    var apiLandscapeMap = []
    request(requestOptions, function(error, hubResponse, hubBody){
      if(error){ return done(error)}
      hubResponseParsed = JSON.parse(hubBody)
      if(! Array.isArray(hubResponseParsed)) {
        done(new Error("Expected a parseable JSON Array in the repsonse. Got this instead: " + 
          hubBody))
      }

      // for each API 
      // fetch the discovery enrtypoint
      // Parse API Spec
      // Extract x-lifecycle name and assign to the
      async.each(hubResponseParsed, function(api, callback){
        var apiEntrypoint = api['api_url']
        var apiDiscoveryUrl = url.resolve(apiEntrypoint, '/discovery/spec/openapi.json')
        grunt.log.writeln("Fetching API Spec from: "+ apiDiscoveryUrl)
        
        var requestOptions = {
          url: apiDiscoveryUrl,
          method: "GET"
        }
        
        request(requestOptions, function(error, apiSpecRespons, apiSpecBody){
          if(error){ callback(eroror) }
          var parsedApiSpec = JSON.parse(apiSpecBody)
          var designName = parsedApiSpec['info']['x-lifecycle']['name']
          grunt.log.writeln("Found API Design Name: " + designName)
 
          apiLandscapeMap.push({
            api_url: apiEntrypoint,
            designName: designName
          })
          callback()
        })
      }, function(error){
        if(error){
          console.log(error)
          done(error)
        }
        mapPath = 'api-landscape/map.json'
        if(! fs.existsSync('api-landscape')){
          fs.mkdirSync('api-landscape',{recursive: true})
        }
        fs.writeFileSync(mapPath, JSON.stringify(apiLandscapeMap,null, 2))
        grunt.log.writeln("API Landscape Map written to: " + mapPath)
      })
    })
  })
}
