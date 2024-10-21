import { Controller, Get, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('process')
  processPayment() {
    return this.paymentService.processPayment();
  }

  @Post('refund')
  refundPayment() {
    return this.paymentService.refundPayment();
  }

  @Post('cancel')
  cancelPayment() {
    return this.paymentService.cancelPayment();
  }

  @Get('rates')
  getExchangeRates() {
    return this.paymentService.getExchangeRates();
  }

  @Post('fraud/check')
  checkFraud() {
    return this.paymentService.checkFraud();
  }
}