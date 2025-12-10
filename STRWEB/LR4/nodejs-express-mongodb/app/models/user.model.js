module.exports = mongoose => {
  const User = mongoose.model(
    "user",
    new mongoose.Schema({
      username: String,
      email: String,
      password: String,
      googleId: String, 
      roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "role"
        }
      ]
    })
  );

  return User;
};
