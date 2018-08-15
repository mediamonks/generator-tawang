const ServerTest = require('./ServerTest');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

let run = async () => {
  let test = new ServerTest('dev.lcl');
  let checkDomain = await test.checkDomain();
  let checkPost = await test.checkPost();
  let checkParse = await test.checkParse();
  console.log({
    checkDomain,
    checkPost,
    checkParse,
  })
}

run();