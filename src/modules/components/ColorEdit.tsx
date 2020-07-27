import React, { ChangeEvent } from 'react';
import { Button } from 'antd';

interface ChangeData {
    hex: string | null
}

interface Props {
    label: string;
    onChange: (data: ChangeData) => void;
    value: string | null;
    clear?: string;
}

const ColorEdit = ({ label, onChange, value, clear }: Props) => {
    let timer = -1;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timer);
        const color = e.target.value;
        timer = window.setTimeout(
            () => onChange({ hex: color }),
            20
        );
    }

    return (
        <div className="form__group">
            <label className="label">
                {label}
            </label>

            <div className="form__color">

                <input
                    type="color"
                    onChange={handleChange}
                    value={value || ''}
                />
                <span className="form__color__value">
                    {value}
                </span>

                {clear &&
                <Button onClick={() => onChange({ hex: null })}>{clear}</Button>
                }
            </div>
        </div>
    );
}

export default ColorEdit;