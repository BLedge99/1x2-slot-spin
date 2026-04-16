import { Reel } from '../Objects/reel.js';
import { PlayerBalance } from '../Engine/playerBalance';

let data = [

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [2, 5, 2, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [5, 5, 5, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [0, 3, 1, 4]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [5, 4, 1, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 2,
                "symbolIDs": [1, 1, 5, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 4,
                "symbolIDs": [2, 2, 2, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 4,
                "symbolIDs": [5, 5, 2, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 3,
                "symbolIDs": [2, 2, 3, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [4, 5, 3, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [5, 5, 5, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 9,
                "symbolIDs": [3, 3, 3, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 6,
                "symbolIDs": [4, 4, 4, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 1,
                "symbolIDs": [0, 0, 3, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 5,
                "symbolIDs": [1, 1, 1, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [2, 5, 2, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 5,
                "symbolIDs": [2, 2, 2, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [4, 3, 0, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 6,
                "symbolIDs": [3, 3, 3, 0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [2, 2, 2, 2]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": [0, 1, 5, 4]
            }
        }
    },

]

export class SlotMachineScene extends PIXI.Container {
    #startSeed = [0, 1, 2, 3] // Starting symbols for each reel (0-5)
    #reels = [];
    #spinButton;          // PIXI.DisplayObject — your UI button
    #isSpinning = false;
    #playerBalance = new PlayerBalance(2000); // Starting balance for the player

    constructor(app, screenWidth, screenHeight, startSeed) {
        super();
        this.app = app;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.#startSeed = startSeed;
        this.ready = this.#setScene();
    }

    async #setScene() {
        await this.#initReels();
        await this.#buildSpinButton();
        await this.#showPlayerBalance();
    }

    async #showPlayerBalance() {
        const balanceText = new PIXI.Text(`Balance: $${this.#playerBalance.getBalance()}`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF
        });
        balanceText.x = 10;
        balanceText.y = 10;
        this.addChild(balanceText);

    }

    async #buildSpinButton() {
        const container = new PIXI.Container();

        // Background
        const bg = new PIXI.Graphics();
        bg.beginFill(0x007BFF);
        bg.drawRoundedRect(0, 0, 120, 50, 10);
        bg.endFill();
        container.addChild(bg);

        // Text
        const text = new PIXI.Text('SPIN', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0xFFFFFF,
            align: 'center'
        });
        text.anchor.set(0.5);
        text.x = 60;
        text.y = 25;
        container.addChild(text);

        // Make it interactive
        container.interactive = true;
        container.buttonMode = true;   // cursor: pointer

        // Hover effects
        container.on('pointerover', () => { bg.tint = 0x0056b3; });
        container.on('pointerout', () => { bg.tint = 0x007BFF; });
        container.on('pointerdown', () => {
            if (!this.#isSpinning) {
                this.#isSpinning = true;
                this.spin(this.getData());
            }
        });

        // Position
        container.x = (this.screenWidth - 120) / 2;
        container.y = this.screenHeight - 100;

        this.addChild(container);
        this.#spinButton = container;
    }
    async #initReels() {
        const reelCount = 4;
        const reelSpacing = this.screenWidth / (reelCount + 1);
        for (let i = 0; i < reelCount; i++) {
            const reel = new Reel(this.app, this.screenHeight, this.#startSeed[i]);
            await reel.ready; // Wait for the reel to finish initializing its symbols
            reel.x = (i + 1) * reelSpacing;
            reel.y = 0;
            this.addChild(reel);
            this.#reels.push(reel);
        }
    }

    async spin(data) {
        console.log('Spinning with data:', data);
        let minSpins = [];
        for (let i = 0; i < this.#reels.length; i++) {
            const minSpin = 8 + Math.floor(Math.random() * 5);
            this.#reels[i].spin(minSpin, data[i], 5 + i);
        }
        await new Promise(resolve => setTimeout(resolve, 5000 + this.#reels.length * 1000)); // Wait for all reels to finish
        this.#isSpinning = false;
    }

    getData(){
        return data[Math.floor(Math.random() * data.length)].response.results.symbolIDs;
    }
}

