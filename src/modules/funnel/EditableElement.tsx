import React, { ChangeEvent } from 'react';
import { ColorEdit }          from '../components';
import { FunnelElement }      from './funnel';

interface Props {
    item?: FunnelElement,
    index?: number,
    onChange: (element: FunnelElement, index: number) => void
}

const EditableElement = ({item, index, onChange}: Props) => {
    if (!item) return null;

    const colorChange = ({color, field}: {color: string | null, field: string}) => {
        console.log(color);
        const newItem: FunnelElement = {...item};
        newItem[field] = color;

        onChange(newItem, index!);
    }

    return (
        <>
            <h2>
                Настройки элемента
            </h2>

            <ColorEdit
                label={'Цвет элемента'}
                onChange={(data) => colorChange({color: data.hex, field: 'bgColor'})}
                value={item.bgColor || null}
                clear="Сбросить"
            />

            <ColorEdit
                label={'Цвет текста'}
                onChange={(data) => colorChange({color: data.hex, field: 'textColor'})}
                value={item.textColor || null}
                clear="Сбросить"
            />
        </>
    );
}

export default EditableElement;