import { IUserAuth } from "../types/IUserAuth";
import DB from "../models";
import ApiError from "../exceptions/api-error";
import bcrypt from "bcrypt";
import { UserDto } from "../dto/userDto";
import { TokenService } from "./token-service";

export class UserService {

  tokenService = new TokenService()

  async registration({ username, password }: IUserAuth) {
    const candidateUsername = await DB.Users.findOne({ where: { username } });

    if (candidateUsername) {
      throw ApiError.BadRequest(`Пользователь с таким логином ${username} уже существует`)
    }

    const hashPassword = await bcrypt.hash(password, 3);


    const user = await DB.Users.create({
      username,
      password: hashPassword
    });
    const userDto = new UserDto(user as any);

    const tokens = this.tokenService.generateUserToken({ ...userDto });
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    }
  }

  async login(username: string, password: string) {
    const user = await DB.Users.findOne({
      where: { username }
    });
    if (!user) {
      throw ApiError.BadRequest(`Неверный пароль или логин`); // * Для безопастности
    }

    const isPassEquals = await bcrypt.compare(password, user.getDataValue("password"));

    if (!isPassEquals) {
      throw ApiError.BadRequest(`Неверный пароль или логин`); // * Для безопастности
    }

    const userDto = new UserDto(user as any);
    const tokens = this.tokenService.generateUserToken({ ...userDto }); // Generate token 

    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    }
  }

  async logout(refreshToken: string) {
    const token = await this.tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = await DB.Users.findOne({
      where: { id: userData.id },
    });
    const userDto = new UserDto(user as any);
    const tokens = this.tokenService.generateUserToken({ ...userDto });

    await this.tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }
}
