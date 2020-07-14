import React           from 'react';
import { FunnelProps } from './funnel';

const SvgFunnel = ({ style: { baseWidth, lastWidth, baseHeight, itemColor, innerFontSize, bgPadding }, items }: FunnelProps) => {
    const baseColor = [254, 230, 0];
    const leftSideLength = 50 + bgPadding;

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
                            ${leftSideLength + i * minusWidth} ${(bgPadding) + i * baseHeight}, 
                            ${leftSideLength + (baseWidth - minusWidth * i)} ${bgPadding + i * baseHeight},
                            ${leftSideLength + (baseWidth - minusWidth * i) - minusWidth} ${bgPadding + i * baseHeight + baseHeight}, 
                            ${leftSideLength + i * minusWidth + minusWidth} ${bgPadding + i * baseHeight + baseHeight}
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
                    x={leftSideLength + (baseWidth / 2)}
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
                    x={leftSideLength + baseWidth + 15}
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

    const renderPercents = () => {
        const texts: any = [];

        items.forEach((item, i) => {
            if (i !== 0) {
                const prevValue = items[i - 1].value;
                const percent = Math.round(100 / prevValue * item.value);

                texts.push(
                    <text
                        x={leftSideLength}
                        y={bgPadding + (baseHeight * i) + (baseHeight + innerFontSize - 4) / 2}
                        style={{
                            fontSize: innerFontSize,
                            fontFamily: 'Tahoma'
                        }}
                    >
                        {percent} %
                    </text>
                );
            }
        });

        return texts;
    }

    const renderMainPercent = () => {
        if (items.length === 0 || !items[0].value || !items[items.length - 1].value) return;

        const percent = Math.round(100 / items[0].value * items[items.length - 1].value);
        const text = (
            <text
                x={0}
                y={(bgPadding * 2) + baseHeight * items.length / 2 - 6}
                style={{
                    fontSize: innerFontSize,
                    fontFamily: 'Tahoma'
                }}
            >
                {percent} %
            </text>
        );

        return (
            <>
                <text
                    x={bgPadding}
                    y={(bgPadding * 2) + baseHeight * items.length / 2 - 6}
                    style={{
                        fontSize: innerFontSize,
                        fontFamily: 'Tahoma'
                    }}
                >
                    {percent} %
                </text>

                <polyline points="50 0, 0 0, 0 300, 50 300" stroke="black" fill="none"/>
            </>
        );
    }

    return (
        <div id="funnel-svg">
            <svg height={(bgPadding * 2) + baseHeight * items.length}
                 width={leftSideLength + (baseWidth + (bgPadding * 2)) + 220} className="funnel-canvas" id="funnel-svg">
                {createPolygon()}
                {createInnerText()}
                {renderOutsideText()}
                {renderPercents()}
                {renderMainPercent()}
            </svg>
        </div>
    );
}

export default SvgFunnel;