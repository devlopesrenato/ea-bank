import { Controller, Post, Body, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<IUserData> {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<IUserLogin> {
    return this.userService.login(loginDto);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'))
  update(@Body() updateUserDto: UpdateUserDto, @Req() req): Promise<IUserData> {
    return this.userService.update(updateUserDto, req.user.id);
  }
}
