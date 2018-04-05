import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Home} from "./home";

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing
    // configuration and injects the app into a DOM element.

    ReactDOM.render(
            <Home />,
        document.getElementById('react-app')
    );
}

renderApp();