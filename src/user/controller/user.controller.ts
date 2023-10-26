import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Req,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';

import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiCreatedResponse({ description: 'you have successfully signed up' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
          const uniqueSuffix =
            Date.now() + Math.round(Math.random() * 1e9) + '_';
          const filename = `${uniqueSuffix}__${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  @Post('signup')
  signUp(
    @Body() body: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    return this.userService.signUp(body, avatar.filename);
  }

  @ApiOkResponse({ description: 'you have successfully signed in' })
  @Post('signin')
  signIn(@Body() body: CreateUserDto) {
    return this.userService.signIn(body);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ description: 'user info' })
  @Get()
  findOne(@Req() req) {
    const token = req.token;
    return this.userService.findOne(token);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ description: 'your info was updated' })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
          const uniqueSuffix =
            Date.now() + Math.round(Math.random() * 1e9) + '_';
          const filename = `${uniqueSuffix}__${file.originalname}`;
          callback(null, filename);
        },
      }),
    }),
  )
  @Put()
  update(
    @Req() req,
    @Body() body: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    if (typeof avatar == 'undefined') {
      throw new BadRequestException('avatar is required');
    }

    const token = req.token;
    return this.userService.update(body, token, avatar.filename);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ description: 'your account has been deleted' })
  @Delete()
  remove(@Req() req) {
    const token = req.token;

    return this.userService.remove(token);
  }
}
