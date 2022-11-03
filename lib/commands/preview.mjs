import { sync as spawnSync } from "cross-spawn";
import { PDX } from "../PDX.mjs";

const pdx = new PDX();

const { status } = spawnSync("open", ["-g", pdx.path], {
	stdio: ["pipe", process.stdout, process.stderr],
});

if (status === 0) {
	console.log(`Previewed: ${pdx.localPath}`);
}
