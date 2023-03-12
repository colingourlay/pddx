import { spawn as crossSpawn } from "cross-spawn";
import kill from "tree-kill";

const { env, stderr, stdout } = process;

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
		done: new Promise((resolve) => {
			childProcess.on("close", () => resolve(childProcess.exitCode));
		}),
		kill: () => {
			kill(childProcess.pid);
		},
		getErrText: () => errText,
		getOutText: () => outText,
	};
};
