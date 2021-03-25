import React, { useCallback } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from 'store/selector/app';
import { DisplayIf } from 'comonents/DisplayIf';
import style from './Header.module.css';
import { logout } from 'store/reducer';

export const Header = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const onLogout = useCallback(() => {
        dispatch(logout());
    }, [dispatch]);
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">Heriot Watt calendar exporter</Typography>
                <div className={style.divider} />
                <DisplayIf expr={Boolean(user)}>
                    <Button color="inherit" onClick={onLogout}>
                        Logout
                    </Button>
                </DisplayIf>
            </Toolbar>
        </AppBar>
    );
};
