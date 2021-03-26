import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFiles } from 'store/selector/entrys';
import { FileUploader } from './FileUploader';

export const Files = () => {
    const files = useSelector(selectFiles);
    return <div>
        {files.map(file => (
            <div key={file.name}>
                {file.name}
            </div>
        ))}
        <FileUploader />
    </div>
};
