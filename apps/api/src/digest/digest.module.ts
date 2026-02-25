import { Module } from '@nestjs/common';
import { DigestService } from './digest.service';
import { DigestController } from './digest.controller';
import { EmailService } from './email.service';

@Module({
  providers: [DigestService, EmailService],
  controllers: [DigestController],
})
export class DigestModule {}
