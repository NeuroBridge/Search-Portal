// these theme properties are shared across both light and dark modes.
const themeBase = {
  /* typography */
  htmlFontSize: 16,
  h1: {
    fontSize: 'clamp(2rem, 6vw, 3rem)',
  },
  h2: {
    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
  },
  h3: {
    fontSize: 'clamp(1.5rem, 4vw, 2rem)',
  },
  h4: {
    fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
  },
  h5: {
    fontSize: '1.25rem',
  },
  h6: {
    fontSize: '1rem',
  },

  /* shape */
  shape: {
    borderRadius: 0,
  }
}

// light theme color palette
const lightPalette = {
  primary: {
    main: '#5787a8',
    contrastText: '#e7efdd',
  },
  secondary: {
    main: '#8aa461',
  },
  success: {
    main: '#00bfa5',
  },
  concept: {
    positive: '#4cc121',
    negative: '#cb5f5f',
    neutral: '#dfddd6',
  },
  background: {
    default: '#e7efdd',
    paper: '#f7ffed',
  },
  text: {
    primary: '#333',
    secondary: '#666',
    disabled: '#999',
  },
  divider: 'rgba(0, 0, 0, 0.1)',
  action: {
    disabled: '#999'
  }
}

// dark theme color palette
const darkPalette = {
  primary: {
    main: '#5787a8',
    contrastText: '#fff',
  },
  secondary: {
    main: '#8aa461',
  },
  success: {
    main: '#00bfa5',
  },
  concept: {
    positive: '#079a3a',
    negative: '#9b2149',
    neutral: '#585f7b',
  },
  background: {
    default: '#272f3d',
    paper: '#171f2d',
  },
  text: {
    primary: '#fff',
    secondary: '#999',
    disabled: '#ccc',
  },
  divider: 'rgba(255, 255, 255, 0.1)',
  action: {
    disabled: '#666'
  },
}

// stitch everything together here,
// with our two themes as named exports.

export const lightTheme = {
  palette: { mode: 'light', ...lightPalette },
  ...themeBase,
}

export const darkTheme = {
  palette: { mode: 'dark', ...darkPalette },
  ...themeBase,
}
