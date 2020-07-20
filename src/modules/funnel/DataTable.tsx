import React             from 'react';
import { Funnel }        from './funnel.d';
import { Input, Button } from 'antd';

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
        <div className="data-table">
            <table className="table">
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
                            <Input
                                value={item.value}
                                type="number"
                                onChange={(e) => handleValueChange(+e.target.value, i)}
                            />
                        </td>

                        <td>
                            <Input
                                value={item.label}
                                onChange={(e) => handleValueChange(+e.target.value, i)}
                            />
                        </td>

                        <td>
                            <Button
                                onClick={() => handleDelete(i)}
                                danger
                            >
                                Удалить
                            </Button>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;