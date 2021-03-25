import React, { useEffect } from 'react';
import { LoginWithGoogle } from './components/LoginWithGoogle';
import { useSelector } from 'react-redux';
import { selectUser } from 'store/selector/app';
import { useHistory } from 'react-router-dom';
import { urls } from 'services/urls';

export const Login = () => {
    const user = useSelector(selectUser);
    const history = useHistory();
    useEffect(() => {
        if (user) {
            history.push(urls.home);
        }
    }, [user, history]);

    return (
        <div>
            <LoginWithGoogle />
        </div>
    );
};
