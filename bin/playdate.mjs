#!/usr/bin/env node

const ALIASES = {
	b: "build",
	c: "clean",
	d: "dev",
	dd: "dev-with-device",
	i: "install",
	il: "install-and-launch",
	l: "launch",
	s: "simulate",
};
const COMMANDS = new Set(Object.values(ALIASES));
const DEVICE_COMMANDS = new Set([
	"dev-with-device",
	"install",
	"install-and-launch",
	"launch",
]);

const args = process.argv.slice(2);
const commandOrAlias = args[0] ?? "build";
const command = ALIASES[commandOrAlias] || commandOrAlias;

if (!COMMANDS.has(command)) {
	console.error(`Command "${command}" not recognized`);
	process.exit(1);
}

if (process.platform !== "win32" && DEVICE_COMMANDS.has(command)) {
	console.log(
		`Device-based commands are currently only supported on Windows. You can use the "Upload Game to device" feature of the Playdate Simulator to install and launch your game.`
	);
	process.exit(1);
}

(await import(`../lib/commands/${command}.mjs`)).default();
