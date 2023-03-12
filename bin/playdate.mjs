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

const [commandOrAlias] = process.argv.slice(2) || "build";
const command = ALIASES[commandOrAlias] || commandOrAlias;
let commandModule;

try {
	commandModule = await import(`../lib/commands/${command}.mjs`);
} catch (e) {
	console.error("Command not recognized");
}

commandModule.default();
