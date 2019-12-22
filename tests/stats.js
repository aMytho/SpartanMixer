// This file stores all of your viewers points after they have types !pointS
var methods = {
	timestamp: function() {
		console.log('Current Time in Unix Timestamp: ' + Math.floor(Date.now() / 1000));
	},
	currentDate: function() {
		console.log('Current Date is: ' + new Date().toISOString().slice(0, 10));
	}
};

exports.data = methods;


