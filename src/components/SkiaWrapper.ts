import { Canvas } from 'skia-canvas';
import { PDFDocument, rgb } from 'pdf-lib';
import * as PIXI from 'pixi.js';

const exportToPDFAsImage = async (application: PIXI.Application) => {

    const skiaCanvas = new Canvas(application.screen.width, application.screen.height);
    const ctx = skiaCanvas.getContext('2d');

    // Obter o DataURL do canvas Pixi.js
    const pixiCanvas = application.view as HTMLCanvasElement;
    const dataUrl = pixiCanvas.toDataURL();

    // Criar uma imagem a partir do DataURL
    const image = new Image();
    image.src = dataUrl;

    // Esperar a imagem ser carregada e desenhar no skia-canvas
    image.onload = async () => {
        ctx.drawImage(image, 0, 0);

        // Salvar o conteúdo do skiaCanvas como PNG
        const pngBuffer = await skiaCanvas.png;

        // Criar um documento PDF
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([skiaCanvas.width, skiaCanvas.height]);

        // Adicionar a imagem do PNG no PDF
        const imageBytes = new Uint8Array(pngBuffer);
        const imagePdf = await pdfDoc.embedPng(imageBytes);
        const { width, height } = imagePdf.scale(1);

        // Desenhar a imagem no PDF
        page.drawImage(imagePdf, {
            x: 0,
            y: 0,
            width: skiaCanvas.width,
            height: skiaCanvas.height,
        });

        // Salvar o PDF
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });

        // Gerar um link para download do PDF
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'exported_scene.pdf';
        link.click();
    };
}

const exportToPDFAsVector = async (application: PIXI.Application) => {
    // Criar o documento PDF
    // Obter as dimensões do container Pixi.js
    const { width, height } = application.stage.getBounds();

    // Certifique-se de usar o tamanho total da tela do Pixi para garantir que a cena caiba na página do PDF
    const pageWidth = application.screen.width;
    const pageHeight = application.screen.height;

    // Criar o PDF com pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    console.log('Container bounds:', application.stage.getBounds());
    console.log('Page width:', pageWidth, 'Page height:', pageHeight);

    application.stage.children.forEach(async (child) => {
        if (child instanceof PIXI.Graphics) {
            await drawGraphics(child, page);
        } else if (child instanceof PIXI.Container) {
            // Se for um container, itere sobre os filhos internos
            child.children.forEach(async (nestedChild) => {
                if (nestedChild instanceof PIXI.Graphics) {
                    await drawGraphics(nestedChild, page);
                }
            });
        } else {
            console.log('NOT CHILD', child.constructor.name);
        }
    });

    // Salvar o PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Gerar um link para download do PDF
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exported_scene.pdf';
    link.click();
}
// Função para desenhar gráficos do Pixi.js diretamente no PDF
const drawGraphics = (graphics: PIXI.Graphics, page: any) => {
    graphics.geometry.graphicsData.forEach((data) => {
        const { shape, lineStyle, fillStyle } = data;

        const lineWidth = lineStyle ? lineStyle.width : 1;  // Largura da linha
        const lineColor = lineStyle ? lineStyle.color : 0x000000; // Cor do traço
        const fillColor = fillStyle ? fillStyle.color : null; // Cor de preenchimento

        // Convertendo as cores de hexadecimal para RGB
        const borderColor = rgb(
            ((lineColor >> 16) & 0xff) / 255,
            ((lineColor >> 8) & 0xff) / 255,
            (lineColor & 0xff) / 255
        );

        const fill = fillColor ? rgb(
            ((fillColor >> 16) & 0xff) / 255,
            ((fillColor >> 8) & 0xff) / 255,
            (fillColor & 0xff) / 255
        ) : null;

        // Desenhando as formas
        if (shape.type === PIXI.SHAPES.POLY) {
            // Desenho de caminho (path)
            if ('points' in shape) {
                const path = shape.points.map((point: any, index: number) => {
                    return (index === 0 ? 'M' : 'L') + point;
                }).join(' ');

                page.drawSvgPath(path, {
                    color: borderColor,
                    borderWidth: lineWidth
                });
            }
        } else if (shape.type === PIXI.SHAPES.RECT) {
            // Desenho de retângulo
            page.drawRectangle({
                x: shape.x,
                y: shape.y,
                width: shape.width,
                height: shape.height,
                borderWidth: lineWidth,
                borderColor: borderColor,
                color: fill || undefined
            });
        } else if (shape.type === PIXI.SHAPES.CIRC) {
            // Desenho de círculo
            page.drawEllipse({
                x: shape.x,
                y: shape.y,
                radiusX: shape.radius,
                radiusY: shape.radius,
                borderWidth: lineWidth,
                borderColor: borderColor,
                color: fill || undefined
            });
        }
        // Adicione outros tipos de formas aqui, conforme necessário
    });
}

const createDownloadBtn = () => {
    const button = document.createElement('button');
    button.innerText = 'Exportar para PDF';
    button.style.position = 'absolute';
    button.style.right = '10px';
    button.style.top = '10px';
    return button
}

export {
    exportToPDFAsVector,
    exportToPDFAsImage,
    createDownloadBtn
}
