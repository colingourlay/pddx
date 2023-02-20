# pddx - Playdate Developer Experience

A toolkit for developing Playdate games, for those who prefer the Node.js ecosystem

## Quick Start

`pddx` is baked into the [Playdate project template](https://github.com/colingourlay/create-playdate) on **npm**. To create a new project, run:

```sh
npm create playdate
```

...and follow the command line instructions.

## Installation (for existing projects)

```sh
npm install pddx
```

## Usage

### `pd build` (or `pd`)

Generates a `pdxinfo` file in your _source_ directory (default: `"src"`), then uses the Playdate compiler (`pdc`) to build a `{name}-dev.pdx` in your _out_ directory (default: `"dist"`)

When `NODE_ENV=production`, the Playdate compiler will have verbose output the output file will be named `{name}-{version}.pdx`.

#### Notes

`{name}` and `{version}` are derived from your `package.json` file.

Generated assets shoud not be commited to your repository. It is suggested that the following lines are added to your `.gitignore`:

```
pdxinfo
*.pdx
```

### `pd preview`

Opens your built `{name}-dev.pdx` file with the OS' default program (which should be the Playdate Simulator)

When `NODE_ENV=production`, `{name}-{version}.pdx` will be opened instead.

### `pd dev`

Runs your project's `build` and `preview` tasks in sequence, then watches your _source_ directory, running those tasks again whenever files change.

### `pd clean`

Removes all generated files & directories (your _out_ directory and the `pdxinfo` file in your _source_ directory).

## Configuration

Configuration options can be set by either creating a `playdate.json` file in the root of your project, or by adding a `"playdate"` property to your `package.json`:

### Example

This `playdate.json` file will define the name of the game for the `pdxinfo` file, and specify that the game's source directory is called `Source` (instead of `src`):

```json
{
	"pdxinfo": {
		"name": "My Playdate Game"
	},
	"sourceDir": "Source"
}
```

### Options

#### `pdxinfo`

An object containing options used during the creation of the `pdxinfo` file in your _source_ directory. Options are descibed in the next section. Default: `{}`.

#### `sourceDir`

Name of the directory under your project root where your game's source is kept. Default: `"src"`.

#### `outputDir`

Name of the directory under your project root where `.pdx` builds will be created. Default: `"dist"`.

#### `buildTask`

Name of your `package.json` scripts 'build' task (called by the `dev` command). Default: `"build"`.

#### `previewTask`

Name of your `package.json` scripts 'preview' task (called by the `dev` command). Default: `"preview"`.

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

The relative path of either a single card image (350 x 155 pixels) under your _source_ directory, or to a directory of images that will be used by the launcher. You may optionally specify an object with a `"default"` key for releases of your game, and other keys that denote pre-releases. Default: None.

e.g. A static image for `beta` pre-releases; a directory for other releases.

```json
{
	"default": "launcher",
	"beta": "launcher/card-beta.png"
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
	"preview": "pd preview",
	"build:release": "NODE_ENV=production pd",
	"preview:release": "NODE_ENV=production pd preview"
}
```
