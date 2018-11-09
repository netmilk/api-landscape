fs = require('fs')
dotenv = require('dotenv')
editDotenv = require('edit-dotenv')
changeCase = require('change-case')

// export the API Landscape map as API_ENTRYPOINT env variables in dotenv
module.exports = function(grunt){
  grunt.registerTask('export-dotenv-map',function(){
    var mapPath = "./api-landscape/map.json"
    var landscapeMap = JSON.parse(fs.readFileSync(mapPath))
    var variablePattern = "API_ENTRYPOINT"
     
    dotenvPath = '.env'

    // load fresh dotenv
    // remove all API_ENTRYPOINT keys
    // add API_ENTRYPOINT keys from the actual map
    // save dotenv    
    if(fs.existsSync(dotenvPath)){
      var currentDotenvContent = fs.readFileSync(dotenvPath,{encoding: "utf-8"})
      var currentDotenv = dotenv.parse(currentDotenvContent)

      var keys = Object.keys(currentDotenv)
      var apiLandscapeKeys = keys.filter(function(key){
        return key.indexOf(variablePattern) != -1
      })
      grunt.log.writeln("All variables ending with '" + variablePattern + 
          "' were pruned in '"+ dotenvPath +"'")
    } else {
      var currentDotenv = {}
    }
    
    // add DESIGN_NAME_API_ENTRYPOINT keys and vars from the API Landscape map
    landscapeMap.forEach(function(api){
      var envKey = changeCase.constantCase(api['designName']+ "_" + variablePattern)
      var envValue = api['api_url']
      grunt.log.writeln("The key '"+ envKey+ "' will be set to '" + envValue + "' in " + dotenvPath)
      currentDotenv[envKey] = envValue  
    })


    
    var newDotenvContent = editDotenv("", currentDotenv)
    fs.writeFileSync(dotenvPath, newDotenvContent)
 })
}
