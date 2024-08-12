import { Request, Response } from "express";
import { UserModel } from "./models/definitions";
import { Session } from "express-session";
import { LogOutOptions } from "passport";

export type RequestWithLocalVariables = Request & {
  session: Session & { discoverToken: string };
  user?: UserModel;
  // flash: (isSuccess?: "success" | "error", msg?: string) => string | void
  login: (registeredUser: { user: string; password: string }, cb: any) => any;
  logout: {
    (option: LogOutOptions, done: (err: any) => void): void;
    (done: (err: any) => void): void;
  };
  // isAuthenticated: () => any;
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
