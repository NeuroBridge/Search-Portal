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
    main: '#36688b',
  },
  secondary: {
    main: '#ab7629',
  },
}

export const lightTheme = {
  palette: {
    ...sharedPalette,
    background: {
      default: '#e7efdd',
      paper: '#f7ffed',
    },
    text: {
      primary: '#333',
      secondary: '#666',
    },
    success: {
      main: '#368b77',
    },
  },
  typography,
  shape,
}

export const darkTheme = {
  palette: {
    ...sharedPalette,
    background: {
      default: '#272f3d',
      paper: '#171f2d',
    },
    text: {
      primary: '#fff',
      secondary: '#999',
    },
  },
  typography,
  shape,
}

