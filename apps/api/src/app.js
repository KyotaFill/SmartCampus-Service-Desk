import cors from 'cors';
import express from 'express';
import { createAuthRouter } from './auth/router.js';
import { AppError } from './errors.js';

export function createApp({ authRepository, jwtSecret, jwtExpiresIn } = {}) {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', service: 'smartcampus-api' });
  });

  if (authRepository && jwtSecret) {
    app.use(
      '/api/auth',
      createAuthRouter({ authRepository, jwtSecret, jwtExpiresIn })
    );
  }

  app.use((request, response) => {
    response.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Không tìm thấy ${request.method} ${request.path}`
      }
    });
  });

  app.use((error, _request, response, _next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      return response.status(400).json({
        error: {
          code: 'INVALID_JSON',
          message: 'JSON không hợp lệ'
        }
      });
    }

    if (error instanceof AppError) {
      return response.status(error.status).json({
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {})
        }
      });
    }

    console.error(error);
    return response.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Đã xảy ra lỗi hệ thống'
      }
    });
  });

  return app;
}
