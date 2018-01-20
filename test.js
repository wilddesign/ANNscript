console.log('start');
var fs = require('fs');
var papa = require('papaparse');
var synaptic = require('synaptic');

console.log('deps loaded');

var fname = 'data.csv';

function parseForSyn(csvJSON){
var parsedForSyn = [];
console.log('Training data: ');
	csvJSON.forEach(function(reaction){
		if (reaction[0] && typeof reaction[0] !== 'string'){
		
			var input = reaction;
			var output = input.splice(-2,2);
			var parsedReaction = {
				input: input,
				output: output
			}
			console.log(parsedReaction);
			parsedForSyn.push(parsedReaction);
		}
	});
return parsedForSyn;
};


//load the file, parse it to json and calculate in callback
var datafile = fs.readFile(fname, 'utf8', function(err, data){
	if(err){console.log('Error while loading file: '+ err)}
	else
	{
		console.log('data file found');
			papa.parse(data, {
				dynamicTyping: true,
				comments: "#",
				complete: function(results, datafile){
					console.log('data loaded. calculating...');
					// parse this strange csv derived json to sth normal for synaptic
					var synReady = parseForSyn(results.data);
				/////////////////////////////////////////////
					// init perceptron
					var network = new synaptic.Architect.Perceptron(2,3,2);
					// init trainer
					var trainer = new synaptic.Trainer(network);
					// init training set with data from results.data
					trainer.train(synReady, {
						rate: .01,
						iterations: 200000,
						error: .005,
						shuffle: true,
						cost: synaptic.Trainer.cost.CROSS_ENTROPY
					});
					console.log('Simulated results: ');
					console.log(network.activate([0.01,.1]));

				/////////////////////////////////////////////

				},
				error: function(error, file){
					console.log('Error occured: ' + error);
				}
			});
	}
});


