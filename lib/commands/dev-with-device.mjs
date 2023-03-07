import { spawn } from "../child-process.mjs";
import { getConfig } from "../config.mjs";

const { buildTask, installAndLaunchTask, sourceDir } = getConfig();
const watchGlobArgs = [`!${sourceDir}/pdxinfo`, `${sourceDir}/**/*`];
const commandArgs = installAndLaunchTask
	? ["run-s", buildTask, installAndLaunchTask]
	: ["npm", "run", installAndLaunchTask];

console.log(`Developing with device...`);

spawn("onchange", ["-ik", ...watchGlobArgs, "--", ...commandArgs]);
