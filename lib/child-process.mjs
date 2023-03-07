import { sync as spawnSync } from "cross-spawn";

const { env, stderr, stdout } = process;

export const spawn = (command, args) => {
	if (env.DEBUG) {
		console.debug(`${command} ${args.join(" ")}`);
	}

	return spawnSync(command, args, {
		stdio: ["pipe", stdout, stderr],
	});
};
