import { NextFunction, Request, Response } from "express";

module.exports = (
  fn: (req: Request, res: Response, next: NextFunction) => any
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
