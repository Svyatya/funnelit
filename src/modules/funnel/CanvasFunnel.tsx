import React, { useEffect, useState } from 'react';
import { act }                                from 'react-dom/test-utils';
import { Funnel, FunnelElement, FunnelProps } from './funnel';

const CanvasFunnel =
    ({
         style: {
             baseHeight, baseWidth, bgPadding, itemColor, marginBetween, lastWidth, innerFontSize, title, baseX, baseY
         },
         items,
        funnelElements
    }: FunnelProps) => {

    let [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    let [currentActiveElement, setActiveElement] = useState(-1);
    const baseColor = hexToRgb(itemColor);
    const textElements = [];

    useEffect(() => {
        const canvas = document.getElementById('funnelCanvas') as HTMLCanvasElement;
        setContext(canvas.getContext('2d'));
    }, []);

    useEffect(() => {
        clear();
        drawScaled();
    });

    function hexToRgb(hex: string) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ?
            [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [255, 255, 255];
    }

    const getColor = (counter: number) => {
        const newColor = baseColor.map(i => i - Math.round((i / 100 * (counter * 5))));
        return `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`;
    }

    function clear() {
        if (!context) return;
        const canvas = document.getElementById('funnelCanvas') as HTMLCanvasElement;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    const drawScaled = () => {
        if (!context || !items[0]) return;
        const minusWidth = (baseWidth - lastWidth) / (items.length + 2);

        funnelElements.map((element, i) => {
            drawScaledItem(element, i);
        });

        items.map((item, i) => {
            drawMainText(item, i, minusWidth);
            drawPercents(item, i, minusWidth);
        });

        drawTitle();
        drawMainPercent();
        drawActiveElement();
    }

    const drawTitle = () => {
        if (!context) return;

        context.font = `${innerFontSize}px Tahoma`;
        context.textAlign = "center";
        context.fillStyle = 'black';
        context.fillText(title, baseX + baseWidth / 2, bgPadding + innerFontSize);
    }

    const drawScaledItem = (element: FunnelElement, i: number) => {
        if (!context) return;

        context.beginPath();
        context.fillStyle = getColor(i);
        context.moveTo(element.point1.x, element.point1.y);
        context.lineTo(element.point2.x, element.point2.y);
        context.lineTo(element.point3.x, element.point3.y);
        context.lineTo(element.point4.x, element.point4.y);
        context.fill();
    }

    const drawMainText = (item: Funnel, i: number, minusWidth: number) => {
        if (!context) return;
        const textY = baseY + (baseHeight * i) + (baseHeight + innerFontSize - 4) / 2;

        context.font = `${innerFontSize}px Tahoma`;
        context.textAlign = "center";
        context.fillStyle = 'black';
        context.fillText(item.value.toString(), baseX + (baseWidth / 2),  textY);

        if (item.label) {
            context.textAlign = "left";
            context.fillText(item.label, baseX + (baseWidth) + 30, textY)
        }
    }

    const drawPercents = (item: Funnel, i: number, minusWidth: number) => {
        if (!context || i === 0 || !item.value || !items[i - 1].value) return;

        const textY = baseY + (baseHeight * i) + (baseHeight + innerFontSize - 4) / 2;
        const textX = baseX;

        context.font = `${innerFontSize}px Tahoma`;
        context.textAlign = "start";
        context.fillStyle = 'black';
        context.fillText(`${Math.round(100 / items[i - 1].value * item.value)} %`, textX,  textY);
    }

    const drawMainPercent = () => {
        if (!context || items.length === 0 || !items[0].value || !items[items.length - 1].value) return;

        const value = Math.round(100 / items[0].value * items[items.length - 1].value);

        context.font = `${innerFontSize}px Tahoma`;
        context.textAlign = "start";
        context.fillStyle = 'black';
        context.fillText(`${value} %`, bgPadding,  baseY + items.length * baseHeight / 2);

        const textLength = context.measureText(`${value} %`).width;

        context.beginPath();
        context.fillStyle = 'black';
        context.moveTo(bgPadding + textLength + 16, baseY + (baseHeight / 2));
        context.lineTo(bgPadding + textLength + 8, baseY + (baseHeight / 2));
        context.lineTo(bgPadding + textLength + 8, baseY + items.length * baseHeight - (baseHeight / 2));
        context.lineTo(bgPadding + textLength + 16, baseY + items.length * baseHeight - (baseHeight / 2));
        context.stroke();
    }

    const drawActiveElement = () => {
        if (currentActiveElement === -1 || !context) return;

        const element = funnelElements[currentActiveElement]
        context.beginPath();
        context.fillStyle = 'black';
        context.moveTo(element.point1.x - 1, element.point1.y - 1);
        context.lineTo(element.point2.x + 1, element.point2.y - 1);
        context.lineTo(element.point3.x + 1, element.point3.y + 1);
        context.lineTo(element.point4.x - 1, element.point4.y + 1);
        context.lineTo(element.point1.x - 1, element.point1.y - 1);
        context.stroke();
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!context) return;
        let active = activeElement(mousePosition({ clientX: e.clientX, clientY: e.clientY }));
        if (active != currentActiveElement)
            setActiveElement(active);
    }

    const mousePosition = (data: { clientX: number, clientY: number}) => {
        const canvas = document.getElementById('funnelCanvas')!.getBoundingClientRect();

        return {
            x: data.clientX - canvas.left,
            y: data.clientY - canvas.top
        }
    }

    const activeElement = (position:  { x:number, y: number}) => {
        let active = -1;

        funnelElements.forEach((item: any, i: number) => {
            if (position.x >= item.point1.x && position.x <= item.point2.x
                && position.y >= item.point1.y && position.y <= item.point3.y)
                active = i;
        });

        return active;
    }

    return (
        <div className="funnel-canvas__wrapper">
            <canvas
                id="funnelCanvas"
                className="funnel-canvas"
                width={baseWidth + (bgPadding * 2) + 400}
                height={bgPadding * 2 + baseHeight * items.length + 50}
                onMouseMove={handleMouseMove}
            ></canvas>
        </div>
    );
}

const _gradient1 = ['#8ddef2', '#68d8f3', '#3cd1ef', '#27acd7', '#8ddef2'];

export default CanvasFunnel;