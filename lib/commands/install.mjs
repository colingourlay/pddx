import { PDX } from "../PDX.mjs";

export default () => {
	const pdx = new PDX();

	const { done, kill } = pdx.install();

	done.then((exitCode) => {
		if (exitCode === 0) {
			console.log(`Installed ${pdx.name} to connected Playdate`);
		}
	});

	return { done, kill };
};
