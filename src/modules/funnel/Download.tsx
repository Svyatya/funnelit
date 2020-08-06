import { Button, Input }   from 'antd';
import x                   from 'dom-to-image';
import React, { useState } from 'react';

const Download = () => {
    const [name, setName] = useState('funnel');

    const handleDownload = () => {
        const node = document.getElementById('funnelCanvas');

        x.toPng(node!)
         .then(function (dataUrl: string) {
             let a = document.createElement('a');
             a.href = dataUrl;
             a.download = `${name}.png`;
             a.click()
         });
    }

    return (
        <div className="download-funnel">
            <Button onClick={handleDownload}>
                Скачать
            </Button>
            <Input
                onChange={(e) => setName(e.target.value)}
                value={name}
            />
        </div>
    );
}

export default Download;