import { existsSync } from "node:fs";
import { join } from "node:path";
import {
	spawn as nativeSpawn,
	spawnSync as nativeSpawnSync,
} from "node:child_process";
import { deleteSync } from "del";
import { sync as makeDirSync } from "make-dir";
import { spawn, spawnSync, createFakeAsyncProcess } from "./child-process.mjs";
import { getConfig } from "./config.mjs";

const { platform } = process;

const getDevicePath = () => {
	// TODO: This currently only suppports macOS. Extend for Linux
	const devicesPath = "/dev";
	const lsOutput = spawnSync("ls", [devicesPath]);
	const [deviceFile] = lsOutput.match(/cu\.usbmodemPD[\w_]+/) || [];

	return deviceFile ? `${devicesPath}/${deviceFile}` : null;
};

const getDataDiskPath = () => {
	// TODO: This currently only suppports macOS. Extend for Linux
	return "/Volumes/PLAYDATE";
};

const sleep = (time = 2) => spawnSync("sleep", [time]);

const ensureDataDiskIsMounted = () => {
	// TODO: This currently only suppports macOS. Extend for Linux & Windows
	const dataDiskPath = getDataDiskPath();

	if (!existsSync(dataDiskPath)) {
		const devicePath = getDevicePath();

		spawnSync("pdutil", [devicePath, "datadisk"]);
		sleep();
	}
};

const ensureDataDiskIsUnmounted = () => {
	// TODO: This currently only suppports macOS. Extend for Linux & Windows
	const dataDiskPath = getDataDiskPath();

	if (existsSync(dataDiskPath)) {
		spawnSync("diskutil", ["eject", dataDiskPath]);
		sleep();
	}
};

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
		ensureDataDiskIsUnmounted();

		if (platform === "win32") {
			return spawn("pdutil", ["install", this.path]);
		} else if (platform !== "darwin") {
			// TODO: Implement Linux
			return createFakeAsyncProcess(null, "Unsupported Platform");
		}

		const devicePath = getDevicePath();

		if (!devicePath) {
			return createFakeAsyncProcess(null, "No Playdate");
		}

		const dataDiskPath = getDataDiskPath();

		ensureDataDiskIsMounted();

		try {
			nativeSpawnSync("cp", [
				"-r",
				`"${this.path}"`,
				`"${dataDiskPath}/${this.installationPath}"`,
			]);
		} catch (err) {
			console.log("err\n", err);
		}

		// spawnSync("rsync", [
		// 	"--delete",
		// 	"-vr",
		// 	this.path,
		// 	`"${dataDiskPath}/Games/"`,
		// ]);

		// return spawn("rsync", [
		// 	"-zarv",
		// 	"--size-only",
		// 	"--prune-empty-dirs",
		// 	`"${this.path}"`,
		// 	`"${dataDiskPath}/Games/"`,
		// ]);

		// try {
		// 	spawnSync("rsync", [
		// 		"-zarv",
		// 		"--size-only",
		// 		"--prune-empty-dirs",
		// 		`"${this.path}"`,
		// 		`"${dataDiskPath}/Games/"`,
		// 	]);
		// } catch (err) {
		// 	console.log("err\n", err);
		// }

		return createFakeAsyncProcess(null, "");
	}

	launch() {
		ensureDataDiskIsUnmounted();

		if (platform === "win32") {
			return spawn("pdutil", ["run", this.installationPath]);
		} else if (platform !== "darwin") {
			// TODO: Implement Linux
			return createFakeAsyncProcess(null, "Unsupported Platform");
		}

		const devicePath = getDevicePath();

		if (!devicePath) {
			return createFakeAsyncProcess(null, "No Playdate");
		}

		return spawn("pdutil", [devicePath, "run", this.installationPath]);
	}
}
