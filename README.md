# NeuroBridge Search Portal

- staging: [https://neurobridges-portal-staging.netlify.app/](https://staging.neurobridges.org)
- production: N/A

This is a [React](https://reactjs.org/) application that was bootstrapped with [RENCI/create-renci-app](https://github.com/RENCI/create-renci-app).

### 🚧 Development

You'll need Node v14.16.0 or higher. If you don't have that version installed, use [nvm](https://github.com/nvm-sh/nvm) to specify a Node version with `nvm use 14.16.0`. Install dependencies with `npm ci`. Run development server on port 8080 with `npm start`.

### 🎁 Production

Build the application for production with `npm run build`. The `dist` directory will contain the bundled files.

A [Dockerfile](Dockerfile) exists for easy, consistent deployment. Commands to get going would look something like the following.

```
docker build -t neurobridge/search-portal .
docker run -d --expose=80 neurobridge/search-portal
```
