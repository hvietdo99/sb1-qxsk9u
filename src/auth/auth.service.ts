import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async googleLogin(req) {
    if (!req.user) {
      return 'No user from Google';
    }
    // Check if user exists, if not create a new user
    let user = await this.userService.findByEmail(req.user.email);
    if (!user) {
      user = await this.userService.create({
        email: req.user.email,
        name: req.user.name,
        googleId: req.user.googleId,
      });
    }
    // Generate JWT token
    return this.userService.generateJwtToken(user);
  }

  async verify2FA(userId: string, token: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
    });
  }
}