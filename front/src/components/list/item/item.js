import './item.css';
import React from 'react';

export default props => {
	if (!props.city) return null;

	return (
		<div className='list-box-list-item'>
			<span className='list-box-list-item-span'>
				<h3 className='list-box-list-item-title'>
					{props.city.title}
				</h3>
			</span>

			<input 
				id='numOfDays' 
				type='number'
				placeholder={1}
				onChange={ev => props.onChange(ev.target.value)}
			/>
			<label for='numOfDays'> days</label>

		</div>
	);
}