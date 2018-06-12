import './item.css';
import React from 'react';

export default props => {
	if (!props.airport) return null;

	return (
		<div className='list-box-list-item'>
			<h3 className='list-box-list-item-title'>
				{props.airport}
			</h3>
		</div>
	);
}