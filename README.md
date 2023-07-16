# pddx - Playdate Developer Experience

A toolkit for developing Playdate games, for those who prefer the Node.js ecosystem

## Quick Start

`pddx` is included with the [Playdate project template](https://github.com/colingourlay/create-playdate) on **npm**. To create a new project, run:

```sh
npm create playdate
```

...and follow the command line instructions.

## Installation (for existing projects)

```sh
npm install pddx
```

## Requirements

**pddx** assumes that you've already set the `PLAYDATE_SDK_PATH` environment variable, and added the SDK's `bin` directory to your `PATH` environment variable. If you need help with that, Panic has [instructions](https://sdk.play.date/1.13.0/Inside%20Playdate.html#_set_playdate_sdk_path_environment_variable) in their SDK documentation.

## Usage

Commands:

- [`pd build`](#pd-build)
- [`pd simulate`](#pd-simulate)
- [`pd dev`](#pd-dev)
- [`pd clean`](#pd-clean)

If you're developing on Windows, you also have access to these commands:

- [`pd install`](#pd-install)
- [`pd launch`](#pd-launch)
- [`pd install-and-launch`](#pd-install-and-launch)
- [`pd dev-with-device`](#pd-dev-with-device)

### `pd build`

Alias: `pd`

Generates a `pdxinfo` file in your _source_ directory (default: `"source"`), then uses the Playdate compiler (`pdc`) to build a `{name}-dev.pdx` in your _output_ directory (default: `"dist"`)

When `NODE_ENV=production`, the Playdate compiler will have verbose output the output file will be named `{name}-{version}.pdx`.

#### Notes

`{name}` and `{version}` are derived from your `package.json` file.

Generated assets shoud not be commited to your repository. It is suggested that the following lines are added to your `.gitignore`:

```
pdxinfo
*.pdx
```

### `pd simulate`

Opens your built `{name}-dev.pdx` file with the OS' default program (which should be the Playdate Simulator)

When `NODE_ENV=production`, `{name}-{version}.pdx` will be opened instead.

### `pd dev`

Runs your project's `build` and `simulate` tasks in sequence, then watches your _source_ directory, running those tasks again whenever files change.

### `pd clean`

Removes all files & directories created during the build process (your _output_ directory and the `pdxinfo` file in your _source_ directory).

### `pd install`

Installs your built `{name}-dev.pdx` to your connected Playdate. (Windows-only)

When `NODE_ENV=production`, `{name}-{version}.pdx` will be installed instead.

### `pd launch`

Launches the `{name}-dev.pdx` file on your connected Playdate, if it was previously installed with `pd install`

When `NODE_ENV=production`, `{name}-{version}.pdx` will be run instead.

### `pd install-and-launch`

Installs your built `{name}-dev.pdx` to your connected Playdate, then launches it. (Windows-only)

When `NODE_ENV=production`, `{name}-{version}.pdx` will be installed and launched instead.

### `pd dev-with-device`

Runs your project's `build` and `install-and-launch` tasks in sequence, then watches your _source_ directory, running those tasks again whenever files change. (Windows-only)

## Configuration

Configuration options can be set by either creating a `playdate.json` file in the root of your project, or by adding a `"playdate"` property to your `package.json`:

### Example

This `playdate.json` file will define the name of the game for the `pdxinfo` file, and specify that the game's output directory is called `games` (instead of `dist`):

```json
{
	"pdxinfo": {
		"name": "My Playdate Game"
	},
	"outputDir": "games"
}
```

### Options

#### `sourceDir`

Name of the directory under your project root where your game's source is kept. Default: `"source"`.

#### `outputDir`

Name of the directory under your project root where `.pdx` builds will be created. Default: `"dist"`.

#### `pdxinfo`

An object containing options used during the creation of the `pdxinfo` file in your _source_ directory. Options are descibed in the next section. Default: `{}`.

### `pdxinfo` options

Unless specified, all values are strings. All are optional.

#### `name`

A name for your game. Default: `package.json`'s `name` field.

#### `description`

A description for your game. Default: `package.json`'s `description` field.

#### `author`

The author of your game. Either a name, or a name parsed from a person string (matching the `{name} <{email}>` pattern) or a person object (with `name` and `email` properties). Default: First name encountered in `package.json`'s `maintainers[0]`, `conributors[0]`, or `author` fields.

#### `bundleID`

Your game's unique bundleID, in reverse DNS notation. Default:

1. If a person (see `author`, above) is found in `package.json`:

   - `"{niamod}.{name}"`, where `{niamod}` is the reversed domain of their email address if they have one, or
   - `"com.{author}.{name}"`, where `{author}` is a lower-case concatenation of their name.

2. Otherwise: `"com.example.{name}"`

In both cases, `{name}` is derived from your `package.json` file.

#### `imagePath`

The relative path of a directory under your _source_ directory that will contain files used by the launcher (see **pdxinfo > imagePath** in the [SDK documentation]https://sdk.play.date/inside-playdate/#pdxinfo) for content requirements). You may optionally specify an object with a `"default"` key for releases of your game, and other keys that denote pre-releases. Default: None.

e.g. Use `launcher/beta` directory for **beta** pre-releases; use `launcher` directory for other releases.

```json
{
	"default": "launcher",
	"beta": "launcher/beta"
}
```

#### `launchSoundPath`

The relative path of a short audio file under your _source_ directory, to be played as the game launch animation is taking place. Like `imagePath`, you can optionally specify an object to define different audio files for different kinds of release. Default: None.

#### `contentWarning`

A content warning that displays when the user launches your game for the first time. The user will have the option of backing out and not launching your game if they choose. Default: None.

#### `contentWarning2`

A second content warning that displays on a second screen when the user launches your game for the first time. The user will have the option of backing out and not launching your game if they choose. Note: `contentWarning2` will only display if a `contentWarning` is also specified. Default: None.

## Suggested `package.json` scripts:

```json
{
	"start": "pd dev",
	"build": "pd",
	"build:release": "NODE_ENV=production pd",
	"simulate": "pd simulate",
	"simulate:release": "NODE_ENV=production pd simulate"
}
```
