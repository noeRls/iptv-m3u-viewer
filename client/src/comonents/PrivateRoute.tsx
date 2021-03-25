import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { urls } from 'services/urls';
import { selectUser, selectAppIsLoaded } from 'store/selector/app';

function PrivateRoute({ ...other }) {
    const user = useSelector(selectUser);
    const loaded = useSelector(selectAppIsLoaded);

    if (!loaded) {
        return <CircularProgress />;
    }

    if (!user) {
        return <Redirect to={urls.login} />;
    }
    return <Route {...other} />;
}

export default PrivateRoute;
