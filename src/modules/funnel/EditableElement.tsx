import React, { ChangeEvent } from 'react';
import { ColorEdit }          from '../components';
import { FunnelElement }      from './funnel';


const EditableElement = (item: FunnelElement, index: number) => {

    return (
        <>
            <h2>
                Настройки элемента
            </h2>

            <ColorEdit
                label={'Цвет элемента'}
                onChange={() => {}}
                value={item.bgColor || null}
            />

            <ColorEdit
                label={'Цвет текста'}
                onChange={() => {}}
                value={item.textColor || null}
            />
        </>
    );
}

export default EditableElement;