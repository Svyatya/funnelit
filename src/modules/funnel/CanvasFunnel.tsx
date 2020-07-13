import React, { useEffect, useState } from 'react';
import { Funnel, FunnelProps }        from './funnel';

const CanvasFunnel = ({style: {baseHeight, baseWidth, bgPadding, itemColor, marginBetween, lastWidth}, items}: FunnelProps) => {
    let [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = document.getElementById('funnelCanvas') as HTMLCanvasElement;
        setContext(canvas.getContext('2d'))
    }, []);

    useEffect(() => {
        clear();
        drawScaled();
        //drawScaled();
    });

    function clear() {
        if (!context) return;
        const canvas = document.getElementById('funnelCanvas') as HTMLCanvasElement;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function draw() {
        if (!context) return;

        items.map((item, i) => drawItem(item, i))
    }

    const drawItem = (item: Funnel, i: number) => {
        if (!context || !items[0]) return;

        const valueLength = baseWidth / items[0].value;

        const baseX = bgPadding + (baseWidth - (item.value * valueLength)) / 2;

        context.beginPath();
        context.fillStyle = _gradient1[i] || itemColor;
        context.moveTo(baseX, i * baseHeight + (i * marginBetween));
        context.lineTo(baseX + (item.value * valueLength), i * baseHeight + (i * marginBetween));
        context.lineTo(baseX + (item.value * valueLength), baseHeight + i * baseHeight + (i * marginBetween));
        context.lineTo(baseX, baseHeight + i * baseHeight + (i * marginBetween));
        context.fill();

        const textY = baseHeight + i * baseHeight + (i * marginBetween) - 12;

        context.font = '24px Tahoma';
        context.textAlign = "center";
        context.fillStyle = 'black';
        context.fillText(item.value.toString(), (baseWidth + bgPadding * 2) / 2,  textY);

        if (item.label) {
            context.textAlign = "left";
            context.fillText(item.label, (baseWidth + bgPadding * 2) + 30, textY)
        }


        if (i < items.length - 1) {
            const nextItemValue = items[i + 1].value;
            const nextItemBaseX = bgPadding + (baseWidth - (nextItemValue * valueLength)) / 2;

            context.beginPath();
            context.fillStyle = _gradient1[i] || itemColor;
            context.moveTo(baseX, baseHeight + i * baseHeight + (i * marginBetween));
            context.lineTo(baseX + (item.value * valueLength), baseHeight + i * baseHeight + (i * marginBetween));
            context.lineTo(nextItemBaseX + (nextItemValue * valueLength), baseHeight + i * baseHeight + (i * marginBetween) + marginBetween);
            context.lineTo(nextItemBaseX, baseHeight + i * baseHeight + (i * marginBetween) + marginBetween);
            context.fill();
        }
    }

    const drawScaled = () => {
        if (!context || !items[0]) return;
        const minusWidth = (baseWidth - lastWidth) / (items.length + 2);

        items.map((item, i) => drawScaledItem(item, i, minusWidth))

        console.log(minusWidth);
    }

    const drawScaledItem = (item: Funnel, i: number, minusWidth: number) => {
        if (!context) return;

        const baseX = bgPadding;


        context.beginPath();
        context.fillStyle = _gradient2[i] || itemColor;
        context.moveTo(baseX + (minusWidth * i), bgPadding + i * baseHeight + (i * marginBetween));
        context.lineTo(baseX + (baseWidth - (minusWidth * i)), bgPadding + i * baseHeight + (i * marginBetween));
        context.lineTo(baseX + (baseWidth - (minusWidth * (i + 1))), bgPadding + baseHeight + i * baseHeight + (i * marginBetween));
        context.lineTo(baseX + (minusWidth * (i + 1)), bgPadding + baseHeight + i * baseHeight + (i * marginBetween));
        context.fill();

        const textY = bgPadding + baseHeight + i * baseHeight + (i * marginBetween) - 12;

        context.font = '24px Tahoma';
        context.textAlign = "center";
        context.fillStyle = 'black';
        context.fillText(item.value.toString(), baseWidth / 2,  textY);


        if (item.label) {
            context.textAlign = "left";
            context.fillText(item.label, (baseWidth + bgPadding * 2) + 30, textY)
        }
    }

    return (
        <div>
            <canvas id="funnelCanvas" width={baseWidth + (bgPadding * 2) + 400} height="300"></canvas>
        </div>
    );
}

const _gradient1 = ['#8ddef2', '#68d8f3', '#3cd1ef', '#27acd7', '#8ddef2'];
const _gradient2 = ['#fee600', '#f1da00', '#e4cf00', '#d7c300', '#FEE600'];

export default CanvasFunnel;