// backend/config/wasabi.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.WASABI_ACCESS_KEY,
  secretAccessKey: process.env.WASABI_SECRET_KEY,
  region: 'us-west-1',
  endpoint: 'https://s3.us-west-1.wasabisys.com',
  s3ForcePathStyle: true,
});

module.exports = s3;