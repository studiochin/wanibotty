const crypto = require("crypto");
const userDataSchema = require("../models/userDataSchema.js");
require("dotenv").config();

const ENCRYPTION_KEY = process.env.ENCRYPTIONKEY;
const IV = crypto.randomBytes(Number(process.env.IVLENGTH));

const { request } = require("undici");

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

const getRequestHeaders = (userToken) => {
  return {
    Authorization: `Bearer ${userToken}`,
    "Wanikani-Revision": "20170710",
  };
};

exports.fetchAssignments = async (userToken) => {
  const reqHeaders = getRequestHeaders(userToken);
  const requestAuth = await request("https://api.wanikani.com/v2/assignments", {
    headers: reqHeaders,
  });
  return requestAuth;
};

exports.fetchReviewStats = async (userToken) => {
  const reqHeaders = getRequestHeaders(userToken);
  const requestAuth = await request(
    "https://api.wanikani.com/v2/level_progressions",
    {
      headers: reqHeaders,
    }
  );
  return requestAuth;
  const results = await requestAuth.body.json();
  return results.data[results.data.length - 1];
};

exports.fetchUserData = async (userId) => {
  const userData = await userDataSchema.findOne({ userId: userId }).exec();
  return userData;
};

exports.fetchSummaryReport = async (userToken) => {
  const reqHeaders = getRequestHeaders(userToken);
  const requestAuth = await request("https://api.wanikani.com/v2/summary", {
    headers: reqHeaders,
  });
  return requestAuth;
};

const formatLongDate = (dateString) => {
  const date = new Date(dateString);

  let year = date.getFullYear();
  let month = date.getMonth() + 1; // Months are 0-indexed
  let day = date.getDate();

  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  let formattedDate = `${month.toString().padStart(2, "0")}/${day
    .toString()
    .padStart(2, "0")}/${year}`;
  let formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;

  return `${formattedDate} ${formattedTime}`;
};

const formatCountdown = (dateString) => {
  let now = new Date();
  let targetDate = new Date(dateString);
  let difference = targetDate - now;

  let days = Math.floor(difference / (1000 * 60 * 60 * 24));
  let hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  return `Time until next review: ${Math.abs(days)}d ${Math.abs(
    hours
  )}hr ${Math.abs(minutes)}m`;
};

exports.getCountdownToNextUpdate = (date) => {
  const targetDate = new Date(dateString);
  const now = new Date();

  const difference = targetDate - now;
  return difference;
};

exports.convertDate = (option, dateString) => {
  if (option == "long") {
    return formatLongDate(dateString);
  }

  if (option == "countdown") {
    return formatCountdown(dateString);
  }
};

exports.isPastMinimumUpdateTime = async (lastUpdatedTime) => {};
