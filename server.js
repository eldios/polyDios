var HTMLparser = require('./htmlToText'),
    exec = require('child_process').exec ,
    async = require('async'),
    exports = module.exports ;

var findGrm = exports.findGrm = function(grmName, cbk){
  exec('find . -iname \'*'+grmName+'*grm\' -type f' ,
    function (err, stdout, stderr){
      stdout = stdout.replace(/^\s+|\s+$/g,'').split("\n")[0];
      if (cbk != undefined && cbk != null){
        cbk(stdout);
      } else {
        return stdout;
      };
  });
}

var callPolygen = exports.callPolygen = function(grm){
  var grm_file ;
  async.series([
    function(cbk) {
      cbk(null,findGrm(grm));
    } ,
    function(cbk) {
      exec('bin/polygen ' + grm_file ,
        function (error, stdout, stderr) {
          stdout = HTMLparser.htmlToText(stdout);
          cbk(null,stdout);
        });
    }
  ]);
};

var listGrms = exports.listGrms = function(cbk){
  exec('find . -iname \'*grm\' -type f' ,
    function (error, stdout, stderr){
      if (cbk != undefined && cbk != null){
        cbk(stdout.replace(/^\s+|\s+$/g, '').split("\n"));
      } else {
        return stdout.replace(/^\s+|\s+$/g, '').split("\n");
      };
  });
};

var helpOpt = process.ARGV.indexOf('-h') ;
if ( helpOpt > -1 ) {
  console.log(
    ['***polygen nodeJS wrapper***',
    '-l      : list available Grammars',
    '-x grm  : exec polygen on grm file',
    '-h      : print this help'].join("\n"));
  process.exit();
};

var listOpt = process.ARGV.indexOf('-l') ;
if ( listOpt > -1 ) {
  listGrms(console.log);
  process.exit();
};

var callOpt = process.ARGV.indexOf('-x') ; 
if ( callOpt > -1 ) {
  callPolygen(process.ARGV[callOpt+1]);
  process.exit();
};
