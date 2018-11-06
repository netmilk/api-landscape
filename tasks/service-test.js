module.exports = function(grunt){
  // FIXME: this will be service-test:all in the future
  grunt.registerTask("service-test", function(designName){ 
    grunt.task.run([
      'link',
      'generate-dotenv-ports',
      'exec:dredd:' + designName
    ])
    console.log("Is it waiting?")
    // link the contracts
    // assign dotenv
    // inject dotenv into dredd
    // run dredd
    // - dredd runs on the dotenv port
    // - dredd runs the server on the dotenv port
    // - dredd fetches the contract from the discovery endpoint
    // - runs the tests
  })
}
