import jwt from "jsonwebtoken";
import DB from "../models";
import { UserDto } from "../dto/userDto";
import { IUser } from "../types/IUser";

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET || "jwt-secret-access";
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || "jwt-secret-refresh";

export class TokenService {
  generateUserToken(payload: UserDto) {
    const accessToken = jwt.sign(payload, jwtAccessSecret, { expiresIn: "30m" });
    const refreshToken = jwt.sign(payload, jwtRefreshSecret, { expiresIn: "30d" });
    return {
      accessToken,
      refreshToken
    }
  }

  generateResetPasswordToken(payload: UserDto) {
    const token = jwt.sign(payload, jwtRefreshSecret, { expiresIn: "3h" });
    return token;
  }

  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await DB.Tokens.findOne({ where: { userId: userId } });
    
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const tokenItem = await DB.Tokens.create({ userId: userId, refreshToken });
    return tokenItem;
  }

  validateAccessToken(token: string) {
    try {
      const data = jwt.verify(token, jwtAccessSecret);
      return data;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const data = jwt.verify(token, jwtRefreshSecret) as IUser | null;
      return data;
    } catch (error) {
      return null;
    }
  }

  async removeToken(refreshToken: string) {
    const tokenData = await DB.Tokens.findOne({ where: { refreshToken } });
    await tokenData.destroy();
    return tokenData;
  }

  async findToken(refreshToken: string) {
    const tokenData = await DB.Tokens.findOne({ where: { refreshToken } });
    return tokenData;
  }
}


