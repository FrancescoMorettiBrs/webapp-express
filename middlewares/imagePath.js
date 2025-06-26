const imagePath = (req, res, next) => {
  req.imagePath = `${req.protocol}://${req.get("host")}/images/movies`;
  next();
};

export default imagePath;
