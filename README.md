# APIB Editor
A simple API-Blueprint editor. It is for managing Restful API document more easily and firmly. APIB Editor provides a tree view that you can search APIs in a convenient way.

When your project gets bigger and bigger, the complexity of your single API document file also gets bigger too. But there is no proper way to split the file or something so far. If you have more than 100 API endpoints, you'll finally find out that it's mad even searching some API to modify and render it again.

So where APIB Editor is. I wish this project will open the door to an innovative top-down modeling way of Web API.

## Current Limits
- No cloud support. Only upload and download files in a local browser.
- Only named resources and actions are allowed.
- Parser can't detect a resource as a model. So named model should be in a model group node(Data Structures).

## Install
No support for installing APIB Editor yet. You have to build the source manually.

## Build
To Build APIB Editor, you need to have Node.js and NPM. Having them, go to the cloned directory and type the below command to install the dependencies.

```
> npm install
```

And to build the source:

```
> npm run build
```

It will build the source and put the final result to `build` directory. You need `index.htm` and `app.js` in the same directory to run APIB Editor.

## License
This project is under the MIT License.
