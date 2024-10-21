import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { FireblocksSDK } from 'fireblocks-sdk';

@Injectable()
export class UserService {
  private readonly fireblocks: FireblocksSDK;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {
    this.fireblocks = new FireblocksSDK(
      process.env.FIREBLOCKS_API_SECRET,
      process.env.FIREBLOCKS_API_KEY,
    );
  }

  async create(createUserDto: any): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).exec();
  }

  generateJwtToken(user: User) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createWallet(userId: string): Promise<string> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const walletName = `${user.name}'s Wallet`;
    const newVault = await this.fireblocks.createVault(walletName);
    user.walletId = newVault.id;
    await user.save();
    return newVault.id;
  }

  async verifyKYC(userId: string): Promise<void> {
    // Implement Blockpass KYC verification here
    // This is a placeholder and needs to be replaced with actual Blockpass integration
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.kycStatus = 'verified';
    await user.save();
  }

  async manualVerification(userId: string): Promise<void> {
    const user = await this.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    user.manuallyVerified = true;
    await user.save();
  }
}