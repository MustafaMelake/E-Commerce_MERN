import { Request } from "express";
export interface ExtendReq extends Request {
  user?: any;
}
