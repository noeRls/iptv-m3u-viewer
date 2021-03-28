import React from 'react';
import { Route } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { selectAppIsLoaded } from 'store/selector/app';

function PrivateRoute({ ...other }) {
    const loaded = useSelector(selectAppIsLoaded);

    if (!loaded) {
        return <CircularProgress />;
    }

    return <Route {...other} />;
}

export default PrivateRoute;
