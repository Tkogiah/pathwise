import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { DigestService } from './digest.service';

interface AuthRequest {
  user: { sub: string };
}

@Controller('digest')
export class DigestController {
  constructor(private readonly digestService: DigestService) {}

  /** Manual trigger — generates digests for all users. Protected (requires JWT). */
  @Post('generate')
  async generate() {
    const count = await this.digestService.generateAll();
    return { generated: count };
  }

  /** Fetch the logged-in user's digests. Protected (requires JWT). */
  @Get('me')
  async findMine(@Query('date') dateKey?: string, @Req() req?: AuthRequest) {
    const userId = req!.user.sub;
    return this.digestService.findByUser(userId, dateKey);
  }
}
