import { watch as chokidarWatch } from "chokidar";
import { getConfig } from "./config.mjs";

const { pkgPath, sourceDir } = getConfig();

export const watch = async (commands) => {
	const watcher = chokidarWatch([`${sourceDir}/**/*`], {
		cwd: pkgPath,
		ignored: [`${sourceDir}/pdxinfo`, "**/node_modules/**", "**/.git/**"],
		ignoreInitial: true,
	});

	const commandModules = [];

	for (let command of commands) {
		commandModules.push(await import(`./commands/${command || "build"}.mjs`));
	}

	let currentTask;
	let wasKilled = false;

	const executeTasks = async () => {
		wasKilled = false;

		for (let commandModule of commandModules) {
			if (wasKilled) {
				break;
			}

			currentTask = commandModule.default();
			await currentTask.done;
		}
	};

	const killCurrentTask = () => {
		if (currentTask) {
			wasKilled = true;
			currentTask.kill();
		}
	};

	executeTasks();

	watcher.on("all", () => {
		killCurrentTask();
		executeTasks();
	});

	return () => {
		killCurrentTask();
		watcher.close();
	};
};
