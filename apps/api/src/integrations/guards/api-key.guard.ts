import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const apiKey = process.env.INTEGRATION_API_KEY;
    if (!apiKey) {
      throw new UnauthorizedException('Integration API key not configured');
    }
    const request = context.switchToHttp().getRequest<Request>();
    const provided = request.headers['x-api-key'];
    if (provided !== apiKey) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
