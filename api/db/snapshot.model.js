import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: String,
    price: String
});

const snapshotSchema = new mongoose.Schema({
    products: [productSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Snapshot', snapshotSchema);