# Odysseus Admin Story Tool

## Requirements
* Node v18.14.0
* [Odysseus Backend](https://github.com/OdysseusLarp/odysseus-backend)

## Local Setup

**`NOTE!`** Make sure you are running `Odysseus Backend`!

In the project directory, you can run:

### `npm install --legacy-peer-deps`

At least one of the dependencies does not support React 17 officially.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Local setup in VSCode dev container

You can also run the app using [VSCode dev containers](https://code.visualstudio.com/docs/devcontainers/containers). Create/update your .env file like in the local setup instructions.

### Requirements

- [Docker](https://www.docker.com/)
- [VSCode](https://code.visualstudio.com/) with [Dev Containers](https://code.visualstudio.com/docs/devcontainers/tutorial#_install-the-extension) extension
- [Odysseus Backend](https://github.com/OdysseusLarp/odysseus-backend)

### Setup

* **`NOTE!`** Make sure you are running `Odysseus Backend`!
* Open new window in VSCode
* File --> Open Folder... --> `odysseus-admin-story-tool`
* VSCode will ask do you want to `Reopen in Container` --> Click it
    * If you are too slow --> Click the button in left bottom corner (looks like two L:s or disjointed ><) and choose `Reopen in Container` from the menu.
* VSCode will then build and start up the dev container, installs npm packages and starts the service.

### Problems?

* Try to rebuild the container: Click the button in left bottom corner (looks like two L:s or disjointed >< with the container name) and choose `Rebuild Container` from the menu.
* You might run into [this issue](https://github.com/microsoft/vscode-remote-release/issues/7305) on ARM processors, see the issue for potential workarounds.

## Other Available Scripts

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
