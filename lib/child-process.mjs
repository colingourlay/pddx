import { spawn as crossSpawn, sync as crossSpawnSync } from "cross-spawn";
import killAsync from "tree-kill";

const { env } = process;

export const spawn = (command, args) => {
	if (env.DEBUG) {
		console.debug(`${command} ${args.join(" ")}`);
	}

	const childProcess = crossSpawn(command, args, {
		stdio: ["pipe", "pipe", "pipe"],
	});

	let errText = "";
	let outText = "";

	childProcess.stderr.on("data", (buffer) => (errText += String(buffer)));
	childProcess.stdout.on("data", (buffer) => (outText += String(buffer)));

	return {
		done: new Promise((resolve, reject) => {
			childProcess.on("close", (code, signal) => resolve(code, signal));
			childProcess.on("error", (err) => reject(err));
		}),
		kill: () =>
			new Promise((resolve, reject) =>
				killAsync(childProcess.pid, (err) => (err ? reject(err) : resolve()))
			),
		getErrText: () => errText,
		getOutText: () => outText,
	};
};

export const spawnSync = (command, args) => {
	if (env.DEBUG) {
		console.debug(`${command} ${args.join(" ")}`);
	}

	const { output, error } = crossSpawnSync(command, args);

	const firstValidError = error ?? output[0];

	if (firstValidError) {
		throw firstValidError;
	}

	return output[1] ? `${output[1]}` : "";
};

export const createFakeAsyncProcess = (errText, outText) => ({
	done: errText ? Promise.reject(errText) : Promise.resolve(null, null),
	kill: () => Promise.resolve(),
	getErrText: () => errText ?? "",
	getOutText: () => outText,
});
