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

const args = process.argv.slice(2);
const commandOrAlias = args[0] ?? "build";
const command = ALIASES[commandOrAlias] || commandOrAlias;

if (!COMMANDS.has(command)) {
	console.error(`Command "${command}" not recognized`);
	process.exit(1);
}

(await import(`../lib/commands/${command}.mjs`)).default();
