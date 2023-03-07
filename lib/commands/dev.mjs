import { spawn } from "../child-process.mjs";
import { getConfig } from "../config.mjs";

const { buildTask, simulateTask, sourceDir } = getConfig();
const watchGlobArgs = [`!${sourceDir}/pdxinfo`, `${sourceDir}/**/*`];
const commandArgs = simulateTask
	? ["run-s", buildTask, simulateTask]
	: ["npm", "run", buildTask];

console.log(`Developing...`);

spawn("onchange", ["-ik", ...watchGlobArgs, "--", ...commandArgs]);
