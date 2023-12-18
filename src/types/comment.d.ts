import { BaseType } from "./common";
import { UserType } from "./user";

export type CommentType = BaseType & {
  content: string;
  reply: ReplyType[];
  user: UserType;
};

export type ReplyType = BaseType & {
  content: string;
  user: UserType;
};
