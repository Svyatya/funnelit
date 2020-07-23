import React, { ChangeEvent } from 'react';

interface ChangeData {
    hex: string | null
}

interface Props {
    label: string;
    onChange: (data: ChangeData) => void;
    value: string | null;
    clear?: boolean;
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
            <input
                type="color"
                onChange={handleChange}
                value={value || ''}
            />

            {clear &&
            <button onClick={() => onChange({ hex: null })}>Убрать фон</button>
            }
        </div>
    );
}

export default ColorEdit;