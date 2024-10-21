import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AssetService } from './asset.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('asset')
@UseGuards(JwtAuthGuard)
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get('holdings')
  getHoldings(@Req() req) {
    return this.assetService.getHoldings(req.user.userId);
  }

  @Post('deposit')
  deposit(@Req() req, @Body() depositData: { assetId: string; amount: string }) {
    return this.assetService.deposit(req.user.userId, depositData.assetId, depositData.amount);
  }

  @Post('withdraw')
  withdraw(@Req() req, @Body() withdrawData: { assetId: string; amount: string; destinationAddress: string }) {
    return this.assetService.withdraw(req.user.userId, withdrawData.assetId, withdrawData.amount, withdrawData.destinationAddress);
  }

  @Get('transactions')
  getTransactions(@Req() req) {
    return this.assetService.getTransactions(req.user.userId);
  }
}