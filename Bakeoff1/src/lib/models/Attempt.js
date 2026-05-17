import mongoose from 'mongoose';

const feedbackItemSchema = new mongoose.Schema(
  {
    questionId: { type: String, required: true },
    correct: { type: Boolean, required: true },
    points: { type: Number, default: 0 },
    explanation: { type: String, default: '' },
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
      index: true,
    },
    answers: { type: [Number], default: [] },
    score: { type: Number, required: true },
    totalPossible: { type: Number, required: true },
    feedback: { type: [feedbackItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Attempt || mongoose.model('Attempt', attemptSchema);
