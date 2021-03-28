import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectSnackbar } from 'store/selector/app';
import { Alert } from '@material-ui/lab';
import { snackbarVisibillityChanged } from 'store/reducer';
import { Snackbar as MaterialUiSnackbar } from '@material-ui/core';

export const Snackbar = () => {
    const { open, message, severity } = useSelector(selectSnackbar);
    const dispatch = useDispatch();
    const onClose = useCallback(() => {
        dispatch(snackbarVisibillityChanged(false));
    }, [dispatch]);
    return (
        <MaterialUiSnackbar open={open} autoHideDuration={6000} onClose={onClose}>
            <Alert onClose={onClose} severity={severity}>
                {message}
            </Alert>
        </MaterialUiSnackbar>
    );
};
