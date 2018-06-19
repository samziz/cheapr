import { connect } from 'react-redux';
import Item from './item/item';
import './list.css';
import { makeCode } from '../../utils';
import React from 'react';
import { setStartDate, setStartMargin } from '../../redux/actions';


class List extends React.PureComponent {

	render() {
		let { cities, route } = this.props;

		if (!route || route.length === 0) route = false;

		return (
			<div className='list-box-container'>

				{route && this.makeRoute(route, cities)}
				{!route && cities && this.makeList(cities)}

				{this.makeSubmitArea(this.props)}
			</div>
		)
	}

	makeList(cities) {
		const items = cities.map(city => (
			<Item 
				city={city} 
				onChange={opts => this.props.update(city.name, opts)} 
				onRemove={val => this.props.remove(city.name)}
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
				origin={cities.find(city => makeCode(city) === trip.trip[0])}
				destination={cities.find(city => makeCode(city) === trip.trip[1])}
				date={trip.date}
			/>
		));

		return (
			<div className='list-box-list-container'>
				{items}
				<h2 className='cost-label'>Total cost: £{route.cost}</h2>
			</div>
		)
	}

	makeSubmitArea(props) {
		let { cities, route } = props;
		if (!route || route.length === 0) route = false;

		return (
			<div className='list-box-list-button-container'>
				<div className='list-box-options-container'>

					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<div className='date-input date'>
							<label>Leaving on:</label>
							<input
								type='date' 
								title='Start date'
								onChange={ev => this.props.setStartMargin(ev.target.value)}
							/>
						</div>
						<div className='date-input margin'>
							<label>Give or take:</label>
							<input
								type='number'
								placeholder={0}
								min={0}
								max={20}
								onChange={ev => this.props.setStartDate(ev.target.value)}
							/>
							<p className='date-input margin-text'>
								days
							</p>
						</div>
					</div>

					<label>I want to depart from:</label>
					<select>
					  <option value={undefined}>No preference</option>
					  {cities.map(city => <option value={city.name}>{city.name}</option>)}
					</select>

					<label>I want to return to:</label>
					<select>
					  <option value={undefined}>No preference</option>
					  {cities.map(city => <option value={city.name}>{city.name}</option>)}
					</select>
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
		)
	}

}

const mapStateToProps = state => ({
	cities: state.cities,
	route: state.route,
	updated: new Date()
});

const mapDispatchToProps = { setStartDate, setStartMargin };

export default connect(mapStateToProps, mapDispatchToProps)(List);