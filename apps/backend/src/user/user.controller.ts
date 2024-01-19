import { Body, Controller, Patch, Get, HttpException, UseInterceptors, UploadedFile, Req } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import UserService from "./user.service";
import { type Express } from 'express';
import { diskStorage } from "multer";
import { extname, join } from "path";
import { CreateUserDto, ModifyUserBody, ModifyUserDto } from "./dto/create-user";
import { URL } from "url";
import { Request } from "express";
import { verifyToken } from "src/utils/token";
import { _DESTINATION } from "src/path-configuration";
import { LoginUserDto } from "src/auth/dto/login-user.dto";
import TypedError from "src/errors/TypedError";


@Controller('user')
export default class UserController {

  constructor(
    private userService: UserService,
  ) { }

  @Get('profile')
  async profile(@Body('userId') userId: string) {
    const user = await this.userService.findUserById(userId)
    if (!user) {
      throw new HttpException(
        "User not found.",
        404
      )
    }
    return user // TODO: remove password from response
  }
  // v2 Arthur :
  //   @Patch('profile')
  //   @UseInterceptors(FileInterceptor('file', {
  //     storage: diskStorage({
  //     destination: './src/public'
  //     , filename: (req, file, cb) => {
  //       // Generating a 32 random chars long string
  //       const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
  //       // Calling the callback passing the random name generated with the original extension name
  //       cb(null, `${randomName}${extname(file.originalname)}`)
  //     }
  //   })}))
  //   async updateUser(
  //     @UploadedFile() file: Express.Multer.File,
  //     @Body('userId') userId: string,
  //     @Body('username') username: string,
  //     @Req() req: Request
  //   ){
  //     let userData = {} as {
  //       username: string,
  //       avatar:string
  //     }
  //     if (file)
  //     {
  //       const baseUrl = process.env.BACKEND_URL
  //       const avatar = new URL("/public/"+file.filename , baseUrl).toString()
  //       userData.username = username
  //       userData.avatar = avatar
  //     }
  //     else // si on ne modif que le username
  //     {
  //       userData.username = username
  //       userData.avatar = ""
  //     }
  //    return await this.userService.modifyUser(userId, userData)
  //   }
  // }

  @Patch('profile') // TODO :  file validation https://docs.nestjs.com/techniques/file-upload#file-validation
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: _DESTINATION
      , filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        // Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('username') username: string, @Req() req: Request) {
    try {
      const token = req.headers.authorization?.split(" ")[1] || null;
      // TODO : a optimiser : pk avoir a reverif ? Comment garder donnees ?
      const payload = (token ? verifyToken<{ id: string, jti: string }>(token) : null) as { id: string, jti: string }
      const userId = payload.id
      let userData: { username: string, avatar: string }
      if (file) {
        const avatar = "/public/" + file.filename
        userData = { username, avatar }
      }
      else // si on ne modif que le username
      {
        userData = { username, avatar: "" }
      }
      return await this.userService.modifyUser(userId, userData)
    } catch (e) {
      if (e instanceof TypedError && e.type === 'username_already_exists') {
        throw new HttpException(
          e.message,
          409
        )
      }
      throw new HttpException(
        e.message,
        500
      )
    }
  }

  @Patch('2fa')
  async setup2fa(@Body('userId') userId: string) {
    return await this.userService.toggle2fa(userId)
  }

  @Patch('status')
  async changeStatus(@Body('userId') userId: string, @Body('status') status: "online" | "offline" | "ingame") {
    return this.userService.changeUserStatus(userId, status);
  }
}