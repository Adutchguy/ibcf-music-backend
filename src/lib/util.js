// // DEPENDENCIES
// import AWS from 'aws-sdk';
// import {extname} from 'path';
// import fs from 'fs-extra';
const CryptoJS = require('crypto-js');
//
// const s3 = new AWS.S3();
module.exports = function passwordUnHash(hash){
  let bytes = CryptoJS.AES.decrypt(hash.toString(), process.env.REACT_APP_APP_SECRET);
  let password = bytes.toString(CryptoJS.enc.Utf8);
  return password;
};
// export const removeMulterFile = (data) => fs.remove(data.path);
// export const removeMulterFiles = (list) => Promise.all(list.map(removeMulterFile));
//
// export const s3UploadMulterFileAndClean = (data) => {
//   return s3.upload({
//     ACL: 'public-read',
//     Bucket: process.env.AWS_BUCKET,
//     Key: `${data.filename}.${data.originalname}`,
//     Body: fs.createReadStream(data.path),
//   }).promise()
//   // allways remove file and either pass on failure or success
//     .catch(err => fs.remove(data.path).then(() => {throw err;}))
//     .then(s3Data => fs.remove(data.path).then(() => s3Data));
// };
