import { deleteSync } from "del";
import { getConfig } from "../config.mjs";
import { PDXInfo } from "../PDXInfo.mjs";

const { outPath } = getConfig();
const pdxinfo = new PDXInfo();
const deleted = deleteSync([pdxinfo.path, outPath]);

if (deleted.length > 0) {
	console.log(["Cleaned:", ...deleted].join("\n  "));
} else {
	console.log("Nothing to clean");
}
