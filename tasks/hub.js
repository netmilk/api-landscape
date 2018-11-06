dotEnv = require('dotenv').config()
module.exports = function(grunt){
  grunt.registerTask('hub', function(){
    done = this.async()


    // FIXME I don't know how to avoid task to end
    setTimeout(function() {
      done();
    }, 1000000000);
  })
}
