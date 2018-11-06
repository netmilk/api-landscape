var portastic = require('portastic')
var dotenv = require('dotenv')
var changeCase = require('change-case');
var editDotenv = require('edit-dotenv');
var fs = require('fs')
var path = require('path')


module.exports = function(grunt){
  grunt.registerTask('generate-dotenv-ports', function(){
    // locally, by default there are no alternative fqdns available other than localhost
    // unless thinkering with /etc/hosts or local DNS so the virtual fqdns must be emulated
    // by diferent ports on localhost

    // this is an equivalent to the crypting non-deterministic deployment URLs
    // this action MUST be independent on the package.json provide/consume config

    // it traverzes api-landscape directory
    // for each directory in provide and cosume it loads API spec
    // the dirname and x-lifecycle-name id MUST match 
    // ^^^ NOT sure, not NOW, it can be decoupled from discovery
    // FIXME ^^^ SURE! The discovery wouldn't work

    // FIXME in case the design name is both provided and cosumed the consumed port will override
    // it creates the dotenv file
    // it adds to the dotenv file with env variables for the mocked consumed services to listen on
    // local discovery hub exports will look into these env vars and export that
    // env var key format: [DESIGN_NAME]_API_HOST e.g. MY_AWESOME_API_API_HOST
    // env var value format: fqdn:port 
    // - format https://nodejs.org/api/url.html#url_url_host
    // - http://bl.ocks.org/abernier/3070589

    // this should be done conciesly only once unless something has changed in the landscape
    // thus it won't update the already exising values in the dotenv
    
    done = this.async()

    var getDirectoryNames = function(dirPath) {
      return fs.readdirSync(dirPath).map(function(name) {
        return path.join(dirPath, name)
      }).filter(function(currentItem){
        currentStat = fs.lstatSync(currentItem)
        return (currentStat.isDirectory() || currentStat.isSymbolicLink())
      }).map(function(currentPath){
        return path.basename(currentPath)
      })
    }

    // calls callback, first argument possible error, second an object with listed ports
    var getAvailablePorts = function(callback){
      var availablePorts = {}
      portastic.find({min: 3000, max: 3099}, function(availableProvidePorts){
        availablePorts['provide'] = availableProvidePorts

        portastic.find({min: 8000, max: 8099}, function(availableConsumePorts){
          availablePorts['consume'] = availableConsumePorts
            callback(null, availablePorts)
        })
      })
    }

    designNameToEnvVarName = function(designName){
     //FIXME this doesn't work for namespaced (organisation's) npm packages:
     // e.g.: @netmilk/eat-my-shorts > 'NETMILK_EAT_MY_SHORTS'
     return changeCase.constantCase(designName) + "_API_HOST"
    }

    providedDesignNames = getDirectoryNames('api-landscape/provide')
    consumedDesignNames = getDirectoryNames('api-landscape/consume')
    
    var generatedEnv = {}
    getAvailablePorts(function(error, availablePorts){
      providedDesignNames.forEach(function(designName){
        key = designNameToEnvVarName(designName)
        value = "localhost:" + availablePorts['provide'].shift()
        generatedEnv[key] = value
      })

      consumedDesignNames.forEach(function(designName){
        key = designNameToEnvVarName(designName)
        value = "localhost:" + availablePorts['consume'].shift()
        generatedEnv[key] = value
      })
      

      var dotEnvPath = '.env'
      if(fs.existsSync(dotEnvPath)){
        var currentDotEnvContent = fs.readFileSync(dotEnvPath,{encoding: "utf-8"})
        var currentDotEnv = dotenv.parse(currentDotEnvContent)
        
        //Lookup already added API-HOSTS in current dotenv and remove them 
        variablePattern = "API_HOST"
        var keys = Object.keys(currentDotEnv)
        var apiLandscapeKeys = keys.filter(function(key){
          return key.indexOf(variablePattern) != -1
        })
        grunt.log.writeln("All variables ending with '" + variablePattern + 
            "' were pruned in '"+ dotEnvPath +"'")


        var len = apiLandscapeKeys.length;
        for(index = 0; index < len; index++){
          var alreadyAssignedKeyInCurrentEnv = apiLandscapeKeys[index]
          delete currentDotEnv[alreadyAssignedKeyInCurrentEnv]
        }

        //Update or add keys to dotenv
        var keys = Object.keys(generatedEnv)
        var len = keys.length
        for(index = 0; index < len; index++){
          generatedKeyToAdd = keys[index]
         
          currentDotEnv[generatedKeyToAdd] = generatedEnv[generatedKeyToAdd];  
          grunt.log.writeln("The key " + generatedKeyToAdd + " set to " + 
            currentDotEnv[generatedKeyToAdd] + " in '" + dotEnvPath + "'.") 
       }
        
        var newDotEnvContent = editDotenv("", currentDotEnv)
      } else {
        var newDotEnvContent = editDotenv("", generatedEnv)
      }

      fs.writeFileSync(dotEnvPath, newDotEnvContent)
      done()
    }) 
  })

}
