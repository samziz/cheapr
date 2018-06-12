import { connect } from 'react-redux';
import Item from './item/item';
import './list.css';
import React from 'react';

class List extends React.PureComponent {

	render() {
		const { airports } = this.props;

		return (
			<div className='list-box-container'>
				{airports && this.makeList(airports)}
				{!airports && this.makeEmptyMessage()}
			</div>
		)
	}

	makeList(airports) {
		const items = airports.map(airport => (
			<Item airport={airport} />
		));

		return (
			<div className='list-box-list-container'>
				{items}
				<button className='list-box-list-button'>
					Find route
				</button>
			</div>
		)
	}

	makeEmptyMessage() {
		return (
			<div className='list-box-empty-msg-container'>
				<h3 className='list-box-empty-msg-header'>
					It looks like you haven't selected anything.
				</h3>
			</div>
		)
	}
}

const mapStateToProps = state => ({
	airports: state.airports,
	updated: new Date()
});

export default connect(mapStateToProps)(List);