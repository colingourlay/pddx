import { PDX } from "../PDX.mjs";

const pdx = new PDX();
const { status } = pdx.installAndLaunch();

if (status === 0) {
	console.log(`Installed and opened ${pdx.name} on connected Playdate`);
}
