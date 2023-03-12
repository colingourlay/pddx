import { PDX } from "../PDX.mjs";

export default () => {
	const pdx = new PDX();
	const { done, kill, getOutText } = pdx.install();

	console.log(`Installing ${pdx.name}...`);

	done.then(() => {
		const outText = getOutText().trim();

		if (outText.indexOf("No Playdate") > -1) {
			console.log(
				`Installation failed. Ensure your Playdate is connected and unlocked`
			);
		} else {
			console.log(`Installed ${pdx.name} on connected Playdate`);
		}
	});

	return { done, kill };
};
