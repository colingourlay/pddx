import { spawn as crossSpawn } from "cross-spawn";
import kill from "tree-kill";

const { env, stderr, stdout } = process;

export const spawn = (command, args) => {
	if (env.DEBUG) {
		console.debug(`${command} ${args.join(" ")}`);
	}

	const childProcess = crossSpawn(command, args, {
		stdio: ["pipe", stdout, stderr],
	});

	return {
		done: new Promise((resolve) => {
			childProcess.on("close", () => resolve(childProcess.exitCode));
		}),
		kill: () => {
			kill(childProcess.pid);
		},
	};
};
