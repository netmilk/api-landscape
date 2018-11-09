var rimraf = require('rimraf')
var fs = require('fs')
var path = require('path')

module.exports = function(grunt){
  // Extract the API Specifications from the pacakges and link them
  grunt.registerTask('link', function(){
    // check if it has 'goodapi' property
    // check if there are any provided or consumed designs in the property
    // check all provided and consumed designs are a (dev?)dependency
    // check all provided and cosnumed designs are installed packages
    // find the packages directories
    // find the exported landscape directories - this is static atm
    // nuke the previously existing landscape directory
    // create the landscape directory
    // create `consuming` and `providing` directories in the landscape directory
    // create api design name directories in each
    // link the contents of the build
    var pkgNamespace = grunt.config('apiLandscape.API_LANDSCAPE_PACKAGE_JSON_NAMESPACE')

    var done = this.async();
    if(! fs.existsSync('package.json')){
      return done(new Error("package.json not found. Is this an API Landscape project directory?"));
    }
    
    cwdPkg = JSON.parse(fs.readFileSync('package.json', {encoding: 'utf-8'}));

    if(! cwdPkg[pkgNamespace]){
      return done(new Error("API Landscpe project configuration not found in package.json. " +
      " Try `api-landscape init`"))
    }

    if(! cwdPkg[pkgNamespace]['service']){
      return done(new Error("Not a Good API 'service' component. /goodapi/service not found" + 
      " in package.json"))
    }

    var provide = cwdPkg[pkgNamespace]['service']['provide'];
    var consume = cwdPkg[pkgNamespace]['service']['consume'];
    
    if(provide == false && consume == false) {
      grunt.log.writeln("No API designs to 'provide' or 'consume' under the 'goodapi' " +     
      "property in package.json. Doing nothing.")
      return done()
    }

    // Prepare directories
    // FIXME This should be executed after validating the dependenies and their install dirs
    if(! fs.existsSync('api-landscape')){
      fs.mkdirSync('api-landscape')
    }

    // cleanup previous links in provide/consume
    rimraf.sync('api-landscape/provide')
    rimraf.sync('api-landscape/consume')
 
    //TODO Consider changing the directory names to privding and consiming instead
    if(! fs.existsSync('api-landscape/provide')){
      fs.mkdirSync('api-landscape/provide')
    }

    if(! fs.existsSync('api-landscape/consume')){
      fs.mkdirSync('api-landscape/consume')
    }
  
    grunt.log.writeln("API Landscape dirs created")

    // Find provided dependencies
    // FIXME provide and consume may be just string - one item:
    if(Array.isArray(provide)){
      var len = provide.length
      for(var index = 0; index < len; index++){ 
        var designName = provide[index];
        //TODO reevaluate if this should be in dependencies and not in dev dependenceis
        if(! cwdPkg['dependencies'][designName]){
          return done(new Error("Package for the provided API design name '" + designName + 
          "' not found in the 'dependencies' in package.json. Add it."        
          ))
        }
       
        try {
          var modulePath = path.dirname(require.resolve(designName))
        } catch(e) {
          return done(new Error("Can't resolve module path for the provided API design name '"+
          designName +"'. Try installing it or debug 'require.resolve('" + designName + "')'"))
        } 

        console.log("module path")
        console.log("modulePath")

        moduleSpecPath = path.resolve(path.join(modulePath, '/build/spec/'))
        localSpecPath = path.resolve(path.join('api-landscape','provide', designName))
       
        fs.symlinkSync(moduleSpecPath, localSpecPath, 'dir')
        grunt.log.writeln("Provided API Design '"+ designName  +"' linked.")
      }
    }

    // Find consumed dependencies
    if(Array.isArray(consume)){
      var len = consume.length
      for(var index = 0; index < len; index++){ 
        var designName = consume[index];
        //TODO reevaluate if this should be in dependencies and not dev dependenceis
        if(! cwdPkg['dependencies'][designName]){
          return done(new Error("Package for the consumed API design name '" + designName + 
          "' not found in the 'dependencies' in package.json. Add it."        
          ))
        }
 
        try {
          var modulePath = path.dirname(require.resolve(designName))
        } catch(e) {
          return done(new Error("Can't resolve module path for the consumed API design name '"+
          designName +"'. Try installing it or debug 'require.resolve('" + designName + "')'"))
        } 
        
        moduleSpecPath = path.resolve(path.join(modulePath, '/build/spec/'))
        localSpecPath = path.resolve(path.join('api-landscape','consume', designName))

        //Cleanup
        if(fs.existsSync(localSpecPath)){
          rimraf.sync(localSpecPath);
        }
        
        fs.symlinkSync(moduleSpecPath, localSpecPath, 'dir')
        grunt.log.writeln("Consumed API Design '"+ designName  +"' linked.")
      }
    }

    done() 
  })
}
