import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ required: true, enum: ['buy', 'sell'] })
  type: string;

  @Prop({ required: true, enum: ['USDT_ERC20', 'USDT_BEP20', 'USDT_TRC20'] })
  cryptocurrency: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, enum: ['open', 'matched', 'completed', 'cancelled'], default: 'open' })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);