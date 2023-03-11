import { PDX } from "../PDX.mjs";

export default () => {
	const pdx = new PDX();

	const { done, kill } = pdx.launch();

	done.then((exitCode) => {
		if (exitCode === 0) {
			console.log(`Opened ${pdx.name} on connected Playdate`);
		}
	});

	return { done, kill };
};
