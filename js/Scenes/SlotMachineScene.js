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
    #stake = 100; // Fixed bet amount per spin

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
        await this.#buildStakeInput();
    }

    async #showPlayerBalance() {
        this.removeChild(...this.children.filter(child => child instanceof PIXI.Text)); // Clear old balance text
        const balanceText = new PIXI.Text(`Balance: $${this.#playerBalance.getBalance()}`, {
            fontFamily: 'Orbitron',
            fontSize: 40,
            fill: 0xf7f02a
        });
        balanceText.x = 120;
        balanceText.y = this.screenHeight / 2 + 60; // Position below the stake input
        this.addChild(balanceText);

    }

    async #buildSpinButton() {
        const container = new PIXI.Container();

        // Background
        const bg = new PIXI.Graphics();
        bg.beginFill(0x191515);
        bg.drawRoundedRect(0, 0, 120, 50, 10);
        bg.endFill();
        container.addChild(bg);

        // Text
        const text = new PIXI.Text('SPIN', {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0x2ffce1,
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
        container.x = 180;
        container.y = this.screenHeight / 2 - 80; // Position above the stake input

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

    async #buildStakeInput() {
        // Optional: Implement a UI element to allow the player to change their bet amount
        // This could be a simple text input or buttons to increase/decrease the stake
        const container = new PIXI.Container();

        // Background
        const bg = new PIXI.Graphics();
        bg.beginFill(0x191515);
        bg.drawRoundedRect(0, 0, 150, 50, 10);
        bg.endFill();
        container.addChild(bg);

        // Text
        const text = new PIXI.Text(`Stake: $${this.#stake}`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: 0x2ffce1,
            align: 'center'
        });
        text.anchor.set(0.5);
        text.x = 75;
        text.y = 25;
        container.addChild(text);

        //Minus Button
        const minusButton = new PIXI.Text('-', {
            fontFamily: 'Arial',
            fontSize: 30,
            fill: 0xFFFFFF,
            align: 'center'
        });
        minusButton.anchor.set(0.5);
        minusButton.x = -30;
        minusButton.y = 25;
        minusButton.interactive = true;
        minusButton.buttonMode = true;
        minusButton.on('pointerdown', () => {
            if (this.#stake > 100) {
                this.#stake -= 100;
                text.text = `Stake: $${this.#stake}`;
            }
        });
        container.addChild(minusButton);
        //Plus Button
        const plusButton = new PIXI.Text('+', {
            fontFamily: 'Arial',
            fontSize: 30,
            fill: 0xFFFFFF,
            align: 'center'
        });
        plusButton.anchor.set(0.5);
        plusButton.x = 180;
        plusButton.y = 25;
        plusButton.interactive = true;
        plusButton.buttonMode = true;
        plusButton.on('pointerdown', () => {
            if (this.#stake < 1000) {
                this.#stake += 100;
                text.text = `Stake: $${this.#stake}`;
            }
        });
        container.addChild(plusButton); 
        // Position
        container.x = 170;
        container.y = this.screenHeight / 2 ;
        this.addChild(container);
    }

    async spin(data) {
        for (let i = 0; i < this.#reels.length; i++) {
            this.#reels[i].setAnimation('static'); // Set to static for spin
        }
        console.log('Spinning with data:', data[0], 'Win amount:', data[1]);
        this.#playerBalance.updateBalance(-this.#stake); 
        this.#showPlayerBalance(); // Update balance display immediately after betting
        let minSpins = [];
        for (let i = 0; i < this.#reels.length; i++) {
            const minSpin = 8 + Math.floor(Math.random() * 5);
            this.#reels[i].spin(minSpin, data[0][i], 5 + i);
        }
        await new Promise(resolve => setTimeout(resolve, 5000 + this.#reels.length * 1000)); // Wait for all reels to finish
        this.#isSpinning = false;
        if (data[1] > 0) {
            for (let i = 0; i < this.#reels.length; i++) {
                this.#reels[i].setAnimation('win');
            }
            this.#playerBalance.updateBalance(data[1]);
            this.#showPlayerBalance();
        }
    }

    getData(){
        let index = Math.floor(Math.random() * data.length);
        let result = [data[index].response.results.symbolIDs, data[index].response.results.win];
        return result;
    }
}

