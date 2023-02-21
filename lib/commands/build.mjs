import { deleteSync } from "del";
import { sync as makeDirSync } from "make-dir";
import { getConfig } from "../config.mjs";
import { PDX } from "../PDX.mjs";
import { PDXInfo } from "../PDXInfo.mjs";

const { outputDir } = getConfig();
const pdx = new PDX();
const pdxinfo = new PDXInfo();

deleteSync([pdx.path, pdxinfo.path]);
makeDirSync(outputDir);
pdxinfo.write();
pdx.compile();

console.log(`Built: ${pdx.localPath}`);
