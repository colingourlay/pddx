import { PDX } from "../PDX.mjs";

export default () => {
	const pdx = new PDX();

	const { done, kill } = pdx.simulate();

	console.log(`Opened ${pdx.localPath} in Playdate Simulator`);

	return { done, kill };
};
