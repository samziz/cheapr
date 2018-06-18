import React from 'react';
import './search.css';

export default function search(props) {
	const { cities } = props;

	return (
		<div className='search-box-container'>
			<div className='search-box-logo-container'>
				<img
					className='search-box-logo'
					draggable={false}
					src='/logo.png'
					alt='cheapr-logo'
				/>
			</div>
			<input 
				className='search-box-bar'
				list='cities'
				placeholder='Add a stop'
				onKeyDown={(ev, val) => {
					if (ev.keyCode === 13) {
						props.onSubmit(ev.target.value);
						ev.target.value = "";
					}
				}}
			/>
			<datalist id='cities'>
				<option value='London' />
				<option value='Paris' />
				<option value='Amsterdam' />
			</datalist>
		</div>
	)
}