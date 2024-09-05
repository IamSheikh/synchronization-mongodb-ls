/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
import dbConnect from './dbConnect';
import Tweet from '../models/Tweet.model';

const addTweet = async (tweet: {
  text: string;
  username: string;
  createdAt: number;
}) => {
  await dbConnect();
  try {
    const newTweet = new Tweet({
      text: tweet.text,
      username: tweet.username,
      createdAt: tweet.createdAt,
    });
    await newTweet.save();
    console.log(newTweet);
  } catch (err) {
    console.log(err);
  }
};

const getAllTweets = async () => {
  await dbConnect();

  try {
    const tweets = await Tweet.find().sort({ createdAt: -1 });
    return tweets;
  } catch (err) {
    console.log(err);
  }
};

export { addTweet, getAllTweets };
