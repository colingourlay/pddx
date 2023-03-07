import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { deleteSync } from "del";
import semverParse from "semver/functions/parse.js";
import { cacheable } from "./cache.mjs";
import { getConfig } from "./config.mjs";

const normaliseAuthor = (author) => {
	if (typeof author === "string") {
		const [name, email] = author.split(/\s<|>/);

		return {
			name,
			email,
		};
	}

	return author;
};

const getPkgAuthor = cacheable("pkg-author", () => {
	const { pkg } = getConfig();
	const { author, contributors, maintainers } = pkg;

	return normaliseAuthor(
		author
			? author
			: maintainers && maintainers.length > 0
			? maintainers[0]
			: contributors && contributors.length > 0
			? contributors[0]
			: null
	);
});

const QUALIFIER_NAME_MAP = {
	pre: 0,
	a: 1,
	alpha: 1,
	b: 2,
	beta: 2,
	rc: 3,
};

const getBuildNumberFromVersion = () => {
	const { pkg } = getConfig();
	const { major, minor, patch, prerelease } = semverParse(pkg.version);
	const [qualifierName, qualifierIndex] = prerelease;
	const qualifierNameComponent =
		qualifierName in QUALIFIER_NAME_MAP
			? QUALIFIER_NAME_MAP[qualifierName]
			: qualifierName
			? 8
			: 9;
	const qualifierIndexComponent =
		typeof qualifierIndex === "number"
			? qualifierIndex % 1e2
			: qualifierName
			? 0
			: 99;

	return (
		major * 1e9 +
		minor * 1e6 +
		patch * 1e3 +
		qualifierNameComponent * 1e2 +
		qualifierIndexComponent
	);
};

const getPotentiallyQualifierBasedPropValue = (pdxinfoPropValue) => {
	const { pkg } = getConfig();

	let value;

	if (typeof pdxinfoPropValue === "string") {
		value = pdxinfoPropValue;
	} else if (typeof pdxinfoPropValue === "object") {
		const { prerelease } = semverParse(pkg.version);
		const [qualifierName] = prerelease;

		value =
			qualifierName && pdxinfoPropValue[qualifierName]
				? pdxinfoPropValue[qualifierName]
				: pdxinfoPropValue.default;
	}

	return value || null;
};

const PROPS = {
	name: null,
	description: null,
	author: (pdxinfoPropValue) => {
		const author = normaliseAuthor(pdxinfoPropValue || getPkgAuthor());

		return author ? author.name : null;
	},
	bundleID: (pdxinfoPropValue) => {
		if (pdxinfoPropValue) {
			return pdxinfoPropValue;
		}

		const { pdxinfo, pkg } = getConfig();
		const author = normaliseAuthor(pdxinfo.author || getPkgAuthor());
		const domain = (
			author
				? author.email
					? author.email.split("@")[1]
					: `${author.name.replaceAll(/[^\w]/g, "").toLowerCase()}.com`
				: "example.com"
		).split(".");

		return [pkg.name, ...domain].reverse().join(".");
	},
	version: new Error("No `version` found in package.json"),
	buildNumber: () => {
		const { pkg } = getConfig();
		const { version } = pkg;

		return getBuildNumberFromVersion(version);
	},
	imagePath: (pdxinfoPropValue) => {
		return getPotentiallyQualifierBasedPropValue(pdxinfoPropValue);
	},
	launchSoundPath: (pdxinfoPropValue) => {
		return getPotentiallyQualifierBasedPropValue(pdxinfoPropValue);
	},
	contentWarning: null,
	contentWarning2: null,
};

export class PDXInfo {
	constructor() {
		const { pdxinfo, pkg } = getConfig();

		this.props = Object.entries(PROPS).reduce((memo, [key, valueOrFn]) => {
			const value =
				typeof valueOrFn === "function"
					? valueOrFn(pdxinfo[key])
					: pdxinfo[key] || pkg[key] || valueOrFn;

			if (value instanceof Error) {
				throw value;
			}

			if (value === null) {
				return memo;
			}

			return {
				...memo,
				[key]: value,
			};
		}, {});

		Object.freeze(this.props);
	}

	get localPath() {
		const { sourceDir } = getConfig();

		return join(sourceDir, "pdxinfo");
	}

	get path() {
		const { sourcePath } = getConfig();

		return join(sourcePath, "pdxinfo");
	}

	clean() {
		return deleteSync([this.path]);
	}

	serialize() {
		return Object.entries(this.props).reduce(
			(memo, [key, value]) =>
				`${memo}${memo.length > 0 ? "\n" : ""}${key}=${value}`,
			""
		);
	}

	write() {
		const { isDev } = getConfig();
		const content = this.serialize();

		writeFileSync(this.path, content);

		if (!isDev) {
			console.log("[pdxinfo]");
			console.log(`${content}\n`);
		}
	}
}
