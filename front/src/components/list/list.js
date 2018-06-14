import { connect } from 'react-redux';
import Item from './item/item';
import './list.css';
import React from 'react';
import { setStart, setEnd } from '../../redux/actions';

class List extends React.PureComponent {

	render() {
		let { cities, route } = this.props;

		if (route.length === 0) route = false;

		return (
			<div className='list-box-container'>

				{route && this.makeRoute(route, cities)}
				{!route && cities && this.makeList(cities)}

				{route && <h2 className='cost-label'>Total cost: £{route.cost}</h2>}

				<div className='list-box-list-button-container'>

					<div className='list-box-dates-container'>
						<input
							type='date' 
							title='Start date'
							onChange={ev => this.props.setStart(ev.target.value)}
						/>
						<input
							type='date'
							title='End date'
							onChange={ev => this.props.setEnd(ev.target.value)}
						/>
					</div>

					<button 
						className='list-box-list-button' 
						disabled={!cities || cities.length === 0}
						onClick={() => {
							if (!route) this.props.onSubmit();
							else this.props.onClear();
						}}
						style={{ backgroundColor: route ? '#c8c8c8' : '#2d95c9' }}
					>
						{route && 'Clear'}
						{!route && 'Calculate'}
					</button>
				</div>
			</div>
		)
	}

	makeList(cities) {
		const items = cities.map(city => (
			<Item 
				city={city} 
				onChange={val => this.props.setDays(city.title, val)} 
				onRemove={val => this.props.remove(city.title)}
			/>
		));

		return (
			<div className='list-box-list-container'>
				{items}
			</div>
		)
	}

	makeRoute(route, cities) {
		const items = route.route.map(trip => (
			<Item 
				routeItem={true}
				origin={cities.find(city => city.code === trip.trip[0])}
				destination={cities.find(city => city.code === trip.trip[1])}
				date={trip.date}
			/>
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
	route: state.route,
	updated: new Date()
});

const mapDispatchToProps = { setStart, setEnd };

export default connect(mapStateToProps, mapDispatchToProps)(List);