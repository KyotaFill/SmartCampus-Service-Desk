import cors from 'cors';
import express from 'express';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173' }));
  app.use(express.json());

  app.get('/api/health', (_request, response) => {
    response.json({ status: 'ok', service: 'smartcampus-api' });
  });

  app.use((request, response) => {
    response.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: `Không tìm thấy ${request.method} ${request.path}`
      }
    });
  });

  return app;
}

