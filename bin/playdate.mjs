#!/usr/bin/env node

const [command] = process.argv.slice(2);

let commandModule;

try {
	commandModule = await import(`../lib/commands/${command || "build"}.mjs`);
} catch (e) {
	console.error("Command not recognized");
}

commandModule.default();
