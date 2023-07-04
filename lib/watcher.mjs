import { watch as chokidarWatch } from "chokidar";
import { getConfig } from "./config.mjs";

const { pkgPath, sourceDir } = getConfig();

export const watch = async (commands) => {
	const watcher = chokidarWatch([`${sourceDir}/**/*`], {
		cwd: pkgPath,
		ignored: [`${sourceDir}/pdxinfo`, "**/node_modules/**", "**/.git/**"],
		ignoreInitial: true,
		awaitWriteFinish: {
			stabilityThreshold: 800,
			pollInterval: 200,
		},
	});

	const commandModules = [];

	for (let command of commands) {
		commandModules.push(await import(`./commands/${command || "build"}.mjs`));
	}

	let currentTask = null;

	const killCurrentTask = async () => {
		if (currentTask !== null) {
			try {
				await currentTask.kill();
			} catch (err) {}
			currentTask = null;
		}
	};

	const executeTasks = async () => {
		for (let commandModule of commandModules) {
			try {
				currentTask = commandModule.default();
				await currentTask.done;
				currentTask = null;
			} catch (err) {
				break;
			}
		}
	};

	watcher.on("all", async () => {
		await killCurrentTask();
		executeTasks();
	});

	executeTasks();

	return async () => {
		await killCurrentTask();
		watcher.close();
	};
};
