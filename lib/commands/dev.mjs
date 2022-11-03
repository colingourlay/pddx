import { sync as spawnSync } from "cross-spawn";
import { getConfig } from "../config.mjs";

const { buildTask, previewTask, sourceDir } = getConfig();
const watchGlobArgs = [`!${sourceDir}/pdxinfo`, `${sourceDir}/**/*`];
const commandArgs = previewTask
	? ["run-s", buildTask, previewTask]
	: [buildTask];

console.log(`Developing...`);

spawnSync("onchange", ["-ik", ...watchGlobArgs, "--", ...commandArgs], {
	stdio: ["pipe", process.stdout, process.stderr],
});
