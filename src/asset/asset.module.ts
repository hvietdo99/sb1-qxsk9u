import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { Asset, AssetSchema } from './schemas/asset.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
    UserModule,
  ],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService], // Export AssetService
})
export class AssetModule {}