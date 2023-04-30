import { UserDto } from "./dto/userDto"

export interface ParamsDictionary {
  [key: string]: any
}


declare global {
  namespace Express {
    export interface Request {
      user?: UserDto
    }
  }
}