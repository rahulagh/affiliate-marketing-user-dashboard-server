// backend/utils/wasabiUpload.js
// backend/utils/wasabiUpload.js
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.WASABI_ACCESS_KEY,
  secretAccessKey: process.env.WASABI_SECRET_KEY,
  region: process.env.WASABI_REGION || 'us-east-1',
  endpoint: process.env.WASABI_ENDPOINT || 'https://s3.wasabisys.com',
  s3ForcePathStyle: true,
});

function generateSignedUrl(fileId) {
    const params = {
      Bucket: process.env.WASABI_BUCKET,
      Key: `documents/${fileId}`,
      Expires: 60 * 60, // URL valid for 1 hour
    };

    return s3.getSignedUrl("getObject", params);
}

exports.uploadToWasabi = async (file, fileId) => {
  console.log('Uploading file to Wasabi:', file.name);
  console.log('Wasabi configuration:', {
    accessKeyId: process.env.WASABI_ACCESS_KEY ? '****' : 'undefined',
    secretAccessKey: process.env.WASABI_SECRET_KEY ? '****' : 'undefined',
    region: process.env.WASABI_REGION || 'us-east-1',
    endpoint: process.env.WASABI_ENDPOINT || 'https://s3.wasabisys.com',
  });
  
  const params = {
    Bucket: process.env.WASABI_BUCKET,
    Key: `documents/${fileId}`,
    Body: file.data,
    ContentType: file.mimetype,
  };

  try {
    const result = await s3.upload(params).promise();
    console.log('File uploaded successfully. Location:', result.Location);
    const signedUrl = generateSignedUrl(fileId);
    console.log(signedUrl)
    return signedUrl;
  } catch (error) {
    console.error('Error uploading to Wasabi:', error);
    throw error;
  }
};
// 
// function generateSignedUrl(fileId) {
//     const params = {
//       Bucket: "agh-admin-user-view",
//       Key: documents/${fileId},
//       Expires: 60 * 60, // URL valid for 1 hour
//     };
  
//     return s3.getSignedUrl("getObject", params);
//   }
  
//   async function uploadToWasabi(file, fileId) {
//     const params = {
//       Bucket: "agh-admin-user-view",
//       Key: documents/${fileId},
//       Body: file.data,
//       ContentType: file.mimetype,
//       ACL: "public-read",
//     };
  
//     try {
//       // Perform the upload
//       await s3.upload(params).promise();
  
//       const signedUrl = generateSignedUrl(fileId);
//       return signedUrl;
//     } catch (error) {
//       console.error("Error uploading file to Wasabi:", error);
//       throw error;
//     }
//   }