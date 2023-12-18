import { BaseType } from "./common";

export type UserType = BaseType & {
  account: string;
  password: string;
  email: string;
  sign_time: string;
  role: number;
  salt: string;
  profile: ProfileType;
};

export type ProfileType = BaseType & {
  name: string;
  signature: string;
  avatar: string;
  sex: number;
  article_num: number;
};
