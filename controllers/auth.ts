import { NextFunction, Request, Response } from "express";
import { IUserAuth } from "../types/IUserAuth";
import { UserService } from "../services/user-service";

const userService = new UserService();

export class AuthController {

  async registration(
    req: Request<{}, any, IUserAuth>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userData = await userService.registration(req.body);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }


  async authorization(
    req: Request<{}, any, IUserAuth>,
    res: Response,
    next: NextFunction
  ) {
    try {
      console.log("req", req.body)
      const { username, password } = req.body;

      const userData = await userService.login(username, password);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async refreshToken(
    req: Request<{}, any, { refreshToken: string }>, 
    res: Response, 
    next: NextFunction
  ) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      return res.json(userData);
    } catch (e) {
      next(e)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {

      const { refreshToken } = req.cookies;

      await userService.logout(refreshToken);

      return res.json("success");
    } catch(e) {
      next(e);
    }
  }


}
