import './list.css';
import React from 'react';

export default class List extends React.PureComponent {

	render() {
		const { stops } = this.props;

		return (
			<div className='list-box-container'>
				{!stops && this.makeEmptyMessage()}
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