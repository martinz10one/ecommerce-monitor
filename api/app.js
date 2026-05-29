import express from 'express';
import cors from 'cors';
import snapshotsRoutes from './routes/snapshots.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

app.get('/snapshots', (req, res) => {
    res.redirect('/snapshots/changes');
});

app.use('/snapshots', snapshotsRoutes);

app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});