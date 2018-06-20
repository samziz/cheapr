import { connect } from 'react-redux';
import { getCityByCode } from '../../utils';
import { GoogleMap, Marker, Polyline, withScriptjs, withGoogleMap } from 'react-google-maps';
import './map.css';
import React from 'react';

const Map = withScriptjs(withGoogleMap(props => 
	<GoogleMap
		defaultZoom={5}
		defaultCenter={{ lat: 51.526, lng: -0.075 }}
	>
		{props.markers}
		{props.route}
	</GoogleMap>
))

class MapContainer extends React.PureComponent {

	render() {
		let { cities, route } = this.props;

		if (route.length === 0) route = false;
		
		return (
			<div className='map-box-container'>
				<Map
					loadingElement={<div className='g-map-container' />}
  					containerElement={<div className='g-map-container' />}
  					mapElement={<div className='g-map-container' />}
  					googleMapURL={window.googleMapURL}
  					markers={this.makeMarkers(cities)}
  					route={this.makeRoute(route, cities)}
  				/>
			</div>
		)
	}

	makeMarkers(cities) {
		if (!cities) return null;
		return cities.map((city, i) => (
			<Marker 
				key={i} 
				position={city.location} 
			/>
		))
	}

	makeRoute(route, cities) {
		if (!route) return null;

		let path = route.route
			.map(flight => cities.find(city => city.name === flight.trip[0]).location);

		// Add destination of last trip to path
		const destination = route.route[route.route.length-1].trip[1];
		path.push(cities.find(city => city.name === destination).location);

		return <Polyline 
			path={path} 
			options={{ strokeColor: 'rgb(0, 194, 226)' }} 
		/>
	}
}

const mapStateToProps = state => ({
	cities: state.cities,
	route: state.route,
	updated: new Date()
});

export default connect(mapStateToProps)(MapContainer);