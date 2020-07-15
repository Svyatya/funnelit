import React      from 'react';
import { Funnel } from './funnel.d';

interface Props {
    onChange: (items: Funnel[]) => void,
    items: Funnel[]
}

const DataTable = ({ items, onChange }: Props) => {
    const handleLabelChange = (value: string, i: number) => {
        const newItems = [...items];
        newItems[i].label = value;
        onChange(newItems);
    }

    const handleValueChange = (value: number, i: number) => {
        const newItems = [...items];
        newItems[i].value = value;
        onChange(newItems);
    }

    const handleDelete = (i: number) => {
        const newItems = [...items];
        newItems.splice(i, 1);
        onChange(newItems);
    }

    return (
        <table>
            <thead>
            <tr>
                <th>
                    Значение
                </th>
                <th>
                    Лэйбл
                </th>
            </tr>
            </thead>
            <tbody>
            {items.map((item, i) =>
               <tr key={i}>
                   <td>
                       <input value={item.value} type="number"  onChange={(e) => handleValueChange(+e.target.value, i)}/>
                   </td>

                   <td>
                       <input value={item.label} onChange={(e) => handleLabelChange(e.target.value, i)}/>
                   </td>

                   <td>
                       <button onClick={() => handleDelete(i)}>Удалить</button>
                   </td>
               </tr>
            )}
            </tbody>
        </table>
    );
}

export default DataTable;