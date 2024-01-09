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

Next, fetch the Appwrite-specific sources used by the assistant.

```bash
pnpm run fetch-sources
```

This will download the sources from the Appwrite documentation and store them in the `./sources` directory.

## Usage

To run the server, execute the `dev` command. By default, the server will be available at `http://localhost:3000` 

```bash
pnpm run dev
```

The server exposes a POST endpoint at `/`. The endpoint expects a raw text body containing the query for the assistant. The answer to the query will be streamed back to the client as raw text.

Use cURL to test the server, for example:

```bash
curl -X POST -d "How do I create a user?" http://localhost:3000
```

## Contributing

All code contributions, including those of people having commit access, must go through a pull request and be approved by a core developer before being merged. This is to ensure a proper review of all the code.

We truly ❤️ pull requests! If you wish to help, you can learn more about how you can contribute to this project in the [contribution guide](CONTRIBUTING.md).
