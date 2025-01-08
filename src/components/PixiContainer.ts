import * as PIXI from 'pixi.js';

import { CanvasRenderer } from 'pixi.js-legacy';
import { exportToPDFAsImage } from './SkiaWrapper';
// import SceneExporter from './PDF';

import randomColor from '../helpers/randomColor';
import randomNumber from '../helpers/randomNumbers';
import getImage from '../helpers/images';

class PixiContainer {

    public application!: PIXI.Application;
    private mainContainer!: PIXI.Container;
    private buttonsContainer!: PIXI.Container;
    private contentContainer!: PIXI.Container;

    public async intialize() {
        this.application = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
            view: document.createElement('canvas'),
            forceCanvas: true
        });

        this.application.renderer = new CanvasRenderer({
            forceCanvas: true,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1099bb,
        });

        // document.body.appendChild(this.application.view);
    }

    public async createGUI() {
        // Main container
        this.mainContainer = new PIXI.Container();

        // Define padding
        const padding = 50;

        // Buttons container
        this.buttonsContainer = new PIXI.Container();
        this.buttonsContainer.position.set(padding, padding);

        // Content container
        this.contentContainer = new PIXI.Container();
        this.contentContainer.position.set(padding, window.innerHeight / 2 + padding);

        // Create button shapes
        const buttonWidth = 200;
        const buttonHeight = 30;
        const buttonSpacing = 20;

        const createButton = new PIXI.Graphics();
        createButton.beginFill('#49E272').drawRect(0, 0, buttonWidth, buttonHeight).endFill();
        createButton.interactive = true;
        // createButton.buttonMode = true;
        createButton.on('pointerdown', () => this.addGraphicOnGUI());

        const exportButton = new PIXI.Graphics();
        exportButton.beginFill('#C54AE5').drawRect(0, 0, buttonWidth, buttonHeight).endFill();
        exportButton.position.set(0, buttonHeight + buttonSpacing);
        exportButton.interactive = true;
        // exportButton.buttonMode = true;
        exportButton.on('pointerdown', () => {
            // alert('EXPORT AS PDF');
            /*
                UNFORTUNATELY, I HAVE A BUG ON
                EXPORT THE PIXI.JS CONTAINER AS
                VECTOR PDF, IF I HAVE MORE TIME
                O SURE FIXID IT, FOR NOW, THE APP
                IS EXPORTING PDF AS IMAGE
            */
            exportToPDFAsImage(this.application)
            // this.export()
        });

        // Create button labels
        const createButtonText = new PIXI.Text('Create Figure', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            align: 'center',
        });
        createButtonText.anchor.set(0.5);
        createButtonText.position.set(buttonWidth / 2, buttonHeight / 2);

        const exportButtonText = new PIXI.Text('Export as PDF', {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: 0xffffff,
            align: 'center',
        });
        exportButtonText.anchor.set(0.5);
        exportButtonText.position.set(buttonWidth / 2, buttonHeight / 2);

        // Add text to buttons
        createButton.addChild(createButtonText);
        exportButton.addChild(exportButtonText);

        // Add buttons to buttons container
        this.buttonsContainer.addChild(createButton, exportButton);

        // Center buttons container
        this.buttonsContainer.x = (window.innerWidth - buttonWidth) / 2;
        this.buttonsContainer.y = (window.innerHeight - this.buttonsContainer.height) / 10;

        // Add containers to main container
        this.mainContainer.addChild(this.buttonsContainer, this.contentContainer);

        // Add main container to the application stage
        this.application.stage.addChild(this.mainContainer);
    }

    private createRectangle() {
        const rectangle = new PIXI.Graphics();
        rectangle.beginFill(randomColor()).drawRect(-50, -75, 100, 150).endFill();
    
        const x = Math.random() * (window.innerWidth - 100) + 50;
        const y = Math.random() * 150;
        rectangle.position.set(x, y);
    
        rectangle.angle = 15;
        rectangle.scale.set(1.5, 1.7);
        rectangle.interactive = true;
        rectangle.on('pointerdown', () => {
            // Adiciona uma translação em direção aleatória
            const dx = Math.random() * 150; // Valor entre -10 e 10
            const dy = Math.random() * 150; // Valor entre -10 e 10
            rectangle.position.x += dx;
            rectangle.position.y += dy;
        });
        return rectangle;
    }
    
    private createLine() {
        const line = new PIXI.Graphics();
        line.lineStyle(10, randomColor(), 1).moveTo(0, 0).lineTo(150, 100);
    
        const x = Math.random() * (window.innerWidth - 150) + 75;
        const y = Math.random() * 150;
        line.position.set(x, y);
    
        line.angle = -20;
        line.interactive = true;
        line.on('pointerdown', () => {
            // Adiciona uma translação em direção aleatória
            const dx = Math.random() * 20 - 10; // Valor entre -10 e 10
            const dy = Math.random() * 20 - 10; // Valor entre -10 e 10
            line.position.x += dx;
            line.position.y += dy;
        });
        return line;
    }
    
    private async createSprite() {
        const image = getImage(); 
        await PIXI.Assets.load(image); 
        const sprite = PIXI.Sprite.from(image); 
        sprite.width = 300; 
        sprite.height = 300;
    
        const x = Math.random() * (window.innerWidth - 150) + 75;
        const y = Math.random() * 50; 
        sprite.position.set(x, y);
    
        sprite.interactive = true;
        sprite.on('pointerdown', () => {
            // Aumenta a escala
            sprite.scale.x *= 1.5;
            sprite.scale.y *= 1.5;
        });
    
        return sprite;
    }
    
    private createEllipse() {
        const ellipse = new PIXI.Graphics();
        ellipse.beginFill(randomColor()).drawEllipse(0, 0, 200, 100).endFill();
    
        const x = Math.random() * (window.innerWidth - 200) + 100;
        const y = Math.random() * 150;
        ellipse.position.set(x, y);
    
        ellipse.interactive = true;
        ellipse.on('pointerdown', () => {
            // Incrementa a rotação
            ellipse.angle += 45;
        });
    
        return ellipse;
    }
    
    public onResize() {
        const { innerWidth, innerHeight } = window;

        // Atualiza o tamanho do renderer
        this.application.renderer.resize(innerWidth, innerHeight);

        // Reposiciona os elementos principais
        const padding = 50;
        const buttonWidth = 200;
        this.buttonsContainer.x = (innerWidth - buttonWidth) / 2;
        this.buttonsContainer.y = (innerHeight - this.buttonsContainer.height) / 10;

        this.contentContainer.position.set(padding, innerHeight / 2 + padding);
    }

    private addGraphicOnGUI() {
        const random = randomNumber()
        switch (random) {
            case 3:
                this.contentContainer.addChild(this.createEllipse());
                break
            case 5:
                this.contentContainer.addChild(this.createRectangle());
                break
            case 7:
                this.contentContainer.addChild(this.createLine());
                break
            case 9:
                this.createSprite().then(sprite => this.contentContainer.addChild(sprite));
        }
    }

    public export()
    {
        const canvas = this.application.renderer.extract.canvas(this.application.stage) //plugins.
        console.log('canvas', canvas);
    }

}


export { PixiContainer }
