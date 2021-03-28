import { Button } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFilter } from 'store/reducer';
import { selectPemanentFilter } from 'store/selector/entrys';
import { FilterComponent } from './FilterComponent';
import style from './index.module.css'

export const FiltersPage = () => {
    const dispatch = useDispatch();
    const filters = useSelector(selectPemanentFilter);
    return (
        <div>
            <div className={style.cardsContainer}>
                {filters.map((filter, idx) => <FilterComponent index={idx} key={idx} filter={filter} />)}
            </div>
            <Button onClick={() => dispatch(addFilter({}))} variant='contained' color='primary' >
                Add Filter
            </Button>
        </div>
    )
};
