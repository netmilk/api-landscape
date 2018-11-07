var express = require('express')
var app = express()

// Harcoding he env var key, so the services don't need any tooling for extracting
// of the configuration from the env vars. Relying on strong conventions.
var port = process.env['API_LANDSCAPE_API_HOST']

// This is API Landscape Discovery hub for the local dotenv driven environment management
// This will be extracting from "now ls" in ZEIT or from environments like KONG,
// Heroku, Consul, API Managements etc...
module.exports = function(grunt){
  grunt.registerTask('hub', function(){
    done = this.async()
    app.get('/apis', function(req, res){
      console.log("hit")
      // this is extracting the hosts from the local dotenv virtualized environemnt
      // it's reloading the dotenv on every hit so it doesn't need reloading when regenerating

      var freshDotenv = dotenv.parse(fs.readFileSync(".env", {encoding: 'utf-8'}))
      
      //Lookup already added API_HOSTS in current dotenv and remove them 
      variablePattern = changeCase.constantCase(designName) + "_API_HOST"
      
      var keys = Object.keys(freshDotenv)
      var apiLandscapeHostKeys = keys.filter(function(key){
        return key.indexOf(variablePattern) != -1
      })

      var len = apiLandscapeKeys.length
      urls = []

      for(index = 0; index < len; index++){
        var apiLandscapeHostKey = apiLandscapeHostKeys[index]
        host = freshDotenv[apiLandscapeHostKey]
        hosts.push(host)
      }
   
      res.json(urls)
    })

    app.listen(port, function() {
      console.log("API Landscape Discovery Hub listening on port "+ port + "!")
    })


    // FIXME I don't know how to avoid task to end any other way.
    //setTimeout(function() {
    //  done();
    //}, 1000000000);
  })
}
