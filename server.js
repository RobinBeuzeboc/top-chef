
var childProcess = require('child_process');

function runScript(scriptPath, callback) {

    // keep track of whether callback has been invoked to prevent multiple invocations
    var invoked = false;

    var process = childProcess.fork(scriptPath);

    // listen for errors as they may prevent the exit event from firing
    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}




//scraping michelin

function first(){
	 return new Promise(function(resolve, reject){
		runScript('./mods/link_scrapper.js', function(err){
		  if (err) throw err;
			console.log('finished running link_scrapper.js');
			second();
			
		});
		resolve();
		 
	 });
	
}

function second(){
	 return new Promise(function(resolve, reject){
		runScript('./mods/michelin.js', function(err){
			if (err) throw err;
			console.log('finished running michelin.js, scapping complete');
			third();
		});
		resolve();
	 });
}



// Scrap lafourchette 
function third(){
	 return new Promise(function(resolve, reject){
		runScript('./mods/lafourchette.js', function(err){
		  if (err) throw err;
			console.log('finished running lafourchette.js, scrapping complete');
			fourth();
		});
		resolve();

});
}

// Scrap promotions
function fourth(){
	 	 return new Promise(function(resolve, reject){
		runScript('./mods/promotions.js', function(err){
		  if (err) throw err;
			console.log('finished running promotions.js, search for promotions complete');
		});
		resolve();
});
}



first();



