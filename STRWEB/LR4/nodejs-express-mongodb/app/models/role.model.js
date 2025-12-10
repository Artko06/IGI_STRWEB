module.exports = mongoose => {
  const Role = mongoose.model(
    "role",
    new mongoose.Schema({
      name: String
    })
  );

  return Role;
};
