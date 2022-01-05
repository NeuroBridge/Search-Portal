# NeuroBridge Client Application

- production: [neurobridges.org](https://neurobridges.org) [![Netlify Status](https://api.netlify.com/api/v1/badges/87366d32-c6c4-4352-9025-5654369dc63c/deploy-status)](https://app.netlify.com/sites/neurobridges/deploys)
- staging: [staging.neurobridges.org](https://staging.neurobridges.org)

This is a [React](https://reactjs.org/) application that was bootstrapped with [RENCI/create-renci-app](https://github.com/RENCI/create-renci-app).

### 🚧 Development

You'll need Node v14.16.0. If you don't have that version installed, use [nvm](https://github.com/nvm-sh/nvm). Install with `nvm use 14.16.0`. Install dependencies with `npm ci`. Run development server on port 8080 with `npm start`.

### 🎁 Production

Build the application for production with `npm run build`. The `dist` directory will contain the bundled files.

## Changelog

- 2021-01-05
    + remove graph for outlined list of terms & descendants
    + add drawer
    + swap perspective so that term selection is "main" view,
      moving search results into drawer
    + add instructions

- 2020-10-01
    + save search history to local storage
    + save graph settings to local storage
    + traffic light node selection
    + expand graph settings to include adjustment for
      - node labels font size
      - node labels vertical placement
      - node size
      - distance between levels
      - force between same-level nodes
  
- 2020-09-24
    + node selection "shopping cart"
    + settings tray to toggle graph mode and node labels
    + reset graph button
    + placeholder "home" and "contact" pages