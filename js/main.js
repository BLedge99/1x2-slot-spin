//Dummy JSON responses
import { SlotMachineScene } from './Scenes/SlotMachineScene.js';

// simple application configuration
let config  = {width: 1920, height: 1080}

console.log('Config set', config)


let app
let seed = [0, 1, 2, 3];

// wait for DOM before creating application
window.addEventListener('load', function() {
    //Create a Pixi Application
    app = new PIXI.Application(config);

    //Add the canvas that Pixi automatically created for you to the HTML document
    document.body.appendChild(app.view);

    console.log('App created');
    
    async function showSlotMachine() {
        const slotMachine = new SlotMachineScene(app, config.width, config.height, seed);
        app.stage.addChild(slotMachine);
    }

    showSlotMachine();


});

        
