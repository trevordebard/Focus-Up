import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Blacklist from './components/Blacklist';
import Home from './components/Home';
import routes from './constants/routes';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path={routes.BLACKLIST} component={Blacklist} />
                <Route path={routes.HOME} component={Home} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
