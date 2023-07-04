import { PDX } from "../PDX.mjs";
import { PDXInfo } from "../PDXInfo.mjs";

export default () => {
	const pdxinfo = new PDXInfo();
	const pdx = new PDX();

	pdxinfo.clean();
	pdxinfo.write();
	pdx.clean();

	console.log(`Building ${pdx.localPath}...`);

	const startTime = Date.now();
	const { done, kill } = pdx.compile();

	done.then((exitCode) => {
		if (exitCode === 0) {
			const endTime = Date.now();
			const diffMS = endTime - startTime;
			const diffFormatted =
				diffMS > 1e3 ? `${(diffMS / 1000).toFixed(2)}s` : `${diffMS}ms`;

			console.log(`Built ${pdx.localPath} in ${diffFormatted}`);
		}
	});

	return { done, kill };
};
