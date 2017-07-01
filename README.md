# APIB Editor
A simple API-Blueprint editor. It is for managing Restful API document more easily and firmly. APIB Editor provides a tree view that you can search APIs in a convenient way.

APIB Editor is a web-based application. You can test and use APIB Editor at the Github pages repository:

> [https://elfrog.github.io/apib-editor/](https://elfrog.github.io/apib-editor)

## Current Limits
- Only named resources and actions are allowed.
- Parser can't detect a resource as a model. So named model should be in a model group node(Data Structures).

## Build

To Build APIB Editor, you need to have Node.js and NPM. Having them, go to the cloned directory and type the below command to install the dependencies.

```
> npm install
```

And to build the source:

```
> npm run build
```

It will build the source and put the final result to `build` directory.

## Development

APIB Editor uses Webpack and webpack-dev-server. It makes the development quick and easy. Just type the command,

```
> npm run dev
```

And you can go to `http://localhost:8080` on Chrome browser.

## License
This project is under the MIT License.
