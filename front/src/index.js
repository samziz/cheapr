import App from './App';
import { Provider } from 'react-redux';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import serviceWorker from './service-worker';
import store from './redux/store';

const Root = () => (
	<Provider store={store}>
		<App />
	</Provider>
);

ReactDOM.render(
	<Root />, 
	document.getElementById('root')
);

serviceWorker();
