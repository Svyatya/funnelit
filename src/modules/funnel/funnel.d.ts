export interface Funnel {
    value: number,
    label?: string
}

interface FunnelProps {
    items: Funnel[],
    style: {
        bgColor: string,
        bgPadding: number,
        baseHeight: number,
        itemColor: string,
        baseWidth: number,
        lastWidth: number,
        marginBetween: number,
        innerFontSize: number
    }
}