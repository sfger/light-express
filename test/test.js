process.chdir('../');
var Extension = require('../extension');
Extension.CompileDir2JS('/share/htpl/').then(function(data){
	console.log("parsed:\n\t"+data.join("\n\t"));
});
