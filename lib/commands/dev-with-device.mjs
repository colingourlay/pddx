import { watch } from "../watcher.mjs";

export default () => {
	console.log(`Developing on connected Playdate...`);

	watch(["build", "install-and-launch"]);
};
