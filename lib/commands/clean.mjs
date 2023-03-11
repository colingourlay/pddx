import { PDX } from "../PDX.mjs";
import { PDXInfo } from "../PDXInfo.mjs";

export default () => {
	const pdxinfo = new PDXInfo();
	const pdx = new PDX();
	const cleaned = [...pdxinfo.clean(), pdx.clean(true)];

	if (cleaned.length > 0) {
		console.log(["Cleaned:", ...cleaned].join("\n - "));
	} else {
		console.log("Nothing to clean");
	}
};
