import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './database';
import { router } from './api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', router);

async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda işləyir`);
    });
  } catch (error) {
    console.error('Server başlamadı:', error);
    process.exit(1);
  }
}

start();