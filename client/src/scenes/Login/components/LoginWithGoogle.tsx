import React, { useCallback } from 'react';
import GoogleButton from 'react-google-button';
import { useSelector } from 'react-redux';
import { selectAppIsLoaded, selectUser } from '../../../store/selector/app';
import style from './LoginWithGoogle.module.css';

export const LoginWithGoogle = () => {
    const isLoaded = useSelector(selectAppIsLoaded);
    const user = useSelector(selectUser);

    const onClick = useCallback(() => {
        window.open(`${process.env.REACT_APP_API_URL}/auth/google`, '_self');
    }, []);

    return (
        <div className={style.container}>
            <div className={style.button}>
                <GoogleButton disabled={!isLoaded || Boolean(user)} onClick={onClick} />
            </div>
        </div>
    );
};
