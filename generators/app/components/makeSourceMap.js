const CRC32 = require('crc-32');

module.exports = () => {
  let json = `{
    "version": 3,
    "file": "compiled.js",
    "sources": ["${Math.random()}.js"],
    "names": [],
    "mappings": ";;AAAA,MAAM,IAAI"
  }`;

  let hash = CRC32.str(json).toString(32);

  return {
    json,
    hash
  }
};
