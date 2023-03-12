import { join } from "node:path";
import { deleteSync } from "del";
import { sync as makeDirSync } from "make-dir";
import { spawn } from "./child-process.mjs";
import { getConfig } from "./config.mjs";

const { platform } = process;

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

	get installationPath() {
		return `Games/${this.name}`;
	}

	clean(shouldRemoveAll = false) {
		const { outputPath } = getConfig();

		return deleteSync([shouldRemoveAll ? outputPath : this.path]);
	}

	compile() {
		const { isDev, sourceDir, outputPath } = getConfig();
		const flagsArgs = isDev ? [] : ["-v", "--strip"];

		makeDirSync(outputPath);

		return spawn("pdc", [...flagsArgs, sourceDir, this.path]);
	}

	simulate() {
		const [command, args] =
			platform === "darwin"
				? ["open", ["-g", this.path]]
				: [
						`PlaydateSimulator${platform === "win32" ? ".exe" : ""}`,
						[this.path],
				  ];

		return spawn(command, args);
	}

	install() {
		return spawn("pdutil", ["install", this.path]);
	}

	launch() {
		return spawn("pdutil", ["run", this.installationPath]);
	}
}
