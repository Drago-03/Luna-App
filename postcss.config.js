module.exports = {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'custom-media-queries': true,
        'custom-selectors': true,
      },
    },
    'cssnano': process.env.NODE_ENV === 'production' ? {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: false,
        colormin: true,
        minifyFontValues: true,
        minifyGradients: true,
      }]
    } : false,
    'postcss-import': {},
    'postcss-flexbugs-fixes': {},
    'postcss-normalize': {},
  },
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './public/index.html'
    ]
  }
};