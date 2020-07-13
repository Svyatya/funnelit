import React      from 'react';
import { Funnel, FunnelProps } from './funnel.d';



const DomFunnel = ({ items, style: { baseHeight, bgPadding, bgColor, itemColor, baseWidth } }: FunnelProps) => {
    const calculateWidth = (width: number): number => {
        if (items.length <= 1) return baseWidth;

        const firstValue = items[0].value;
        const result = baseWidth / firstValue * width;

        return result;
    }

    return (
        <div
            className="funnel"
            id="funnel"
            style={{
                ...(bgColor && { background: bgColor }),
                ...(bgPadding && { padding: bgPadding }),
            }}
        >
            {items.map(item =>
                <div
                    key={item.value}
                    className="funnel__item"
                    style={{
                        width: calculateWidth(item.value),
                        height: baseHeight,
                        background: itemColor
                    }}
                >{item.value}</div>
            )}
        </div>
    );
}

export default DomFunnel;