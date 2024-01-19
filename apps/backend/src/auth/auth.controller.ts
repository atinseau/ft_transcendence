import { Body, Controller, Get, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import AuthService from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { RegisterUserDto } from "./dto/register-user.dto";
import { TwoFaCallbackDto } from "./dto/two-fa-callback.dto";
import { ForgotCallbackDto } from "./dto/forget-callback.dto";
import TypedError from "src/errors/TypedError";

@UsePipes(new ValidationPipe({
  exceptionFactory(errors) {
    const messages = errors.map((error) => {
      return {
        property: error.property,
        messages: Object.values(error?.constraints || {})
      }
    })
    throw new HttpException({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: messages,
    }, HttpStatus.UNPROCESSABLE_ENTITY)
  },
}))
@Controller('auth')
export default class AuthController {

  constructor(
    private authService: AuthService,
  ) { }

  @Get('hello')
  hello() {
    return {
      message: "Hello World!"
    };
  }

  @Post('signup')
  async signup(@Body() registerUserDto: RegisterUserDto) {
    try {
      return await this.authService.register(registerUserDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.CONFLICT)
    }
  }

  @Post('2fa/callback')
  async twoFactorCallback(@Body() twoFaCallbackDto: TwoFaCallbackDto) {
    try {
      const {
        secretCode,
        userId
      } = twoFaCallbackDto
      return await this.authService.complete2fa(userId, secretCode)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Post('signin')
  async signin(@Body() loginUser: LoginUserDto) {
    try {
      return await this.authService.login(loginUser);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    try {
      return await this.authService.refresh(refreshToken);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.UNAUTHORIZED)
    }
  }

  @Post('signout')
  async singout(
    @Body('userId') userId: string,
    @Body('accessToken') accessToken: string,
  ) {
    try {
      return await this.authService.logout(userId, accessToken);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('forgot')
  async forgot(@Body('email') email: string) {

    if (!email) throw new HttpException('Email is required', HttpStatus.UNPROCESSABLE_ENTITY)

    try {
      return await this.authService.forgot(email)
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  @Post('forgot-callback')
  async forgotCallback(@Body() forgotCallbackBody: ForgotCallbackDto) {
    try {
      return await this.authService.forgotCallback(forgotCallbackBody.token, forgotCallbackBody.password)
    } catch (e) {
      if (e instanceof TypedError && e.type === 'conflict') {
        throw new HttpException(e.message, HttpStatus.CONFLICT)
      }
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

}

