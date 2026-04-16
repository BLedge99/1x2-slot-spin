export class SymbolLoader {

    constructor(app) {
        this.app = app;                    // Store reference to PIXI Application
        this.symbols = new Map();          // Cache loaded symbols to avoid reloading
    }

    /**
     * Loads a symbol by ID (00 to 05) and returns a Promise that resolves with the Spine instance
     * @param {string|number} id - Symbol ID (0-5 or "00"-"05")
     * @returns {Promise<PIXI.spine.Spine>}
     */
    async loadSymbol(id) {
        // Normalize ID to two-digit string (00, 01, ..., 05)
        const symbolId = String(id).padStart(2, '0');
        
        // Return cached symbol if already loaded
        if (this.symbols.has(symbolId)) {
            const cached = this.symbols.get(symbolId);
            // Clone the spine so we can use multiple instances of the same symbol
            return this.cloneSpine(cached);
        }

        const assetName = `symbol_${symbolId}`;
        const assetPath = `assets/symbols/symbol_${symbolId}.json`;

        return new Promise((resolve, reject) => {
            // Check if already loading to prevent duplicate loader calls
            if (this.app.loader.resources[assetName]) {
                const spine = this.createSpineInstance(this.app.loader.resources[assetName]);
                this.symbols.set(symbolId, spine);
                resolve(this.cloneSpine(spine));
                return;
            }

            this.app.loader
                .add(assetName, assetPath)
                .load((loader, resources) => {
                    try {
                        const spineData = resources[assetName].spineData;
                        const spine = new PIXI.spine.Spine(spineData);
                        
                        // Store original for future cloning
                        this.symbols.set(symbolId, spine);
                        
                        // Return a fresh clone to the caller
                        resolve(this.cloneSpine(spine));
                    } catch (error) {
                        reject(error);
                    }
                });
        });
    }

    // Helper method to create a new Spine instance from loaded resource
    createSpineInstance(resource) {
        return new PIXI.spine.Spine(resource.spineData);
    }

    //Create a clone of the spine instance to allow multiple instances of the same symbol
    cloneSpine(originalSpine) {
        const clone = new PIXI.spine.Spine(originalSpine.spineData);
        // Copy common properties if needed
        clone.x = originalSpine.x;
        clone.y = originalSpine.y;
        clone.scale.set(originalSpine.scale.x, originalSpine.scale.y);
        return clone;
    }
}