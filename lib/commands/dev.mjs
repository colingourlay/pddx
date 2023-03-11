import { watch } from "../watcher.mjs";

export default () => {
	console.log(`Developing...`);

	watch(["build", "simulate"]);
};
