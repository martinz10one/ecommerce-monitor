import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'data.json');

function read() {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { snapshots: [] };
    }
}

function write(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function saveSnapshot(products) {
    const data = read();
    const snapshot = {
        id: Date.now(),
        products,
        createdAt: new Date().toISOString(),
    };
    data.snapshots.push(snapshot);
    write(data);
    return snapshot;
}

export async function getLastSnapshot() {
    const data = read();
    if (data.snapshots.length === 0) return null;
    return data.snapshots[data.snapshots.length - 1];
}

export async function getLastTwoSnapshots() {
    const data = read();
    const sorted = data.snapshots.sort((a, b) => b.id - a.id);
    return sorted.slice(0, 2);
}

export async function clearSnapshots() {
    write({ snapshots: [] });
}
