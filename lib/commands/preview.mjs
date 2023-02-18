import { sync as spawnSync } from "cross-spawn";
import { PDX } from "../PDX.mjs";

const { platform, stdout, stderr } = process;

const pdx = new PDX();

const [command, args] =
	platform === "darwin"
		? ["open", ["-g", pdx.path]]
		: [`PlaydateSimulator${platform === "win32" ? ".exe" : ""}`, [pdx.path]];

const { status } = spawnSync(command, args, {
	stdio: ["pipe", stdout, stderr],
});

if (status === 0) {
	console.log(`Previewed: ${pdx.localPath}`);
}
