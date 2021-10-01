# NeuroBridge Client Application

- production: [neurobridges.org](https://neurobridges.org) [![Netlify Status](https://api.netlify.com/api/v1/badges/87366d32-c6c4-4352-9025-5654369dc63c/deploy-status)](https://app.netlify.com/sites/neurobridges/deploys)
- staging: [staging.neurobridges.org](https://staging.neurobridges.org)

This is a [React](https://reactjs.org/) application that was bootstrapped with [RENCI/create-renci-app](https://github.com/RENCI/create-renci-app).

### 🚧 Development

Run development server on port 8080 with `npm start`.

### 🎁 Production

Build the application for production with `npm run build`. The `dist` directory will contain the bundled files.

## Changlog

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