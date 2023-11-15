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
    nextReviewsAt: {type: Date, require: false},
    totalAssignments: {type: Number, require:false},
    apprenticeCount: {type: Number, require: false},
    guruCount: {type: Number, require: false},
    masterCount: {type: Number, require: false},
    englightenedCount: {type: Number, require: false},
    burnedCount: {type: Number, require: false},


  },
  { timestamps: true }
);

module.exports = model("userDataSchema", userDataSchema);
