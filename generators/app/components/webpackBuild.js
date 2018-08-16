const { spawn } = require('child_process');

module.exports = () => {
  return new Promise((resolve, reject) => {
    // const child = spawn('npm', ['run', 'build'], {stdio: "inherit"});
    const child = spawn('npm', ['run', 'build'], { customFds: [0, 1, 2] });

    /* // use child.stdout.setEncoding('utf8'); if you want text chunks
  child.stdout.on('data', chunk => {
    // data from standard output is here as buffers

    this.log(chunk.toString())
  }); 

  // since these are streams, you can pipe them elsewhere
  //child.stderr.pipe(dest);
  child.stdout.pipe(process.stdout); */

    child.on('close', code => {
      console.log(`child process exited with code ${code}`);
      resolve();
    });
  });
};
