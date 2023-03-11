import { PDX } from "../PDX.mjs";

export default () => {
	const pdx = new PDX();

	const { done, kill } = pdx.lauinstallAndLaunchnch();

	done.then((exitCode) => {
		if (exitCode === 0) {
			console.log(`Installed and opened ${pdx.name} on connected Playdate`);
		}
	});

	return { done, kill };
};
