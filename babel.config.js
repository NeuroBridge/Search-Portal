const plugins = []

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
  plugins.push('react-refresh/babel')
  plugins.push('@babel/plugin-transform-runtime')
}

module.exports = {
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: plugins,
}
