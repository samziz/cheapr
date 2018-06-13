import { connect } from 'react-redux';
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
		const { cities, route } = this.props;

		const googleMapURL = "https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places?key="
		 + process.env.REACT_APP_GMAPS_KEY;

		return (
			<div className='map-box-container'>
				<Map
					loadingElement={<div className='g-map-container' />}
  					containerElement={<div className='g-map-container' />}
  					mapElement={<div className='g-map-container' />}
  					googleMapURL={googleMapURL}
  					markers={this.makeMarkers(cities)}
  					route={this.makeRoute(route)}
  				/>
			</div>
		)
	}

	makeMarkers(cities) {
		if (!cities) return null;
		return cities.map((city, i) => (
			<Marker key={i} position={city.location} />
		))
	}

	makeRoute(route) {
		if (!route) return null;

		return <Polyline opts={route.path} />
	}
}

const mapStateToProps = state => ({
	cities: state.cities,
	route: state.route,
	updated: new Date()
});

export default connect(mapStateToProps)(MapContainer);