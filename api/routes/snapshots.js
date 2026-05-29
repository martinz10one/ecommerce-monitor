import express from 'express';
import { saveSnapshot, getLastSnapshot, getLastTwoSnapshots } from '../db/storage.js';
import { compareSnapshots } from '../services/diff.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const products = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ error: "Debe ser un array de productos" });
        }

        const lastSnapshot = await getLastSnapshot();
        const newSnapshot = await saveSnapshot(products);

        const changes = compareSnapshots(lastSnapshot, newSnapshot);

        res.json({
            message: "Snapshot guardado",
            total: products.length,
            changes
        });

    } catch (error) {
        console.error("Error en POST /snapshots:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get('/changes', async (req, res) => {
    try {
        const { type } = req.query;
        const [newSnap, oldSnap] = await getLastTwoSnapshots();

        if (!oldSnap) {
            return res.json({ changes: [] });
        }

        let changes = compareSnapshots(oldSnap, newSnap);

        if (type) {
            changes = changes.filter(c => c.type === type);
        }

        res.json({ changes });

    } catch (error) {
        console.error("Error en GET /snapshots/changes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;