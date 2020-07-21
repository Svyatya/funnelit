import React, { useEffect, useState } from 'react';
import { Funnel, FunnelElement, FunnelProps } from './funnel';

const CanvasFunnel =
    ({
         style: {
             baseHeight, baseWidth, bgPadding, itemColor, marginBetween, lastWidth, innerFontSize, title, baseX, baseY
         },
         items,
         setEditableElement,
         editableElement,
        funnelElements
    }: FunnelProps) => {

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [currentActiveElement, setActiveElement] = useState<number | null>(null);
    const baseColor = hexToRgb(itemColor);

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

        funnelElements.map((element, i) => {
            drawScaledItem(element, i);
        });

        items.map((item, i) => {
            drawMainText(item, i);
            drawPercents(item, i);
        });

        drawTitle();
        drawMainPercent();
        drawActiveElement();
        drawEditableBorder();
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

    const drawMainText = (item: Funnel, i: number) => {
        if (!context) return;
        const textY = baseY + (baseHeight * i) + (baseHeight + innerFontSize - 4) / 2;

        context.font = `${innerFontSize}px Tahoma`;
        context.textAlign = "center";
        context.fillStyle = 'black';
        context.fillText(item.value.toString(), baseX + (baseWidth / 2),  textY + (marginBetween * i));

        if (item.label) {
            context.textAlign = "left";
            context.fillText(item.label, baseX + (baseWidth) + 30, textY + (marginBetween * i))
        }
    }

    const drawPercents = (item: Funnel, i: number) => {
        if (!context || i === 0 || !item.value || !items[i - 1].value) return;

        const textY = baseY + (baseHeight * i) + (baseHeight + innerFontSize - 4) / 2 + (marginBetween * i);
        const textX = baseX - 20;

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
        context.fillText(`${value} %`, bgPadding,  baseY + (items.length * baseHeight + marginBetween * items.length) / 2);

        const textLength = context.measureText(`${value} %`).width;
        const lineStart = baseY + (baseHeight / 2);
        const lineEnd = baseY + items.length * baseHeight - (baseHeight / 2) + (marginBetween * (items.length - 1));

        context.beginPath();
        context.strokeStyle = 'black';
        context.moveTo(bgPadding + textLength + 16, lineStart);
        context.lineTo(bgPadding + textLength + 8, lineStart);
        context.lineTo(bgPadding + textLength + 8, lineEnd);
        context.lineTo(bgPadding + textLength + 16, lineEnd);
        context.stroke();
    }

    const drawBorder = (i: number, color: string) => {
        if (!context) return;

        const element = funnelElements[i];

        context.beginPath();
        context.strokeStyle = color;
        context.moveTo(element.point1.x - 1, element.point1.y - 1);
        context.lineTo(element.point2.x + 1, element.point2.y - 1);
        context.lineTo(element.point3.x + 1, element.point3.y - 1);
        context.lineTo(element.point4.x - 1, element.point4.y - 1);
        context.lineTo(element.point1.x - 1, element.point1.y - 1);
        context.stroke();
    }

    const drawActiveElement = () => {
        if (currentActiveElement === null || !context) return;
        drawBorder(currentActiveElement, 'black');
    }

    const drawEditableBorder = () => {
        if (editableElement === null || !context) return;
        drawBorder(editableElement, 'red');
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!context) return;
        let active = activeElement(mousePosition({ clientX: e.clientX, clientY: e.clientY }));
        if (active != currentActiveElement)
            setActiveElement(active);
    }

    const handleClick = (e: React.MouseEvent) => {
        if (currentActiveElement || !editableElement || editableElement !== currentActiveElement) {
            setEditableElement(currentActiveElement);
        }
    }

    const mousePosition = (data: { clientX: number, clientY: number}) => {
        const canvas = document.getElementById('funnelCanvas')!.getBoundingClientRect();

        return {
            x: data.clientX - canvas.left,
            y: data.clientY - canvas.top
        }
    }

    const activeElement = (position:  { x:number, y: number}) => {
        let active = null;

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
                height={bgPadding * 2 + baseHeight * items.length + 50 + marginBetween * items.length }
                onMouseMove={handleMouseMove}
                onClick={handleClick}
            ></canvas>
        </div>
    );
}

export default CanvasFunnel;