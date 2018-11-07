var express = require('express')
var dotenv = require('dotenv')
var fs = require('fs')
var changeCase = require('change-case')

var app = express()

// Harcoding he env var key, so the services don't need any tooling for extracting
// of the configuration from the env vars. Relying on strong conventions.
var port = process.env['API_LANDSCAPE_API_HOST'].split(":")[1]

// This is API Landscape Discovery hub for the local dotenv driven environment management
// This will be extracting from "now ls" in ZEIT or from environments like KONG,
// Heroku, Consul, API Managements etc...
module.exports = function(grunt){
  grunt.registerTask('hub', function(){
    done = this.async()

    app.get('/', function(req, res){
      res.json([
        {"apis_url": "/apis"},
        {"api_map_url": "/discovery/spec/openapi.json" }
      ])
    })

    app.get('/discovery/spec/openapi.json', function(req, res){
      spec = JSON.parse(fs.readFileSync('./build/spec/openapi.json', {encoding: 'utf-8'}))
      res.json(spec)
    })

    app.get('/apis', function(req, res){
      console.log("hit")
      // this is extracting the hosts from the local dotenv virtualized environemnt
      // it's reloading the dotenv on every hit so it doesn't need reloading when regenerating

      var freshDotenv = dotenv.parse(fs.readFileSync(".env", {encoding: 'utf-8'}))
      
      //Lookup already added API_HOSTS in current dotenv and remove them 
      // FIXME this should be configurable
      variablePattern = "_API_HOST"
      
      var keys = Object.keys(freshDotenv)
      var apiLandscapeHostKeys = keys.filter(function(key){
        return key.indexOf(variablePattern) != -1
      })

      var len = apiLandscapeHostKeys.length

      response = []

      for(index = 0; index < len; index++){
        var apiLandscapeHostKey = apiLandscapeHostKeys[index]
        var host = freshDotenv[apiLandscapeHostKey]
        var apiItem = {"api_url": "http://"+ host+"/"}
        response.push(apiItem)
      }
      res.set({ 'content-type': 'application/json' });
      res.send(JSON.stringify(response))
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
