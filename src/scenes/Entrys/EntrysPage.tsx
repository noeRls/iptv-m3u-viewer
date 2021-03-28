import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectEntry } from 'store/selector/entrys';
import { Entrys } from './Entrys';
import { NavigateBefore, NavigateNext } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import { QuickFilter } from './QuickFilter/QuickFilter';

const MAX_PER_PAGE = 100;

export const EntrysPage = () => {
    const [pageNb, setPageNb] = useState(0);
    const entrys = useSelector(selectEntry);
    const maxPages = Math.floor(entrys.length / MAX_PER_PAGE);
    return (
        <div>
            <QuickFilter />
            <Entrys entrys={entrys.slice(pageNb * MAX_PER_PAGE, pageNb * MAX_PER_PAGE + MAX_PER_PAGE)} />
            <div>
                <IconButton onClick={() => setPageNb(pageNb - 1)} disabled={pageNb === 0}>
                    <NavigateBefore />
                </IconButton>
                <span>
                    {pageNb + 1}/{maxPages + 1}
                </span>
                <IconButton onClick={() => setPageNb(pageNb + 1)} disabled={maxPages === pageNb} >
                    <NavigateNext />
                </IconButton>
            </div>
        </div>
    );
};
