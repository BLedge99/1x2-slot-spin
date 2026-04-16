import { SymbolLoader } from "../Engine/symbolLoader";

export class Reel extends PIXI.Container {
    #screenHeight;
    #startSymbolID;
    #spacing = 400; // px height of each symbol slot — tune to your spine sizes
    #spinAmnt = 10;
    constructor(app, screenHeight, startSymbolID) {
        super();
        this.app = app;
        this.#screenHeight = screenHeight;
        this.#startSymbolID = startSymbolID;
        this.ready = this.#drawSymbols(this.#startSymbolID);
        console.log('Reel created with startSymbolID:', this.#startSymbolID);
    }

    async #drawSymbols(startSymbolID) {
        const symbolLoader = new SymbolLoader(this.app);
        const middleHeight = this.#screenHeight / 2;

        for (let i = 0; i < 6; i++) {
            const symbol = await symbolLoader.loadSymbol(i);
            symbol.state.setAnimation(0, 'static', true);
            let offset = ((i - startSymbolID + 6) % 6);
            if (offset > 3) offset -= 6; // Adjust offset to be between -3 and +3
            symbol.x = 200
            symbol.y = middleHeight + offset * this.#spacing; // Position symbols vertically with spacing
            this.addChild(symbol);
        }
        
    }

    async #addSymbols(numLaps) {
        const symbolLoader = new SymbolLoader(this.app);
        const middleY = this.#screenHeight / 2;
        const cycleHeight = 6 * this.#spacing;

        for (let lap = 0; lap < numLaps; lap++) {
            for (let i = 0; i < 6; i++) {
                const symbol = await symbolLoader.loadSymbol(i);
                symbol.state.setAnimation(0, 'static', true);
                symbol.x = 200;

                // Place each symbol in a long vertical strip
                // We offset by full cycles so they are stacked one after another
                symbol.y = middleY + (lap * cycleHeight) + ((i - this.#startSymbolID + 6) % 6) * this.#spacing;

                this.addChild(symbol);
            }
        }
    }

    async spin(minSpin, spinToSymbolID, duration = 3) {
        // 1. Calculate how many full symbol steps we need to move
        const extraSteps = (spinToSymbolID - this.#startSymbolID + 6) % 6;
        const totalSteps = minSpin * 6 + extraSteps;

        // 2. Decide how many extra laps of symbols we need to add (safety margin)
        const numLapsToAdd = Math.ceil(totalSteps / 6) + 2;   // +2 for smooth look

        // 3. Add the symbols BEFORE starting the animation
        await this.#addSymbols(numLapsToAdd);

        // 4. Calculate total distance to travel
        const totalSpinDistance = totalSteps * this.#spacing;

        return new Promise(resolve => {
            gsap.to(this, {
                y: `-=${totalSpinDistance}`,        // Negative = symbols move downward (classic reel spin)
                duration: duration,
                ease: "power2.inOut",
                onComplete: () => {
                    // Reset seed with current position for next spin
                    this.y = 0;
                    this.removeChildren(); // Clear old symbols
                    this.#startSymbolID = spinToSymbolID;
                    this.#drawSymbols(this.#startSymbolID); // Redraw symbols to reset positions    
                    resolve();
                }
            });
        });
    }

    setAnimation(animationName) {
        this.children.forEach(symbol => {
            if (!symbol?.state?.setAnimation) return;

            if (animationName === 'win') {
                symbol.state.setAnimation(0, 'win', true);
            } else {
                symbol.state.setAnimation(0, 'static', true);
            }
        });
    }

    calculateSpin(minSpin, spinToSymbolID) {
        return minSpin + (spinToSymbolID - this.#startSymbolID + 6) % 6;
    }
}