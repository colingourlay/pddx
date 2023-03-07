import { PDX } from "../PDX.mjs";

const pdx = new PDX();
const { status } = pdx.simulate();

if (status === 0) {
	console.log(`Opened ${pdx.localPath} in Playdate Simulator`);
}
