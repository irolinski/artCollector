import { RequestWithLocalVariables } from "../definitions";
import { UserModel } from "../models/definitions";

type RequestWithUser = RequestWithLocalVariables & { user: UserModel };
function userCheckUndefined(
  req: RequestWithLocalVariables
): asserts req is RequestWithUser {
  if (!("user" in req)) {
    throw new Error("Request object without user found unexpectedly");
  }
}

export default userCheckUndefined;
