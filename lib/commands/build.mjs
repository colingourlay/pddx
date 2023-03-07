import { PDX } from "../PDX.mjs";
import { PDXInfo } from "../PDXInfo.mjs";

const pdxinfo = new PDXInfo();
const pdx = new PDX();

pdxinfo.clean();
pdxinfo.write();
pdx.clean();

const { status } = pdx.compile();

if (status === 0) {
	console.log(`Built ${pdx.localPath}`);
}
