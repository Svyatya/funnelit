import x                              from 'dom-to-image';
import React, { useEffect, useState } from 'react';
import DataTable                      from './DataTable';
import { Funnel, FunnelElement }      from './funnel.d';
import CanvasFunnel                   from './CanvasFunnel';
import { FormSlider } from '../components';
import { Input, Slider } from 'antd';

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
    const [itemColor, setItemColor] = useState('#fee600');
    const [bgColor, setBgColor] = useState('transparent');
    const [bgPadding, setBgPadding] = useState(16);
    const [marginBetween, setMargin] = useState(0);
    const [innerFontSize, setInnerFontSize] = useState(20);
    const [title, setTitle] = useState('Посетители за неделю');
    const [funnelElements, setFunnelElements] = useState();
    let colorTimer = -1;

    const baseX = bgPadding + 80;
    const baseY = bgPadding + (title ? innerFontSize + bgPadding : 0);
    const minusWidth = (baseWidth - lastWidth) / (funnel.length + 2);

    useEffect(() => {
        transform();
    }, [funnel, value, baseWidth, lastWidth, baseHeight, itemColor, bgColor, bgPadding, marginBetween, innerFontSize, title]);

    function transform() {
        let items: FunnelElement[] = [];

        funnel.forEach((item, i) => {
            items.push({
                value: item.value,
                label: item.label,
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
            itemColor,
            marginBetween,
            lastWidth,
            innerFontSize,
            title,
            baseX,
            baseY
        }
    }

    const handleColorChange = (color: string, setColor: Function) => {
        clearTimeout(colorTimer);
        colorTimer = window.setTimeout(() => setColor(color), 20);
    }

    return (
        <div className="funnel__wrapper">
            <div className="funnel__settings">
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

                <div className="form__group">
                    <label className="label">
                        Внутренние отступы
                    </label>
                    <Slider
                        value={bgPadding}
                        onChange={(value: number) => setBgPadding(value)}
                        max={100}
                        min={0}
                    />
                </div>

                <div className="form__group" >
                    <label className="label" >
                        Отступы между элементами
                    </label>
                    <Slider
                        value={marginBetween}
                        onChange={(value: number) => setMargin(value)}
                        max={100}
                        min={0}
                    />
                </div>

                <div className="form__group">
                    <label className="label">
                        Размер текста в элементах
                    </label>
                    <Slider
                        value={innerFontSize}
                        onChange={(value: number) => setInnerFontSize(value)}
                        max={36}
                        min={12}
                    />
                </div>

                <div className="form__group">
                    <label className="label">
                        Ширина первого элемента
                    </label>
                    <Slider
                        value={baseWidth}
                        onChange={(value: number) => setBaseWidth(value)}
                        max={1000}
                        min={100}
                    />
                </div>
                <div className="form__group">
                    <label className="label">
                        Ширина последнего элемента
                    </label>
                    <Slider
                        value={lastWidth}
                        onChange={(value: number) => setLastWidth(value)}
                        max={1000}
                        min={100}
                    />
                </div>

                <div className="form__group">
                    <label className="label">
                        Высота элементов
                    </label>
                    <Slider
                        value={baseHeight}
                        onChange={(value: number) => setBaseHeight(value)}
                        max={150}
                        min={10}
                    />
                </div>

                <div className="form__group">
                    <label className="label">
                        Цвет элементов
                    </label>
                    <input
                        type="color"
                        onChange={(e) => handleColorChange(e.target.value, setItemColor)}
                        value={itemColor}
                    />
                </div>

                <div className="form__group">
                    <label className="label">
                        Цвет фона
                    </label>
                    <input
                        type="color"
                        onChange={(e) => handleColorChange(e.target.value, setBgColor)}
                        value={bgColor}
                    />

                    <button onClick={() => setBgColor('transparent')}>Убрать фон</button>
                </div>
            </div>

            <div className="funnel__inner">
                <div>
                    <input onChange={(e) => setValue(+e.target.value)} type="tel" value={value}/>
                    <button onClick={handleAddValue}>Добавить</button>
                    <button onClick={handleDownload}>Выгрузить</button>
                </div>

                <DataTable items={funnel} onChange={(items) => setFunnel(items)}/>
                <CanvasFunnel items={funnel} style={getStyle()} funnelElements={funnelElements}/>
            </div>
        </div>
    )
}

export default FunnelWrapper;