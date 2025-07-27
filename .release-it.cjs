module.exports = {
  git: {
    commit: false,
  },
  github: {
    release: true,
    releaseName: "${version}",
    assets: [
      'main.js',
      'manifest.json',
      'keep-headings.zip',
    ],
    proxy: process.env.HTTPS_PROXY,
  },
  npm: {
    publish: false,
  },
};