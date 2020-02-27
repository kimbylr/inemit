export const catch404 = (req, res, next) =>
  next({
    message: 'Not found',
    status: 404,
  });

export const handleError = (err, req, res) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
};
