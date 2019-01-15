var fs = require('fs')

module.exports = function(grunt){
  grunt.registerTask('sprinkle', function(){
    // add (sprinkle) the lifecycle metadata to the bundled, compiled JSON API Specification
    // - finds package.json
    // - check if this is a design project
    // - adds cannonical design name (the package name)
    // - adds version (from the package)

    var done = this.async();

    if(! fs.existsSync('package.json')){
      return done(new Error("package.json not found. Is this the project directory?"));
    }
    
    cwdPkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf-8'}));

    if(! cwdPkg[grunt.config('apiLandscape.API_LANDSCAPE_PACKAGE_JSON_NAMESPACE')]){
      return done(new Error("API Landscape project configuration not found in the package.json. " +
      " Try `api-landscape init`"))
    }

    if(! cwdPkg[grunt.config('apiLandscape.API_LANDSCAPE_PACKAGE_JSON_NAMESPACE')]['design']){
      return done(new Error("Not an API Landscape design component. '/api-landscape/design' not found " +
      "in package.json"))
    }
    
    //TODO This should be configurable in the design component package.json
    var specPath = "build/spec/openapi.json"
    
    if(! fs.existsSync(specPath)){
      return done(new Error("The API Specification build not found in `" + specPath + "`"));  
    }
    
    apiSpec = JSON.parse(fs.readFileSync(specPath, {encoding: 'utf-8'}))

    if(! apiSpec['info']){
      apiSpec['info'] = {};
    };
    
    // Sprinkle the package.json into the API spec
    apiSpec['info']['version'] = cwdPkg['version']

    if(! apiSpec['info']['x-lifecycle']){
      apiSpec['info']['x-lifecycle'] = {}
    }

    // Sprinkle package.json package name into the API sapc
    apiSpec['info']['x-lifecycle']['name'] = cwdPkg['name'];

    fs.writeFileSync(specPath, JSON.stringify(apiSpec, null, 2))
    done()

    // TODO 
    // - Model the lifecycle metadata object - maybe and api.json later and add (links) to
    // - github
    // - package (in a repository)
    // - changelog
  
  })


}
