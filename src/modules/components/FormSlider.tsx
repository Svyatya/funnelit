import { Slider, Row, Col, Input } from 'antd';
import React, { ChangeEvent }                   from 'react';

interface Props {
    max: number;
    min: number;
    value: number;
    label: string;
    onChange: (value: number) => void
}

const FormSlider = ({ max, min, value, label, onChange}: Props) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (isNaN(+e.target.value)) return;

        onChange(+e.target.value);
    }

    return (
        <div className="form__group">
            <label className="label">
                {label}
            </label>

            <Row>
                <Col span={20}>
                    <Slider
                        value={value}
                        onChange={(value: number) => onChange(value)}
                        max={max}
                        min={min}
                    />
                </Col>
                <Col span={4}>
                    <Input
                        min={min}
                        max={max}
                        value={value}
                        onChange={handleInputChange}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default FormSlider;