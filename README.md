<div align="center">
  <div>
    <img src=".github/screenshot.png" alt="Ollama Commits"/>
    <h1 align="center">Ollama Commits</h1>
  </div>
	<p>A CLI that writes your git commit messages for you with Ollama AI. Never write a commit message again.</p>
	<a href="https://www.npmjs.com/package/ollama-commits"><img src="https://img.shields.io/npm/v/ollama-commits" alt="Current version"></a>
</div>

---

## Setup

> The minimum supported version of Node.js is the latest v14. Check your Node.js version with `node --version`.

1. Install _ollama-commits_:

   ```sh
   npm install -g ollama-commits
   ```

2. Make sure you have [Ollama](https://ollama.ai/) installed and running locally

3. Pull the model you want to use (default is deepseek-coder:instruct):

   ```sh
   ollama pull deepseek-coder:instruct
   ```

   You can also use other models like llama3.2 or any other model available in Ollama.

### Upgrading

Check the installed version with:

```
ollama-commits --version
```

If it's not the [latest version](https://github.com/Nutlope/ollama-commits/releases/latest), run:

```sh
npm update -g ollama-commits
```

## Usage

### CLI mode

You can call `ollama-commits` directly to generate a commit message for your staged changes:

```sh
git add <files...>
ollama-commits
```

`ollama-commits` passes down unknown flags to `git commit`, so you can pass in [`commit` flags](https://git-scm.com/docs/git-commit).

For example, you can stage all changes in tracked files with as you commit:

```sh
ollama-commits --all # or -a
```

> 👉 **Tip:** Use the `llc` alias if `ollama-commits` is too long for you.

#### Generate multiple recommendations

Sometimes the recommended commit message isn't the best so you want it to generate a few to pick from. You can generate multiple commit messages at once by passing in the `--generate <i>` flag, where 'i' is the number of generated messages:

```sh
ollama-commits --generate <i> # or -g <i>
```

#### Generating Conventional Commits

If you'd like to generate [Conventional Commits](https://conventionalcommits.org/), you can use the `--type` flag followed by `conventional`. This will prompt `ollama-commits` to format the commit message according to the Conventional Commits specification:

```sh
ollama-commits --type conventional # or -t conventional
```

This feature can be useful if your project follows the Conventional Commits standard or if you're using tools that rely on this commit format.

### Git hook

You can also integrate _ollama-commits_ with Git via the [`prepare-commit-msg`](https://git-scm.com/docs/githooks#_prepare_commit_msg) hook. This lets you use Git like you normally would, and edit the commit message before committing.

#### Install

In the Git repository you want to install the hook in:

```sh
ollama-commits hook install
```

#### Uninstall

In the Git repository you want to uninstall the hook from:

```sh
ollama-commits hook uninstall
```

#### Usage

1. Stage your files and commit:

   ```sh
   git add <files...>
   git commit # Only generates a message when it's not passed in
   ```

   > If you ever want to write your own message instead of generating one, you can simply pass one in: `git commit -m "My message"`

2. Ollama-commits will generate the commit message for you and pass it back to Git. Git will open it with the [configured editor](https://docs.github.com/en/get-started/getting-started-with-git/associating-text-editors-with-git) for you to review/edit it.

3. Save and close the editor to commit!

## Configuration

### Reading a configuration value

To retrieve a configuration option, use the command:

```sh
ollama-commits config get <key>
```

For example, to retrieve the model, you can use:

```sh
ollama-commits config get model
```

You can also retrieve multiple configuration options at once by separating them with spaces:

```sh
ollama-commits config get model generate
```

### Setting a configuration value

To set a configuration option, use the command:

```sh
ollama-commits config set <key>=<value>
```

For example, to set the model, you can use:

```sh
ollama-commits config set model=llama3.2
```

You can also set multiple configuration options at once by separating them with spaces, like

```sh
ollama-commits config set model=llama3.2 generate=3 locale=en
```

### Options

#### model

Default: `deepseek-coder:instruct`

The Ollama model to use for generating commit messages. Make sure you have pulled the model you want to use with `ollama pull <model>`.

#### locale

Default: `en`

The locale to use for the generated commit messages. Consult the list of codes in: https://wikipedia.org/wiki/List_of_ISO_639_1_codes.

#### generate

Default: `1`

The number of commit messages to generate to pick from.

#### timeout

The timeout for network requests to the Ollama API in milliseconds.

Default: `10000` (10 seconds)

```sh
ollama-commits config set timeout=20000 # 20s
```

#### max-length

The maximum character length of the generated commit message.

Default: `50`

```sh
ollama-commits config set max-length=100
```

#### type

Default: `""` (Empty string)

The type of commit message to generate. Set this to "conventional" to generate commit messages that follow the Conventional Commits specification:

```sh
ollama-commits config set type=conventional
```

You can clear this option by setting it to an empty string:

```sh
ollama-commits config set type=
```

## How it works

This CLI tool runs `git diff` to grab all your latest code changes, sends them to your local Ollama instance, then returns the AI generated commit message.

## Maintainers

- **Hassan El Mghari**: [@Nutlope](https://github.com/Nutlope) [<img src="https://img.shields.io/twitter/follow/nutlope?style=flat&label=nutlope&logo=twitter&color=0bf&logoColor=fff" align="center">](https://twitter.com/nutlope)

- **Hiroki Osame**: [@privatenumber](https://github.com/privatenumber) [<img src="https://img.shields.io/twitter/follow/privatenumbr?style=flat&label=privatenumbr&logo=twitter&color=0bf&logoColor=fff" align="center">](https://twitter.com/privatenumbr)

## Contributing

If you want to help fix a bug or implement a feature in [Issues](https://github.com/Nutlope/ollama-commits/issues), checkout the [Contribution Guide](CONTRIBUTING.md) to learn how to setup and test the project
