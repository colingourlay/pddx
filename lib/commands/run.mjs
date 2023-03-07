import { PDX } from "../PDX.mjs";

const pdx = new PDX();
const { status } = pdx.launch();

if (status === 0) {
	console.log(`Opened ${pdx.name} on connected Playdate`);
}
