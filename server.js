var HTMLparser = require('./htmlToText'),
    exec = require('child_process').exec ,
    async = require('async'),
    exports = module.exports ;

var findGrm = exports.findGrm = function(grmName, cbk, cbk2ndlvl){
  exec('find . -iname \''+grmName+'\.grm\' -type f' ,
    function (err, stdout, stderr){
      stdout = stdout.replace(/^\s+|\s+$/g,'').split("\n")[0];
      if (cbk != undefined && cbk != null && cbk2ndlvl != undefined && cbk2ndlvl != null  && stdout != ''){
        cbk(stdout,cbk2ndlvl);
      } else if (cbk != undefined && cbk != null && stdout != ''){
        cbk(stdout);
      };
  });
}

//  stdout = HTMLparser.htmlToText(stdout);
var callPolygen = exports.callPolygen = function(grm,cbk){
  var callIt = function (grm_file,cbk){
    exec('bin/polygen ' + grm_file, 
      function (error,stdout,stderr){
        stdout = HTMLparser.htmlToText(stdout);
        if (cbk != undefined && cbk != null){
          cbk(stdout);
        };
      })
  };
  findGrm(grm,callIt,console.log);
};

var listGrms = exports.listGrms = function(cbk){
  exec('find . -iname \'*grm\' -type f' ,
    function (error, stdout, stderr){
      stdout=stdout.replace(/^\s+|\s+$/g, '').split("\n"); 
      if (cbk != undefined && cbk != null){
        cbk(stdout);
      };
  });
};

// make following code only if server.js is called from cmdline
if (module.parent == null){
  var helpOpt = process.ARGV.indexOf('-h') ;
  if ( helpOpt > -1 ) {
    console.log(
      ['***polygen nodeJS wrapper***',
      '-l      : list available Grammars',
      '-x grm  : exec polygen on grm file',
      '-f grm  : find grm file',
      '-h      : print this help'].join("\n"));
    process.exit();
  };

  var listOpt = process.ARGV.indexOf('-l') ,
    findOpt = process.ARGV.indexOf('-f') ,
    callOpt = process.ARGV.indexOf('-x') ; 
  if ( findOpt > -1 ) {
    findGrm(process.ARGV[findOpt+1],console.log);
  } else if ( listOpt > -1 ) {
    listGrms(console.log);
  } else if ( callOpt > -1 ) {
    callPolygen(process.ARGV[callOpt+1]);
  };
};