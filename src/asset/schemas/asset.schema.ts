import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type AssetDocument = Asset & Document;

@Schema()
export class Asset {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true })
  assetId: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: true, enum: ['deposit', 'withdrawal'] })
  type: string;

  @Prop({ required: true, enum: ['pending', 'completed', 'failed'] })
  status: string;

  @Prop()
  address?: string;

  @Prop()
  transactionId?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);