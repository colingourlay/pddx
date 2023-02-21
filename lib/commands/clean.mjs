import { deleteSync } from "del";
import { getConfig } from "../config.mjs";
import { PDXInfo } from "../PDXInfo.mjs";

const { outputPath } = getConfig();
const pdxinfo = new PDXInfo();
const deleted = deleteSync([pdxinfo.path, outputPath]);

if (deleted.length > 0) {
	console.log(["Cleaned:", ...deleted].join("\n  "));
} else {
	console.log("Nothing to clean");
}
