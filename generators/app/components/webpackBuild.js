const { spawn } = require('child_process');

module.exports = () => {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'build'], { stdio: 'inherit' });

    child.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
};
