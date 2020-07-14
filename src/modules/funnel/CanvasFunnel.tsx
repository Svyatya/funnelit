import React, { useEffect, useState } from 'react';
import { Funnel, FunnelProps }        from './funnel';

const CanvasFunnel =
    ({
         style: {
             baseHeight, baseWidth, bgPadding, itemColor, marginBetween, lastWidth, innerFontSize, title
         },
         items
    }: FunnelProps) => {

    let [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const baseX = bgPadding + 80;
    const baseY = bgPadding + (title ? innerFontSize + bgPadding : 0);
    const funnelElements = [];
    const textElements = [];

    useEffect(() => {
        const canvas = document.getElementById('funnelCanvas') as HTMLCanvasElement;
        setContext(canvas.getContext('2d'));
    }, []);

    useEffect(() => {
        clear();
        drawScaled();
    });

    function clear() {
        if (!context) return;
        const canvas = document.getElementById('funnelCanvas') as HTMLCanvasElement;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    const drawScaled = () => {
        if (!context || !items[0]) return;
        const minusWidth = (baseWidth - lastWidth) / (items.length + 2);

        items.map((item, i) => {
            drawScaledItem(item, i, minusWidth);
            drawMainText(item, i, minusWidth);
            drawPercents(item, i, minusWidth);
        });
        drawTitle();
        drawMainPercent();
    }

    const drawTitle = () => {
        if (!context) return;
        console.log(bgPadding);
        context.font = `${innerFontSize}px Tahoma`;
        context.textAlign = "center";
        context.fillStyle = 'black';
        context.fillText(title, baseX + baseWidth / 2, bgPadding + innerFontSize);
    }

    const drawScaledItem = (item: Funnel, i: number, minusWidth: number) => {
        if (!context) return;

        const element = {
            point1: {
                x: baseX + (minusWidth * i),
                y: baseY + i * baseHeight + (i * marginBetween)
            },
            point2: {
                x: baseX + (baseWidth - (minusWidth * i)),
                y: baseY + i * baseHeight + (i * marginBetween)
            },
            point3: {
                x: baseX + (baseWidth - (minusWidth * (i + 1))),
                y: baseY + baseHeight + i * baseHeight + (i * marginBetween)
            },
            point4: {
                x: baseX + (minusWidth * (i + 1)),
                y: baseY + baseHeight + i * baseHeight + (i * marginBetween)
            }
        };

        context.beginPath();
        context.fillStyle = _gradient2[i] || itemColor;
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

    return (
        <div>
            <canvas
                id="funnelCanvas"
                width={baseWidth + (bgPadding * 2) + 400}
                height="300"
            ></canvas>
        </div>
    );
}

const _gradient1 = ['#8ddef2', '#68d8f3', '#3cd1ef', '#27acd7', '#8ddef2'];
const _gradient2 = ['#fee600', '#f1da00', '#e4cf00', '#d7c300', '#FEE600'];

export default CanvasFunnel;