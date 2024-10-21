import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  googleId: string;

  @Prop()
  walletId: string;

  @Prop({ default: 'unverified' })
  kycStatus: string;

  @Prop({ default: false })
  manuallyVerified: boolean;

  @Prop()
  twoFactorSecret: string;
}

export const UserSchema = SchemaFactory.createForClass(User);