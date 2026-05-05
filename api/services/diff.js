export function compareSnapshots(oldSnap, newSnap) {
    if (!oldSnap) return []; // primer snapshot

    const oldMap = new Map();
    const newMap = new Map();

    oldSnap.products.forEach(p => oldMap.set(p.title, p));
    newSnap.products.forEach(p => newMap.set(p.title, p));

    const changes = [];

    // 🆕 NUEVOS
    for (let [title, product] of newMap) {
        if (!oldMap.has(title)) {
            changes.push({
                type: "new",
                product
            });
        }
    }

    // ❌ ELIMINADOS
    for (let [title, product] of oldMap) {
        if (!newMap.has(title)) {
            changes.push({
                type: "removed",
                product
            });
        }
    }

    // 🔺 CAMBIOS DE PRECIO
    for (let [title, newProduct] of newMap) {
        if (oldMap.has(title)) {
            const oldProduct = oldMap.get(title);

            if (oldProduct.price !== newProduct.price) {
                const oldPrice = parseFloat(oldProduct.price.replace('£', ''));
                const newPrice = parseFloat(newProduct.price.replace('£', ''));

                const percentage = ((newPrice - oldPrice) / oldPrice) * 100;

                changes.push({
                    type: "price",
                    title,
                    oldPrice,
                    newPrice,
                    change: percentage.toFixed(2) + "%"
                });
            }
        }
    }

    return changes;
}