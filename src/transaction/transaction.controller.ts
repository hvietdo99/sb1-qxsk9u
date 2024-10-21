import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('order')
  async createOrder(@Req() req, @Body() orderData: any) {
    const isFraudulent = await this.transactionService.checkFraud(req.user.userId, orderData);
    if (isFraudulent) {
      throw new Error('Potential fraudulent activity detected');
    }
    return this.transactionService.createOrder(req.user.userId, orderData);
  }

  @Get('orders')
  getOrders(@Req() req) {
    return this.transactionService.getOrders(req.user.userId);
  }

  @Post('match')
  matchOrders() {
    return this.transactionService.matchOrders();
  }

  @Put('order/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.transactionService.updateOrderStatus(id, status);
  }

  @Post('escrow/release/:id')
  releaseEscrow(@Param('id') id: string) {
    return this.transactionService.releaseEscrow(id);
  }
}