/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Number,
    required: true,
  },
});

const Tweet = mongoose.models.tweets || mongoose.model('tweets', tweetSchema);

export default Tweet;
