import x                   from 'dom-to-image';
import React, { useState } from 'react';
import DataTable           from './DataTable';
import SvgFunnel           from './SvgFunnel'
import { Funnel }          from './funnel.d'

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
    const [itemColor, setItemColor] = useState('#f28d8d');
    const [bgColor, setBgColor] = useState('transparent');
    const [bgPadding, setBgPadding] = useState(16);
    const [marginBetween, setMargin] = useState(0);
    const [innerFontSize, setInnerFontSize] = useState(20);

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
            innerFontSize
        }
    }

    return (
        <div className="funnel__wrapper">
            <div className="funnel__settings">
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

                <SvgFunnel items={funnel} style={getStyle()}/>
            </div>
        </div>
    )
}

export default FunnelWrapper;