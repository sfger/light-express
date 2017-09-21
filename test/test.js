var Extension = require('../ext');
process.chdir('../');
Extension.CompileDir2JS('/share/htpl/').then(function(data){
	console.log("parsed:\n\t"+data.join("\n\t"));
});
