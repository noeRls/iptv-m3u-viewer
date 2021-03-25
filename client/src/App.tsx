import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from './store/reducer';
import { Layout } from './comonents/Layout/Layout';
import { Switch, Route } from 'react-router-dom';
import { urls } from 'services/urls';
import PrivateRoute from 'comonents/PrivateRoute';
import { Home } from 'scenes/Home/Home';
import { Login } from 'scenes/Login/Login';

function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);

    return (
        <Layout>
            <Switch>
                <Route exact path={urls.login} component={Login} />
                <PrivateRoute path={urls.home} component={Home} />
            </Switch>
        </Layout>
    );
}

export default App;
