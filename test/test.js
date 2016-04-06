process.chdir('../');
var Extension = require('../extension');
Extension.CompileDir2JS('/sfger/htpl/').then(function(data){
	console.log("parsed:\n\t"+data.join("\n\t"));
});
