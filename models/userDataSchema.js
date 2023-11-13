const { model, Schema } = require("mongoose");

const userDataSchema = new Schema(
  {
    userId: { type: String, require: true, unique: true },
    reminderFrequency: { type: String, require: false },
    bannerStyle: { type: String, require: false },
    iv: { type: String, require: true },
    token: { type: String, require: true },
    level: { type: Number, require: true },
    maxLevel: { type: Number, require: true },
    lastUpdatedAt: { type: Date, require: true },
    totalReviewsDone: { type: Number, require: false },
    startedLevelAt: {type: Date, require: false},
    unlockedLevelAt:{type: Date, require: false},
    passedLevelAt: {type: Date, require: false},
    nextReviewsAt: {type: Date, require: false}
    
  },
  { timestamps: true }
);

module.exports = model("userDataSchema", userDataSchema);
