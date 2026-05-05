import express from 'express';
import dotenv from 'dotenv';
import snapshotsRoutes from './routes/snapshots.js';
import { connectDB } from './db/connection.js';

dotenv.config();
connectDB();

const app = express(); // 👈 ESTO FALTABA

app.use(express.json()); // 👈 también importante para recibir JSON

const PORT = 3000;

app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

app.use('/snapshots', snapshotsRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});