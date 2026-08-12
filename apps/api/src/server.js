import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3000);
const app = createApp();

app.listen(port, () => {
  console.log(`SmartCampus API đang chạy tại http://localhost:${port}`);
});

