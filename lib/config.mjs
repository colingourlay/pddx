import { resolve } from "node:path";
import { loadJsonFileSync } from "load-json-file";
import { packageDirectorySync } from "pkg-dir";
import { readPackageSync } from "read-pkg";
import { cacheable } from "./cache.mjs";

const DEFAULTS = {
	sourceDir: "source",
	outputDir: "dist",
	pdxinfo: {},
};

export const getConfig = cacheable("config", () => {
	const pkg = readPackageSync();
	const pkgDir = packageDirectorySync();
	let options;

	try {
		options = loadJsonFileSync(resolve(pkgDir, "playdate.json"));
	} catch (e) {
		options = typeof pkg.playdate === "object" ? pkg.playdate : {};
	}

	const settings = {
		...DEFAULTS,
		...options,
	};

	return {
		...settings,
		sourcePath: resolve(pkgDir, settings.sourceDir),
		outputPath: resolve(pkgDir, settings.outputDir),
		isDev: process.env.NODE_ENV !== "production",
		pkg,
		pkgPath: pkgDir,
	};
});
