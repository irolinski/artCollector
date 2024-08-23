import { UserModel } from "../../src/models/definitions";

export const testUserLogin = {
  username: process.env.TEST_USER!,
  password: process.env.TEST_USER_PASS!,
  user_id: process.env.TEST_USER_ID!,
  email: process.env.TEST_USER_EMAIL!,
};

export const fakeUserLogin = {
  username: (Math.random() + 1).toString(36).substring(7),
  password: (Math.random() + 1).toString(36).substring(7),
};

export const testUserRegister = {
  email: `${(Math.random() + 1).toString(24).substring(7)}.@mail.com`,
  username: (Math.random() + 1).toString(36).substring(7),
  password: (Math.random() + 1).toString(36).substring(7),
};
