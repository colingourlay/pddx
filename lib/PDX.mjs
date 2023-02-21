import { join } from "node:path";
import { sync as spawnSync } from "cross-spawn";
import { getConfig } from "./config.mjs";

export class PDX {
	constructor() {
		const { isDev, pkg } = getConfig();
		const { name, version } = pkg;

		this.name = `${name}-${isDev ? "dev" : version}.pdx`;
	}

	get localPath() {
		const { outputDir } = getConfig();

		return join(outputDir, this.name);
	}

	get path() {
		const { outputPath } = getConfig();

		return join(outputPath, this.name);
	}

	compile() {
		const { isDev, sourceDir } = getConfig();
		const pdcOptions = isDev ? [] : ["-v", "--strip"];

		if (!isDev) {
			console.log("[pdc]");
		}

		spawnSync("pdc", [...pdcOptions, sourceDir, this.path], {
			stdio: ["pipe", process.stdout, process.stderr],
		});

		if (!isDev) {
			console.log("");
		}
	}
}
