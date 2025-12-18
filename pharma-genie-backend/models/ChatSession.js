import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['system', 'user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  tokens: {
    type: Number,
    default: 0
  }
}, { _id: false });

const chatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    default: 'anonymous'
  },
  messages: [messageSchema],
  metadata: {
    provider: String,
    model: String,
    totalTokens: {
      type: Number,
      default: 0
    },
    totalCost: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
chatSessionSchema.index({ sessionId: 1, createdAt: -1 });
chatSessionSchema.index({ userId: 1, createdAt: -1 });

// Virtual for message count
chatSessionSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Method to add a message
chatSessionSchema.methods.addMessage = function(role, content, tokens = 0) {
  this.messages.push({ role, content, tokens });
  this.metadata.totalTokens += tokens;
  this.updatedAt = new Date();
  return this.save();
};

// Static method to create or get session
chatSessionSchema.statics.getOrCreate = async function(sessionId, userId = 'anonymous') {
  let session = await this.findOne({ sessionId });
  
  if (!session) {
    session = await this.create({
      sessionId,
      userId,
      messages: [],
      metadata: {
        totalTokens: 0,
        totalCost: 0
      }
    });
  }
  
  return session;
};

// Static method to get recent conversations
chatSessionSchema.statics.getRecentSessions = async function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ updatedAt: -1 })
    .limit(limit)
    .select('sessionId metadata createdAt updatedAt')
    .lean();
};

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;
