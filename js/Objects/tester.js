import { SymbolLoader } from "../Engine/symbolLoader";

export class Tester extends PIXI.Container {
    constructor(app) {
        super();
        this.app = app;
        this.ready = this.#drawSymbols();
    }

    async #drawSymbols() {
        const symbolLoader = new SymbolLoader(this.app);
        for (let i = 0; i < 4; i++) {
            const symbol = await symbolLoader.loadSymbol(i);
            symbol.state.setAnimation(0, 'win', true);
            symbol.x = 200
            symbol.y = 540 + i * 400; // Position symbols vertically with spacing
            this.addChild(symbol);
        }
    }
}