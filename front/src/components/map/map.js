import { GoogleMap, Marker, withScriptjs, withGoogleMap } from "react-google-maps"
import React from 'react';
import './map.css';

const Map = withScriptjs(withGoogleMap(props => 
	<GoogleMap
		defaultZoom={5}
		defaultCenter={{ lat: 51.526, lng: -0.075 }}
	>
		{props.markers}
	</GoogleMap>
))

export default class MapContainer extends React.PureComponent {

	render() {
		return (
			<div className='map-box-container'>
				<Map
					loadingElement={<div className='g-map-container' />}
  					containerElement={<div className='g-map-container' />}
  					mapElement={<div className='g-map-container' />}
  					googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
  				/>
			</div>
		)
	}
}