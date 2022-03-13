# RENCI React Starter

This React application boilerplate contains an initial configuration common to the many of the web applications built at/by/for RENCI.

The following are set up by default:

- Webpack 5
- Babel
- CSS
- SCSS
- PostCSS
- Source Maps
- Hot module replacement
- React
- React Refresh
- Image support (png, jpg, jpeg, gif, svg, webp)
- ESLint

In addition, this project will contain the branding resources for RENCI and UNC, which we also often require.

### 🚀 Get Started

There are lots of ways to get started.

1. git clone

```shell
git clone https://github.com/renci/react-starter
```

2. [Create RENCI App](https://github.com/RENCI/create-renci-app)

This is a Node CLI tool that aims to streamline the web application bootstrapping process. Head over to [RENCI/create-renci-app](https://github.com/RENCI/create-renci-app) to check it out!

3. [degit](https://www.npmjs.com/package/degit)

_Create RENCI App_ leverages degit, and it can just be used directly. This is a nice option if you'd prefer to not bring along the git history of _this_ project into _your_ project.

The following command will create a directory called `project-name` that contains a current snapshot the code in this repo's `main` branch.

```shell
degit RENCI/react-starter project-name
```

Note that this will only bring in the code &mdash; not the git history. You'll still need to run `git init`, etc.

### 🚧 Application Development

You're ready to begin development. Move into your project directory, and start a local development server by running `npm start`.

Note that this development environment utilizes [hot-module-replacement](https://webpack.js.org/guides/hot-module-replacement/) and [react-refresh](https://github.com/pmmmwh/react-refresh-webpack-plugin) for optimal developer experience.

#### Environment Variables

Use a `.env` file to pass environment-specific variables into the application. Use the invluded `sample.env` file as a to model to get started.

Copy this `sample.env` file

```shell
cp sample.env .env
```

to get started with this `.env` file.

**.env**
```
SAMPLE_VARIABLE=this-is-an-environment-variable
```

Then the environment variables can be used in the React application in the following manner.

```js
const { SAMPLE_VARIABLE } = process.env

console.log(SAMPLE_VARIABLE) // this-is-an-environment-variable
```

### 🎁 Building for Production

To build a production-ready `create-renci-app` application, run `npm run build` from the project directory. the bundled files will be exported to the `dist` directory.

To build an easily debuggable production build, use `npm run build-dev`.

---

See [RENCI/create-renci-app](https://github.com/RENCI/create-renci-app).
