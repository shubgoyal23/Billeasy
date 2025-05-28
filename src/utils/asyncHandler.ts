import type { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler = (
  requestHandler: (req: Request, res: Response, next: NextFunction) => any,
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};

export { asyncHandler };
