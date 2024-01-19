

export type CreateLocalUserDto = {
  provider: "local";
  email: string;
  password: string;
  username: string;
  avatar?: string;
}

export type CreateFortyTwoUserDto = {
  provider: "42";
  email: string;
  username: string;
  avatar: string;
  flag_avatar: boolean;
}

export type CreateUserDto =
  | CreateLocalUserDto
  | CreateFortyTwoUserDto

  export type ModifyUserDto = {
    avatar?: string;
    username?: string;
  }

  export type ModifyUserBody = {
    avatar: ?string;
    username: string;
    userId: string;
  }

