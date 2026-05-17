import mongoose from 'mongoose';

const streakSchema = new mongoose.Schema(
  {
    current: { type: Number, default: 0 },
    best: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: null },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, index: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    totalScore: { type: Number, default: 0 },
    streak: { type: streakSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
