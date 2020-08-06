import { Input }                      from 'antd';
import React, { useEffect, useState } from 'react';
import { ColorEdit, FormSlider }      from '../components';
import CanvasFunnel                   from './CanvasFunnel';
import DataTable                      from './DataTable';
import Download                       from './Download';
import EditableElement                from './EditableElement';
import { Funnel, FunnelElement }      from './funnel.d';

const FunnelWrapper = () => {
    const [funnel, setFunnel] = useState<Funnel[]>([
        { value: 3232, label: 'Зашли на сайт' },
        { value: 1244, label: 'Добавили в корзину' },
        { value: 540, label: 'Купили' }
    ]);

    const [baseWidth, setBaseWidth] = useState(500);
    const [lastWidth, setLastWidth] = useState(250);
    const [baseHeight, setBaseHeight] = useState(60);
    const [itemColor, setItemColor] = useState<null | string>('#fee600');
    const [bgColor, setBgColor] = useState<null | string>(null);
    const [bgPadding, setBgPadding] = useState(16);
    const [marginBetween, setMargin] = useState(0);
    const [innerFontSize, setInnerFontSize] = useState(20);
    const [title, setTitle] = useState('Посетители за неделю');
    const [funnelElements, setFunnelElements] = useState();
    const [editableElement, setEditableElement] = useState<number | null>(null);

    const baseX = bgPadding + 100;
    const baseY = bgPadding + (title ? innerFontSize * 2 : 0);
    const minusWidth = (baseWidth - lastWidth) / (funnel.length + 2);

    useEffect(() => {
        transform();
    }, [funnel, baseWidth, lastWidth, baseHeight, itemColor, bgColor, bgPadding, marginBetween, innerFontSize, title]); // eslint-disable-line react-hooks/exhaustive-deps

    function transform() {
        let items: FunnelElement[] = [];

        funnel.forEach((item, i) => {
            const currentMargin = i * marginBetween;

            items.push({
                value: item.value,
                label: item.label,
                point1: {
                    x: baseX + (minusWidth * i) + currentMargin / 2,
                    y: baseY + i * baseHeight + currentMargin
                },
                point2: {
                    x: baseX + (baseWidth - (minusWidth * i)) - currentMargin / 2,
                    y: baseY + i * baseHeight + currentMargin
                },
                point3: {
                    x: baseX + (baseWidth - (minusWidth * (i + 1))) - currentMargin / 2,
                    y: baseY + baseHeight + i * baseHeight + currentMargin
                },
                point4: {
                    x: baseX + (minusWidth * (i + 1)) + currentMargin / 2,
                    y: baseY + baseHeight + i * baseHeight + currentMargin
                }
            });
        });

        setFunnelElements(items);
    }

    const getStyle = () => {
        return {
            baseHeight,
            baseWidth,
            bgPadding,
            bgColor,
            itemColor: itemColor!,
            marginBetween,
            lastWidth,
            innerFontSize,
            title,
            baseX,
            baseY
        }
    }

    const handleUpdateElement = (element: FunnelElement, index: number) => {
        const elements = [...funnelElements];
        elements[index] = element;
        setFunnelElements(elements);
    }

    return (
        <div className="funnel__wrapper">
            <div className="funnel__settings">
                {(editableElement !== null) &&
                <EditableElement
                    index={editableElement}
                    item={funnelElements[editableElement]}
                    onChange={handleUpdateElement}
                />
                }

                <h2>
                    Настройки воронки
                </h2>

                <div className="form__group">
                    <label className="label">
                        Заголовок
                    </label>
                    <Input
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        placeholder="Заголовок"
                    />
                </div>

                <FormSlider
                    max={100}
                    min={0}
                    value={bgPadding}
                    label={'Внутренние отступы'}
                    onChange={setBgPadding}
                />
                <FormSlider
                    max={100}
                    min={0}
                    value={marginBetween}
                    label={'Отступы между элементами'}
                    onChange={setMargin}
                />
                <FormSlider
                    max={36}
                    min={12}
                    value={innerFontSize}
                    label={'Размер текста в элементах'}
                    onChange={setInnerFontSize}
                />
                <FormSlider
                    max={1000}
                    min={100}
                    value={baseWidth}
                    label={'Ширина первого элемента'}
                    onChange={setBaseWidth}
                />
                <FormSlider
                    max={1000}
                    min={100}
                    value={lastWidth}
                    label={'Ширина последнего элемента'}
                    onChange={setLastWidth}
                />
                <FormSlider
                    max={150}
                    min={10}
                    value={baseHeight}
                    label={'Высота элементов'}
                    onChange={setBaseHeight}
                />

                <ColorEdit
                    label={'Базовый цвет элементов'}
                    value={itemColor}
                    onChange={(data) => setItemColor(data.hex)}
                />

                <ColorEdit
                    label={'Цвет фона'}
                    value={bgColor}
                    onChange={(data) => setBgColor(data.hex)}
                    clear="Убрать фон"
                />
            </div>

            <div className="funnel__inner">
                <DataTable
                    items={funnel}
                    onChange={(items) => setFunnel(items)}
                />

                <CanvasFunnel
                    items={funnel}
                    style={getStyle()}
                    funnelElements={funnelElements}
                    setEditableElement={setEditableElement}
                    editableElement={editableElement}
                />

                <Download/>
            </div>
        </div>
    )
}

export default FunnelWrapper;