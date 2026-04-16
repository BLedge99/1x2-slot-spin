//Dummy JSON responses
import { SymbolLoader } from './Engine/symbolLoader.js';
import { SlotMachineScene } from './Scenes/SlotMachineScene.js';
import { Reel } from './Objects/reel.js';
import { Tester } from './Objects/tester.js';

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

// simple application configuration
let config  = {width: 1920, height: 1080}

console.log('Config set', config)


let app

// wait for DOM before creating application
window.addEventListener('load', function() {
    //Create a Pixi Application
    app = new PIXI.Application(config);

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    console.log('Ape created');

    // Test the symbol
    const symbolLoader = new SymbolLoader(app);
    async function createReels() {
        for (let i = 0; i < 4; i++) {
            const symbol = await symbolLoader.loadSymbol(i);
            symbol.state.setAnimation(0, 'win', true);
            symbol.x = 200 + i * 400; // Position symbols across the screen
            symbol.y = 540; // Center vertically
            app.stage.addChild(symbol);
        }
    }

    async function showReels(result){
        for (let i in result.symbolIDs) {
            const symbol = await symbolLoader.loadSymbol(result.symbolIDs[i]);
            symbol.state.setAnimation(0, 'win', true);
            symbol.x = 200 + i * 400; // Position symbols across the screen
            symbol.y = 540; // Center vertically
            app.stage.addChild(symbol);
        }
    }
        

    function getRandomData() {
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex].response.results;
    }

    let myResult = getRandomData();
    console.log('Random result:', myResult);
    //showReels(myResult);
    console.log('Reels created');

    async function testSingleSymbol(i) {
        const symbolOne = await symbolLoader.loadSymbol(i);
        symbolOne.state.setAnimation(0, 'static', true);
        symbolOne.x = 200; // Position symbols across the screen
        symbolOne.y = 540; // Center vertically
        app.stage.addChild(symbolOne);
    }

    async function testForLoops(result) {
        for (let i in result.symbolIDs) {
            console.log('Symbol ID:', result.symbolIDs[i]);
        }
    }

    async function reel() {
        const reel = new Reel(app, config.height, 3);
        app.stage.addChild(reel);
        await reel.ready; // Wait for the reel to finish loading symbols
        console.log('Reel ready, spinning...');
        reel.spin(8, 5, 5); // minSpin, spinToSymbolID, duration
    }

    async function test() {
        const reel = new Tester(app);
        app.stage.addChild(reel);
    }

    async function testSlotMachine(seed = 0) {
    // Use seed to pick a deterministic result from your dummy data
        const seededIndex = seed % data.length;
        const result = data[seededIndex].response.results;

        console.log(`[SlotMachine Test] Seed: ${seed} → index ${seededIndex}`, result);

        // Build the scene
        const slotMachine = new SlotMachineScene(app);
        app.stage.addChild(slotMachine);

        // Wait for symbols to initialise before spinning
        await slotMachine.waitForInit();

        // Spin — minSpin of 8 gives a good visual, reels stagger naturally
        const minSpin = 8;
        await slotMachine.spin(minSpin, result.symbolIDs);

        console.log(`[SlotMachine Test] Spin complete. Win amount: ${result.win}`);
        if (result.win > 0) {
            console.log(`WIN! Amount: ${result.win}`);
            // hook in your win animation / UI here
        }
    }



    async function showSlotMachine() {
        const slotMachine = new SlotMachineScene(app, config.width, config.height, [0, 1, 2, 3]);
        app.stage.addChild(slotMachine);
    }

    showSlotMachine();


});

        
