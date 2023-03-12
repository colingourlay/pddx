import { PDX } from "../PDX.mjs";

export default () => {
	const pdx = new PDX();
	const { done, kill, getOutText } = pdx.launch();

	console.log(`Launching ${pdx.name}...`);

	done.then(() => {
		const outText = getOutText().trim();

		if (outText.indexOf("No Playdate") > -1) {
			console.log(
				`Launch failed. Ensure your Playdate is connected and unlocked`
			);
		} else {
			console.log(`Launched ${pdx.name} on connected Playdate`);
		}
	});

	return { done, kill };
};
