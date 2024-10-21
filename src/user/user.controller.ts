import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-wallet')
  createWallet() {
    return this.userService.createWallet();
  }

  @Post('verify-kyc')
  verifyKYC() {
    return this.userService.verifyKYC();
  }

  @Post('manual-verification')
  manualVerification() {
    return this.userService.manualVerification();
  }
}