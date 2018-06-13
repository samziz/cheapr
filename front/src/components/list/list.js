import { connect } from 'react-redux';
import Item from './item/item';
import './list.css';
import React from 'react';

class List extends React.PureComponent {

	render() {
		const { cities } = this.props;

		return (
			<div className='list-box-container'>
				{cities && this.makeList(cities)}
				<div className='list-box-list-button-container'>
					<button className='list-box-list-button' disabled={cities.length === 0}>
						Find route
					</button>
				</div>
			</div>
		)
	}

	makeList(cities) {
		const items = cities.map(city => (
			<Item city={city} onChange={val => this.props.setDays(city.title, val)} />
		));

		return (
			<div className='list-box-list-container'>
				{items}
				
			</div>
		)
	}

}

const mapStateToProps = state => ({
	cities: state.cities,
	updated: new Date()
});

export default connect(mapStateToProps)(List);