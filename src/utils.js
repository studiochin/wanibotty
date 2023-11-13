const crypto = require("crypto");
const userDataSchema = require("../models/userDataSchema.js");
require("dotenv").config();

const ENCRYPTION_KEY = process.env.ENCRYPTIONKEY;
const IV = crypto.randomBytes(Number(process.env.IVLENGTH));

const { request } = require('undici');


exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    IV
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: IV.toString("hex"), encryptedData: encrypted.toString("hex") };
};

exports.decrypt = (encryptedObj) => {
  console.log(encryptedObj);
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY, "hex"),
    Buffer.from(encryptedObj.iv, "hex")
  );
  let decrypted = decipher.update(
    Buffer.from(encryptedObj.encryptedData, "hex")
  );
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

exports.botErrorReplies = (error) => {
  const errorReplies = {
    minimumUpdateTime: `pls wait 30 mins from last update`,
    userNotFound: `pls register first :) use command /register <api-token-from-wani-kani>`,
  };
  return errorReplies[error];
};

exports.fetchReviewStats = async (userToken) => {
  const requestAuth = await request(
    "https://api.wanikani.com/v2/level_progressions",
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Wanikani-Revision": "20170710",
      },
    }
  );
  const results = await requestAuth.body.json();
  return results.data[results.data.length - 1];
};

exports.fetchUserData = async (userId) => {
  const userData = await userDataSchema
    .findOne({ userId: userId })
    .exec();
  return userData;
};

exports.convertDate = (dateString) => {

  const date = new Date(dateString);

  // Extract date and time information
  let year = date.getFullYear();
  let month = date.getMonth() + 1; // Months are 0-indexed
  let day = date.getDate();

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  // Format the date and time (optional)
  let formattedDate = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
  let formattedTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');

  return `${formattedDate} ${formattedTime}`;
}

exports.isPastMinimumUpdateTime = async (lastUpdatedTime) => {};
