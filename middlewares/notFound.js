const notFound = (req, res, next) => {
  res.status(404).json({
    status: "fail",
    error: "Route not found",
  });
};

export default notFound;
