import { Request, Response } from "express";
import { UserModel } from "./models/definitions";
import { Session } from "express-session";

export interface RequestWithLocalVariables extends Request {
  session: Session & { discoverToken: string };
  user: UserModel;
  flash: (isSuccess: "success" | "error", msg?: string) => void;
  login: (
    registeredUser: { user: string; password: string },
    cb: (err: Error) => void
  ) => void;
  logout: (callback?: (err: Error) => void) => void;
  isAuthenticated: () => boolean;
}

export interface RequestWithFiles extends RequestWithLocalVariables {
  files?: any;
}

export interface Locals {
  currentUser?: UserModel;
  success?: string | void;
  error?: string | void;
}

export interface ResponseWithLocalVariables extends Response {
  locals: Locals;
}

export type CustomFile = {
  path?: string;
  filename?: string;
  originalname?: string;
};

export interface Error {
  statusCode?: number;
  message?: string;
}
