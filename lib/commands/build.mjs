import { PDX } from "../PDX.mjs";
import { PDXInfo } from "../PDXInfo.mjs";

export default () => {
	const pdxinfo = new PDXInfo();
	const pdx = new PDX();

	pdxinfo.clean();
	pdxinfo.write();
	pdx.clean();

	const { done, kill } = pdx.compile();

	done.then((exitCode) => {
		if (exitCode === 0) {
			console.log(`Built ${pdx.localPath}`);
		}
	});

	return { done, kill };
};
