const errorsHandler = (err, res, req, next) => {
  return res.status(500).json({
    status: "fail",
    error: "Something went wrong!",
  });
};

export default errorsHandler;
