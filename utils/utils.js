const MongoDBAtlasConnect = async (mongoose) => {
  console.log("Connecting to mongo...");

  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log("Connected to mongo...");
};

const getDateParams = () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  return { todayStart, todayEnd };
};

module.exports = {
  MongoDBAtlasConnect,
  getDateParams,
};
