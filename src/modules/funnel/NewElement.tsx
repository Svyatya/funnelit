import React, { useState } from 'react';
import { Input, Button } from 'antd';

const NewElement = () => {
    const [value, setValue] = useState<number | undefined>();
    return (
        <div>
            <Input
                onChange={(e) => setValue(+e.target.value)}
                type="tel"
                value={value}
            />
            <Button onClick={() => {}}>Добавить</Button>
        </div>
    );
}

export default NewElement;