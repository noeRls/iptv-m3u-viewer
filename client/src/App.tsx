import React, { useEffect } from 'react';
import { Layout } from './comonents/Layout/Layout';
import { Switch, Route } from 'react-router-dom';
import { urls } from 'services/urls';
import { Home } from 'scenes/Home/Home';
import { Files } from 'scenes/Files/Files';
import { useDispatch, useSelector } from 'react-redux';
import { selectAppIsLoaded } from 'store/selector/app';
import { loadApp } from 'store/reducer';
import PrivateRoute from 'comonents/PrivateRoute';

function App() {
    const loaded = useSelector(selectAppIsLoaded);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!loaded) {
            dispatch(loadApp());
        }
    }, [loaded]);
    return (
        <Layout>
            <Switch>
                <PrivateRoute path={urls.files} component={Files} />
                <PrivateRoute path={urls.home} component={Home} />
            </Switch>
        </Layout>
    );
}

export default App;
