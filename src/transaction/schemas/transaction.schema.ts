import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true })
  buyOrder: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true })
  sellOrder: string;

  @Prop({ required: true, type: Number })
  amount: number;

  @Prop({ required: true, type: Number })
  price: number;

  @Prop({ required: true, enum: ['pending', 'escrow_created', 'completed', 'cancelled'], default: 'pending' })
  status: string;

  @Prop()
  escrowId: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);