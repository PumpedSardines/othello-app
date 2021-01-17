onmessage = function (e) {
	for(let i = 0; i < 9999999999; i++) {

	}

	var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
	postMessage(workerResult);
}
