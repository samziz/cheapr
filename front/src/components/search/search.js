import React from 'react';
import './search.css';

export default function search(props) {
	const { airports } = props;

	return (
		<div className='search-box-container'>
			<div className='search-box-logo-container'>
				<img
					className='search-box-logo'
					draggable={false}
					src='/logo.png'
				/>
			</div>
			<input 
				className='search-box-bar'
				list='airports'
				placeholder='Add a stop'
			/>
			<datalist id='airports'>
				<option value='London' />
				<option value='Paris' />
				<option value='Amsterdam' />
			</datalist>
		</div>
	)
}