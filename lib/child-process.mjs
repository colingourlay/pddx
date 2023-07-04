import { spawn as crossSpawn } from "cross-spawn";
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
