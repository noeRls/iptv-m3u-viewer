import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCalendars } from 'store/selector/app';
import { fetchCalendar, selectedCalendarChanged } from 'store/reducer';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { Calendar } from 'types';

export const GoogleCalendarPicker = () => {
    const dispatch = useDispatch();
    const calendars = useSelector(selectCalendars);
    useEffect(() => {
        dispatch(fetchCalendar());
    }, [dispatch]);

    const onChange = useCallback(
        (calendar: Calendar | null) => {
            dispatch(selectedCalendarChanged(calendar?.id));
        },
        [dispatch],
    );
    return (
        <Autocomplete
            loading={calendars.length === 0}
            options={Object.values(calendars)}
            onChange={(_, value) => onChange(value)}
            getOptionLabel={(option) => option.summary || 'unkown'}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Calendar" placeholder="Select your calendar" />
            )}
        />
    );
};
