# Assistant ✨

[![Discord](https://img.shields.io/discord/564160730845151244?label=discord&style=flat-square)](https://appwrite.io/discord)
[![Twitter Account](https://img.shields.io/twitter/follow/appwrite?color=00acee&label=twitter&style=flat-square)](https://twitter.com/appwrite)
[![appwrite.io](https://img.shields.io/badge/appwrite-.io-f02e65?style=flat-square)](https://appwrite.io)

Appwrite Assistant is an AI-powered API that helps you with Appwrite-related tasks, powered by the official Appwrite documentation.

## Installation

Make sure you have [pnpm](https://pnpm.io/) installed.

To install, run the following command.

```bash
pnpm i
```

Next, fetch the Appwrite-specific sources used by the assistant. This will download the sources from the Appwrite documentation and store them in the `./sources` directory.

```bash
pnpm run fetch-sources
```

The scripts will pull the latest documentation from the `main` branch of the [website repository](https://github.com/appwrite/website), and the latest API reference from live [Appwrite documentation](https://appwrite.io/docs). 

If you want to pull from a different branch or repository, you can set the `_BUILD_GIT_URL` and `_BUILD_WEBSITE_URL` environment variables.

## Usage

First, retrieve an API key from OpenAI. You can sign up for an API key at [OpenAI](https://beta.openai.com/signup/). Once you have an API key, set it as the `_APP_ASSISTANT_OPENAI_API_KEY` environment variable.

To run the server, execute the `dev` command. By default, the server will be available at `http://localhost:3000` 

```bash
pnpm run dev
```

The server exposes a POST endpoint at `/`. The endpoint expects a raw text body containing the query for the assistant. The answer to the query will be streamed back to the client as raw text.

Use cURL to test the server, for example:

```bash
curl -X POST -H "Content-Type: application/json" -d "{\"prompt\": \"How do I create a new user?\"}" http://localhost:3000/v1/models/assistant/prompt
```

## Contributing

All code contributions, including those of people having commit access, must go through a pull request and be approved by a core developer before being merged. This is to ensure a proper review of all the code.

We truly ❤️ pull requests! If you wish to help, you can learn more about how you can contribute to this project in the [contribution guide](CONTRIBUTING.md).
