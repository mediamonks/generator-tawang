module.exports = ({
  name = 'unknown',
  description = '',
  license,
  authorName,
  authorEmail,
  gitRepository,
  bugsUrl,
  homepage,
}) => {
  let object = {
    version: '0.0.1',
    name,
    scripts: {
      dev: 'webpack --config ./tools/webpack/webpack.dev.config.js',
      build: 'webpack --config ./tools/webpack/webpack.prod.config.js',
      test: 'echo "Error: no test specified" && exit 1',
    },
    keywords: ['mediamonks', 'tawang', 'template', 'starter', 'webpack', 'arstudio', 'facebook'],
    devDependencies: {
      '@mediamonks/tawang': '^0.1.3',
      'babel-core': '^6.26.3',
      'babel-loader': '^7.1.5',
      'babel-preset-env': '^1.7.0',
      webpack: '^4.16.5',
      'webpack-cli': '^3.1.0',
    },
    description,
    license,
  };

  if (typeof authorName === 'string' && typeof authorEmail === 'string') {
    object.author = `${authorName} <${authorEmail}>`;
  }
  if (typeof gitRepository === 'string') {
    object.bugs = {
      type: 'git',
      url: 'git+' + gitRepository,
    };
  }
  if (typeof bugsUrl === 'string') {
    object.repository = {
      url: bugsUrl,
    };
  }
  if (typeof homepage === 'string') {
    object.homepage = homepage;
  }

  return object;
};
