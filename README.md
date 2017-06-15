# APIB Editor
A simple API-Blueprint editor. It is for managing Restful API document more easily and firmly. APIB Editor provides a tree view that you can search APIs in a convenient way.

## Current Limits
- Only named resources and actions are allowed.
- Parser can't detect a resource as a model. So named model should be in a model group node(Data Structures).

## Build

APIB Editor is basically web based application and runs on [NW.js](https://nwjs.io). 

To Build APIB Editor, you need to have Node.js and NPM. Having them, go to the cloned directory and type the below command to install the dependencies.

```
> npm install
```

And to build the source:

```
> npm run build
```

It will build the source and put the final result to `build` directory that contains `package.json` file for NW.js.

So you can package the `build` directory into NW.js application, for example, rename it as `package.nw` and put it to the NW.js directory. See [Package Your App](http://docs.nwjs.io/en/latest/For%20Users/Package%20and%20Distribute/#package-your-app) documentation for more information.

## Development

APIB Editor uses Webpack and webpack-dev-server. It makes the development quick and easy. Just type the command,

```
> npm run dev
```

And then go to `http://localhost:8080` on Chrome browser. Because it runs on the browser not on NW.js, some Node features like `file system` are not available. But it may be enough to develop the main features.

## License
This project is under the MIT License.
