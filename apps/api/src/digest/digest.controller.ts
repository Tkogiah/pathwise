import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { DigestService } from './digest.service';

@Controller('digest')
export class DigestController {
  constructor(private readonly digestService: DigestService) {}

  /** Manual trigger — generates digests for all users. Protected (requires JWT). */
  @Post('generate')
  async generate() {
    const count = await this.digestService.generateAll();
    return { generated: count };
  }

  /** Fetch digests for a specific user. Protected (requires JWT). */
  @Get(':userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('date') dateKey?: string,
  ) {
    return this.digestService.findByUser(userId, dateKey);
  }
}
