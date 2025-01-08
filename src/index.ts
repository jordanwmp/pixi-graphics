
import { PixiContainer} from "./components/PixiContainer";

const pixiContainer = new PixiContainer();
await pixiContainer.intialize();
await pixiContainer.createGUI();

document.body.appendChild(pixiContainer.application.view as HTMLCanvasElement);

window.addEventListener('resize', () => { 
    pixiContainer.onResize()
})
