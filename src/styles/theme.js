const typography = {
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
    color: '#456',
  },
  h5: {
    fontSize: '1.25rem',
    color: '#789',
  },
  h6: {
    fontSize: '1rem',
    color: '#333',
    marginBottom: '4px',
  },
}

const shape = {
  borderRadius: 0,
}

const sharedPalette = {
  primary: {
    main: '#5787a8',
  },
  secondary: {
    main: '#8aa461',
  },
  success: {
    main: '#00bfa5',
  },
}

export const lightTheme = {
  palette: {
    mode: 'light',
    ...sharedPalette,
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
    },
  },
  typography,
  shape,
}

export const darkTheme = {
  palette: {
    mode: 'dark',
    ...sharedPalette,
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
  },
  typography,
  shape,
}

