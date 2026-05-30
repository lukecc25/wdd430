import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    prompt: { type: String, required: true },
    options: { type: [String], required: true },
    correctIndex: { type: Number, required: true },
    points: { type: Number, default: 10 },
    explanation: { type: String, default: '' },
  },
  { _id: true }
);

const lessonSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    lessonContent: { type: String, default: '' },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    questions: { type: [questionSchema], default: [] },
    isOfficial: { type: Boolean, default: false, index: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    authorName: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
