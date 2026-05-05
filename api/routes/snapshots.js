import express from 'express';
import Snapshot from '../db/snapshot.model.js';
import { compareSnapshots } from '../services/diff.js';

const router = express.Router();

/**
 * POST /snapshots
 * Recibe productos, guarda snapshot y calcula cambios vs el anterior
 */
router.post('/', async (req, res) => {
    try {
        const products = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ error: "Debe ser un array de productos" });
        }

        // 🟢 Obtener último snapshot
        const lastSnapshot = await Snapshot.findOne().sort({ createdAt: -1 });

        // 🟢 Crear nuevo snapshot
        const newSnapshot = await Snapshot.create({
            products
        });

        // 🔥 Comparar (si no hay anterior, devuelve [])
        const changes = compareSnapshots(lastSnapshot, newSnapshot);

        console.log("📊 Cambios detectados:", changes);

        res.json({
            message: "Snapshot guardado",
            total: products.length,
            changes
        });

    } catch (error) {
        console.error("❌ Error en POST /snapshots:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


/**
 * GET /snapshots/changes
 * Devuelve cambios entre los 2 últimos snapshots
 * Filtro opcional: ?type=price | new | removed
 */
router.get('/changes', async (req, res) => {
    try {
        const { type } = req.query;

        const snapshots = await Snapshot.find()
            .sort({ createdAt: -1 })
            .limit(2);

        if (snapshots.length < 2) {
            return res.json({ changes: [] });
        }

        const [newSnap, oldSnap] = snapshots;

        let changes = compareSnapshots(oldSnap, newSnap);

        // 🔥 filtro opcional
        if (type) {
            changes = changes.filter(c => c.type === type);
        }

        res.json({ changes });

    } catch (error) {
        console.error("❌ Error en GET /snapshots/changes:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;