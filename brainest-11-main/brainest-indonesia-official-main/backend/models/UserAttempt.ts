import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAttempt extends Document {
  user: mongoose.Types.ObjectId;
  tryout: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  status: 'ongoing' | 'completed' | 'abandoned';
  score?: number;
  answers: Array<{
    questionId: mongoose.Types.ObjectId;
    answer: string;
    timeSpent: number;
    isCorrect: boolean;
  }>;
  violations: Array<{
    type: string;
    timestamp: Date;
    details: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const UserAttemptSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Index untuk query berdasarkan user
  },
  tryout: {
    type: Schema.Types.ObjectId,
    ref: 'Tryout',
    required: true,
    index: true // Index untuk query berdasarkan tryout
  },
  startTime: {
    type: Date,
    required: true,
    index: true // Index untuk query berdasarkan waktu mulai
  },
  endTime: {
    type: Date,
    index: true // Index untuk query berdasarkan waktu selesai
  },
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'abandoned'],
    required: true,
    index: true // Index untuk query berdasarkan status
  },
  score: {
    type: Number,
    index: true // Index untuk query berdasarkan skor
  },
  answers: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    timeSpent: {
      type: Number,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  violations: [{
    type: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    details: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true,
  // Optimasi query dengan compound indexes
  indexes: [
    // Index untuk query leaderboard
    { user: 1, tryout: 1, score: -1 },
    // Index untuk query riwayat tryout user
    { user: 1, startTime: -1 },
    // Index untuk query tryout yang sedang berlangsung
    { status: 1, startTime: 1 }
  ]
});

// Optimasi query dengan virtual fields
UserAttemptSchema.virtual('duration').get(function() {
  if (!this.endTime) return null;
  return this.endTime.getTime() - this.startTime.getTime();
});

UserAttemptSchema.virtual('accuracy').get(function() {
  if (!this.answers.length) return 0;
  const correctAnswers = this.answers.filter(a => a.isCorrect).length;
  return (correctAnswers / this.answers.length) * 100;
});

// Optimasi dengan pre-save middleware
UserAttemptSchema.pre('save', function(next) {
  // Update score jika semua jawaban sudah diisi
  if (this.answers.length > 0 && !this.score) {
    this.score = this.answers.reduce((total, answer) => {
      return total + (answer.isCorrect ? 1 : 0);
    }, 0);
  }
  next();
});

// Optimasi dengan static methods
UserAttemptSchema.statics.getLeaderboard = async function(tryoutId: string) {
  return this.find({ tryout: tryoutId, status: 'completed' })
    .sort({ score: -1 })
    .limit(100)
    .populate('user', 'name')
    .lean();
};

UserAttemptSchema.statics.getUserHistory = async function(userId: string) {
  return this.find({ user: userId })
    .sort({ startTime: -1 })
    .populate('tryout', 'name')
    .lean();
};

export const UserAttempt = mongoose.model<IUserAttempt>('UserAttempt', UserAttemptSchema);
