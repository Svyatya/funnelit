import x                              from 'dom-to-image';
import React, { useEffect, useState } from 'react';
import DataTable                      from './DataTable';
import SvgFunnel                 from './SvgFunnel'
import { Funnel, FunnelElement } from './funnel.d';
import CanvasFunnel              from './CanvasFunnel';

const FunnelWrapper = () => {
    const [funnel, setFunnel] = useState<Funnel[]>([
        { value: 3720, label: 'Увидели форму' },
        { value: 772, label: 'Подтвердили телефон' },
        { value: 644, label: 'Заполнили 50%'},
        { value: 476, label: 'Дошли до конца' }
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

    const baseX = bgPadding + 80;
    const baseY = bgPadding + (title ? innerFontSize + bgPadding : 0);
    const minusWidth = (baseWidth - lastWidth) / (funnel.length + 2);

    useEffect(() => {
        transform();
    }, [funnel, value, baseWidth, lastWidth, baseHeight, itemColor, bgColor, bgPadding, marginBetween, innerFontSize, title]);

    function transform () {
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

    return (
        <div className="funnel__wrapper">
            <div className="funnel__settings">
                <div>
                    <label>
                        Заголовок
                    </label>
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                </div>

                <div>
                    <label>
                        Цвет фона
                    </label>
                    <input
                        type="color"
                        onChange={(e) => setBgColor(e.target.value)}
                        value={bgColor}
                    />

                    <button onClick={() => setBgColor('transparent')}>Убрать фон</button>
                </div>

                <div>
                    <label>
                        Отступы от элементов
                    </label>
                    <input
                        value={bgPadding}
                        onChange={(e) => setBgPadding(Number(e.target.value))}
                        type="range"
                        max="100"
                        min="0"
                    />
                </div>

                <div>
                    <label>
                        Отступы между элементами
                    </label>
                    <input
                        value={marginBetween}
                        onChange={(e) => setMargin(Number(e.target.value))}
                        type="range"
                        max="100"
                        min="0"
                    />
                </div>

                <div>
                    <label>
                        Размер текста в элементах
                    </label>
                    <input
                        value={innerFontSize}
                        onChange={(e) => setInnerFontSize(Number(e.target.value))}
                        type="range"
                        max="36"
                        min="12"
                    />
                </div>


                <div>
                    <label>
                        Цвет элементов
                    </label>
                    <input
                        type="color"
                        onChange={(e) => setItemColor(e.target.value)}
                        value={itemColor}
                    />
                </div>
                <div>
                    <label>
                        Ширина первого элемента
                    </label>
                    <input
                        value={baseWidth}
                        onChange={(e) => setBaseWidth(Number(e.target.value))}
                        type="range"
                        max="1000"
                        min="100"
                    />
                </div>
                <div>
                    <label>
                        Ширина последнего элемента
                    </label>
                    <input
                        value={lastWidth}
                        onChange={(e) => setLastWidth(Number(e.target.value))}
                        type="range"
                        max="1000"
                        min="100"
                    />
                </div>
                <div>
                    <label>
                        Высота элементов
                    </label>
                    <input value={baseHeight} onChange={(e) => setBaseHeight(Number(e.target.value))} type="range"/>
                </div>
            </div>

            <div className="funnel__inner">
                <div className="funnel__settings">
                    <input onChange={(e) => setValue(+e.target.value)} type="tel" value={value}/>
                    <button onClick={handleAddValue}>Добавить</button>
                    <button onClick={handleDownload}>Выгрузить</button>
                </div>

                <DataTable items={funnel} onChange={(items) => setFunnel(items)}/>

                <CanvasFunnel items={funnel} style={getStyle()} funnelElements={funnelElements} />

                {/*<SvgFunnel items={funnel} style={getStyle()}/>*/}
            </div>
        </div>
    )
}

export default FunnelWrapper;