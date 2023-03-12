import installTask from "./install.mjs";
import launchTask from "./launch.mjs";

const delay = (timeMS) =>
	new Promise((resolve) => setTimeout(() => resolve(), timeMS));

export default async () => {
	const { done } = installTask();

	await done;

	await delay(500);

	return launchTask();
};
