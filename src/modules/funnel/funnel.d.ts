export interface Funnel {
    value: number,
    label?: string
}

export interface Point {
    x: number,
    y: number
}

export interface FunnelElement extends Funnel {
    [key: string],
    bgColor?: string,
    textColor?: string,
    labelColor?: string,
    point1: Point,
    point2: Point,
    point3: Point,
    point4: Point,
}

interface FunnelProps {
    items: Funnel[],
    style: {
        bgColor: string | null,
        bgPadding: number,
        baseHeight: number,
        itemColor: string,
        baseWidth: number,
        lastWidth: number,
        marginBetween: number,
        innerFontSize: number,
        title: string,
        baseX: number,
        baseY: number
    },
    funnelElements: FunnelElement[],
    setEditableElement: (i: number | null) => void,
    editableElement: number | null
}