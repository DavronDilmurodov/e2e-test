import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}
  async use(req: any, res: any, next: (error?: any) => void) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          message: 'provide token',
          error: 'UNAUTHORIZED',
          statusCode: 401,
        });
      }

      req.token = token;

      next();
    } catch (error) {
      console.log('auth: ' + error);
      return error.message || null;
    }
  }
}
