/* eslint-disable prettier/prettier */
import mongoose from 'mongoose';

const dbConnect = async () => {
  await mongoose.connect(
    'mongodb+srv://taha101:taha101@cluster0.d12hf.mongodb.net/sync-demo?retryWrites=true&w=majority&appName=Cluster0',
  );
};

export default dbConnect;
