import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectEntry } from 'store/selector/entrys';
import { Entrys } from './Entrys';

const MAX_PER_PAGE = 100;

export const EntrysPage = () => {
    const [pageNb, setPageNb] = useState(0);
    const entrys = useSelector(selectEntry);
    return (
        <div>
            <Entrys entrys={entrys.slice(pageNb, pageNb + MAX_PER_PAGE)} />
        </div>
    );
};
