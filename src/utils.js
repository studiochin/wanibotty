const crypto = require("crypto");
const userDataSchema = require("../models/userDataSchema.js");
require("dotenv").config();

const ENCRYPTION_KEY = process.env.ENCRYPTIONKEY;
const IV = crypto.randomBytes(Number(process.env.IVLENGTH));

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
    "https://api.wanikani.com/v2/review_statistics",
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Wanikani-Revision": "20170710",
      },
    }
  );
  const results = await requestAuth.body.json();
  return results.data;
};

exports.fetchUserData = async (userId) => {
  const userData = await userDataSchema
    .findOne({ userId: interaction.user.id })
    .exec();
  return userData;
};

exports.isPastMinimumUpdateTime = async (lastUpdatedTime) => {};
