import { PDX } from "../PDX.mjs";

export default () => {
	const pdx = new PDX();
	
	console.log(`Launching ${pdx.name}...`);

	const { done, kill, getErrText, getOutText } = pdx.launch();

	done.then(() => {
		const errText = getErrText().trim();
		const outText = getOutText().trim();

		if (outText.indexOf("No Playdate") > -1) {
			console.log(
				`Launch failed. Ensure your Playdate is connected and unlocked`
			);
		} else {
			console.log({errText, outText})
			console.log(`Launched ${pdx.name} on connected Playdate`);
		}
	});

	return { done, kill };
};
