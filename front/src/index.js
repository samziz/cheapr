import App from './App';
import { Provider } from 'react-redux';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import serviceWorker from './service-worker';
import store from './redux/store';

window.googleMapURL = "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=" + process.env.REACT_APP_GMAPS_KEY;

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
