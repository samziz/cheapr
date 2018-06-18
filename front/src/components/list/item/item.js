import './item.css';
import React from 'react';

export default props => {
	function makeItem(props) {
		return (
			<div className='list-box-list-item'>
				<span className='list-box-list-item-span'>
					<h3 className='list-box-list-item-title'>
						{props.city.title}
					</h3>
				</span>

				<p 
					className='list-box-list-item-remove' 
					onClick={props.onRemove}
				>
					&#215;
				</p>

				<div style={{ marginTop: '10px' }}>
					<input 
						id='numOfDays' 
						type='number'
						placeholder={1}
						min={1}
						onChange={ev => props.onChange({ days: ev.target.value })}
					/>
					<label>days, give or take</label>
					<input
						id='giveOrTake' 
						type='number'
						placeholder={0}
						min={0}
						onChange={ev => props.onChange({ giveOrTake: ev.target.value })}
					/>
				</div>
			</div>
		)
	}

	function makeRouteItem(props) {
		return (
			<div className='list-box-list-item'>
				<h3 className='list-box-list-item-title'>
					{props.origin.title} to {props.destination.title}
				</h3>
				<p>
					{props.date}
				</p>
			</div>
		)
	}

	if (props.routeItem) return makeRouteItem(props);
	else return makeItem(props);
}