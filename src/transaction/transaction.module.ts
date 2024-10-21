import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { AssetModule } from '../asset/asset.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    AssetModule,
    UserModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}