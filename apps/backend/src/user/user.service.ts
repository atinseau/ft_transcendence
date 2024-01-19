import { Injectable } from "@nestjs/common";
import DatabaseService from "src/database/database.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { hash } from "bcrypt";
import { CreateUserDto, ModifyUserDto } from "./dto/create-user";
import generateRandomNumber from "src/utils/generateRandomNumber";
import generateRandomLetter from "src/utils/generateRandomLetter";
import { userInfo } from "os";
import FortyTwoController from "src/fortytwo/fortytwo.controller";
import TypedError from "src/errors/TypedError";


@Injectable()
export default class UserService {

  constructor(
    private databaseService: DatabaseService
  ) { }

  async findUserById(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        id
      }
    })
    return user
  }

  async findUserByEmailOrUsername(query: { email?: string, username?: string }) {
    const users = await this.databaseService.user.findMany({
      take: 1,
      where: {
        OR: [
          {
            username: query.username
          },
          {
            email: query.email
          }
        ]
      }
    })
    const user = users.length > 0 ? users[0] : null
    if (user && query.email !== user.email) {
      console.warn('User found by username instead of email, this is a security issue')
      return null
    }
    return user
  }

  async findUserByEmail(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email
      }
    })
    return user
  }

  async findUserByUsername(username: string) {
    const user = await this.databaseService.user.findUnique({
      where: {
        username
      }
    })
    return user
  }

  async toggle2fa(userId: string) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const twoFactorEnabled = !user.twoFactorEnabled;

    await this.databaseService.user.update({
      where: {
        id: userId
      },
      data: {
        twoFactorEnabled: twoFactorEnabled
      }
    })

    return {
      message: `2FA has been ${twoFactorEnabled ? 'enabled' : 'disabled'}`,
      twoFactorEnabled: twoFactorEnabled
    }
  }

  generate2faSecret() {
    const secret = Array.from({ length: 6 }).map(() => {
      const letterOrNumber = generateRandomNumber(0, 1);
      if (letterOrNumber === 0) {
        return generateRandomNumber(0, 9);
      } else {
        return generateRandomLetter();
      }
    }).join('');
    return secret;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      if (createUserDto.provider === "local") {
        return await this.databaseService.user.create({
          data: {
            email: createUserDto.email,
            password: await hash(createUserDto.password, 10),
            username: createUserDto.username,
            avatar: "/public/default.png", // "url statique",
          }
        })
      } else if (createUserDto.provider === "42") {
        return await this.databaseService.user.create({
          data: {
            email: createUserDto.email,
            username: createUserDto.username,
            avatar: createUserDto.avatar,
          }
        })
      } else {
        throw new Error("Invalid provider")
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = (error?.meta?.target || []) as string[]
          if (target.includes('email')) {
            throw new Error('Email already exists')
          }
          if (target.includes('username')) {
            throw new Error('Username already exists')
          }
        }
      }
      throw error
    }
  }

  async modifyUser(userId: string, modifyUserDto: ModifyUserDto) {
    try {
      const data: {
        flag_avatar?: boolean; username?: string, avatar?: string
      } = {};
      if (modifyUserDto.username) {
        data.username = modifyUserDto.username

      }
      if (modifyUserDto.avatar) {
        data.avatar = modifyUserDto.avatar
        data.flag_avatar = false

      }
      return await this.databaseService.user.update(
        {
          data,
          where: {
            id: userId,
          }
        })



        
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = (error?.meta?.target || []) as string[]
          if (target.includes('username')) {
            throw new TypedError({
              type: 'username_already_exists',
              message: 'Username already exists'
            }) // pour gérer les deux cas ? empty + already exists
          }

        }
      }
      throw error
    }
  }



  async changeUserStatus(userId: string, status: "online" | "offline" | "ingame") {
    const user = await this.databaseService.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user)
      throw new Error('User not found');

    return this.databaseService.user.update({
      where: {
        id: userId
      },
      data: {
        status: status
      }
    });
  }

}
