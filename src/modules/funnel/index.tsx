import x                              from 'dom-to-image';
import React, { useEffect, useState } from 'react';
import DataTable                      from './DataTable';
import { Funnel, FunnelElement }      from './funnel.d';
import CanvasFunnel                   from './CanvasFunnel';
import { Input, Slider }              from 'antd';
import { FormSlider, ColorEdit }      from '../components'

const FunnelWrapper = () => {
    const [funnel, setFunnel] = useState<Funnel[]>([
        { value: 3232, label: 'Зашли на сайт' },
        { value: 1244, label: 'Добавили в корзину' },
        { value: 540, label: 'Купили' }
    ]);

    const [value, setValue] = useState(0);
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
    let colorTimer = -1;

    const baseX = bgPadding + 100;
    const baseY = bgPadding + (title ? innerFontSize * 2 : 0);
    const minusWidth = (baseWidth - lastWidth) / (funnel.length + 2);

    useEffect(() => {
        transform();
    }, [funnel, value, baseWidth, lastWidth, baseHeight, itemColor, bgColor, bgPadding, marginBetween, innerFontSize, title]);

    function transform() {
        let items: FunnelElement[] = [];

        funnel.forEach((item, i) => {
            const currentMargin = i * marginBetween;

            items.push({
                value: item.value,
                label: item.label,
                textColor: '#000000',
                bgColor: '#eeeeee',
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

    const handleAddValue = () => {
        if (funnel.length > 0 && funnel[funnel.length - 1].value < value)
            return;

        setFunnel([...funnel, { value: value }]);
        setValue(0);
    }

    const handleDownload = () => {
        const node = document.getElementById('funnel-svg');

        x.toPng(node!)
         .then(function (dataUrl: string) {
             let img = new Image();
             img.src = dataUrl;
             document.body.appendChild(img);
         })
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

    return (
        <div className="funnel__wrapper">
            <div className="funnel__settings">
                {editableElement !== null &&
                <div>123</div>
                }

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
                    clear
                />
            </div>

            <div className="funnel__inner">
                <div>
                    <input onChange={(e) => setValue(+e.target.value)} type="tel" value={value}/>
                    <button onClick={handleAddValue}>Добавить</button>
                    <button onClick={handleDownload}>Выгрузить</button>
                </div>

                <DataTable items={funnel} onChange={(items) => setFunnel(items)}/>
                <CanvasFunnel
                    items={funnel}
                    style={getStyle()}
                    funnelElements={funnelElements}
                    setEditableElement={setEditableElement}
                    editableElement={editableElement}
                />
            </div>
        </div>
    )
}

export default FunnelWrapper;