# Puppeteer Crawler
A starter crawler built with Puppeteer and meant to be deployed for AWS lambda functions.

## Features
- Build lambda functions

## Dependencies
- Install `node`
    - Use NVM (https://github.com/nvm-sh/nvm): `nvm install lts/dubnium && nvm use lts/dubnium`
    - Alternatively you can download and install it manually: https://nodejs.org/en/download/
- Install `yarn ^1.10.1`
    - Use brew (https://brew.sh/): `brew install yarn`
    - Alternatively you can download and install it manually: https://classic.yarnpkg.com/en/docs/install

## Development
- Download and install VSCode: https://code.visualstudio.com/
- Read the setup guide https://code.visualstudio.com/docs/setup/setup-overview
    - Launching VSCode from the command line: Open the Command Palette (F1) and type `shell command` to find the `Shell Command: Install 'code' command in PATH command`
        - After doing this you can start VSCode on a repo with `code .`
- Install TSLint extension in VSCode https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin
- In order to run the debugger for backend/tests put a breakpoint in VSCode and run this command in VSCode (`CMD + SHIFT + P`): `Debug: attach node to process`. You can also enable `Debug: Toggle Auto Attach` to start the debugger every time a node process is started from VSCode terminal.
- To open a terminal in VSCode: ```CTRL + ` ```

## Usage
- Install dependencies: `yarn install`
- Build lambda function: `yarn build`
- Run application (port 8080): `yarn start`
- Remove all the generated files: `yarn clean`

## Useful links
- Typescript guide: https://basarat.gitbook.io/typescript/
- VSCode custom settings: https://github.com/gianluca-venturini/env_confs/tree/master/vs_codet
