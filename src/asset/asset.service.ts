import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Asset, AssetDocument } from './schemas/asset.schema';
import { UserService } from '../user/user.service';
import { FireblocksSDK } from 'fireblocks-sdk';

@Injectable()
export class AssetService {
  private readonly fireblocks: FireblocksSDK;

  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
    private userService: UserService
  ) {
    this.fireblocks = new FireblocksSDK(
      process.env.FIREBLOCKS_API_SECRET,
      process.env.FIREBLOCKS_API_KEY
    );
  }

  // ... (previous methods remain the same)

  async lockFunds(walletId: string, assetId: string, amount: string): Promise<void> {
    await this.fireblocks.lockVaultAccount(walletId, assetId, amount);
  }

  async transferFunds(fromWalletId: string, toWalletId: string, assetId: string, amount: string): Promise<void> {
    await this.fireblocks.createTransaction({
      assetId,
      amount,
      source: {
        type: 'VAULT_ACCOUNT',
        id: fromWalletId
      },
      destination: {
        type: 'VAULT_ACCOUNT',
        id: toWalletId
      }
    });
  }
}