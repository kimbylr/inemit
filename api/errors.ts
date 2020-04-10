import { Request } from 'express';

export const catch404 = (req, res, next) =>
  next({
    message: 'Not found',
    status: 404,
  });

export const handleError = (err, req: Request, res, next) => {
  console.log(`Error handling ${req.method.toUpperCase()} ${req.path} --`, err);

  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
};
