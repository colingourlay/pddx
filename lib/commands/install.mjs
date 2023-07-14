import { PDX } from "../PDX.mjs";

export default () => {
	const pdx = new PDX();

	console.log(`Installing ${pdx.name}...`);

	const { done, kill, getOutText, getErrText } = pdx.install();

	done.then(() => {
		const errText = getErrText().trim();
		const outText = getOutText().trim();

		if (errText) {
			console.log(
				`Installation failed. Error:\n${errText}`
			);
		} else if (outText.indexOf("No Playdate") > -1) {
			console.log(
				`Installation failed. Ensure your Playdate is connected and unlocked`
			);
		} else if (outText.indexOf("Unsupported Platform") > -1) {
			console.log(
				`Installation failed. This platform is not supported yet.`
			);
		} else {
			console.log(outText);
			console.log(getErrText());
			console.log(`Installed ${pdx.name} on connected Playdate`);
		}
	});

	return { done, kill };
};
