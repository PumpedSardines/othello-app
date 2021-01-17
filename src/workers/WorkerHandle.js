export default (worker, input) => {
	worker.postMessage(input);

	return new Promise((resolve) => {
		worker.onmessage = function (event) {
			resolve(event.data);
		};
	});
}

/*

import Worker from "./workers/othello-eval.worker.js";
import WorkerHandle from "./workers/WorkerHandle.js";

const worker = new Worker();

WorkerHandle(worker,[2,2]).then(v => {
	console.log(v);
})

*/
