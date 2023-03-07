import { PDX } from "../PDX.mjs";

const pdx = new PDX();
const { status } = pdx.install();

if (status === 0) {
	console.log(`Installed ${pdx.name} to connected Playdate`);
}
