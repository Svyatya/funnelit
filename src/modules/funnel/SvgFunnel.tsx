import React           from 'react';
import { FunnelProps } from './funnel';

const SvgFunnel = ({ style: { baseWidth, lastWidth, baseHeight, itemColor, innerFontSize, bgPadding }, items }: FunnelProps) => {
    const baseColor = [254, 230, 0];

    const getColor = (counter: number) => {
        const newColor = baseColor.map(i => i - Math.round((i / 100 * (counter * 5))));
        return `rgb(${newColor[0]}, ${newColor[1]}, ${newColor[2]})`;
    }

    const createPolygon = () => {
        if (items.length === 0) return;
        const polygons: any = [];
        const minusWidth = (baseWidth - lastWidth) / (items.length + 2);

        items.forEach((item, i) => {
            polygons.push(
                <polygon points=
                             {`
                            ${bgPadding + i * minusWidth} ${(bgPadding) + i * baseHeight}, 
                            ${bgPadding + (baseWidth - minusWidth * i)} ${bgPadding + i * baseHeight},
                            ${bgPadding + (baseWidth - minusWidth * i) - minusWidth} ${bgPadding + i * baseHeight + baseHeight}, 
                            ${bgPadding + i * minusWidth + minusWidth} ${bgPadding + i * baseHeight + baseHeight}
                            `}
                         fill={getColor(i)}
                />
            )
        });

        return polygons;
    }

    const createInnerText = () => {
        const texts: any = [];

        items.forEach((item, i) => {
            texts.push(
                <text
                    x={bgPadding + (baseWidth / 2)}
                    y={bgPadding + (baseHeight * i) + (baseHeight + innerFontSize - 4) / 2}
                    style={{
                        textAnchor: 'middle',
                        fontSize: innerFontSize,
                        fontFamily: 'Tahoma'
                    }}
                    onClick={() => console.log(i)}
                >
                    {item.value}
                </text>
            )
        });

        return texts;
    }

    const renderOutsideText = () => {
        const texts: any = [];

        items.forEach((item, i) => {
            texts.push(
                <text
                    x={bgPadding + baseWidth + 15}
                    y={bgPadding + (baseHeight * i) + (baseHeight + innerFontSize - 4) / 2}
                    style={{
                        fontSize: innerFontSize,
                        fontFamily: 'Tahoma'
                    }}
                >
                    {item.label}
                </text>
            )
        });

        return texts;
    }

    return (
        <div id="funnel-svg">
            <svg height={(bgPadding * 2) + baseHeight * items.length} width={(baseWidth + (bgPadding * 2)) + 220} className="funnel-canvas" id="funnel-svg">
                {createPolygon()}
                {createInnerText()}
                {renderOutsideText()}
            </svg>
        </div>
    );
}

export default SvgFunnel;