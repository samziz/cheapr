const axios = require('axios');
const axiosConfig = require('../config/axios.config');
const moment = require('moment');

class Skyscanner {
			
	constructor(token) {
		this.token = token;
		this.axios = axios.create(axiosConfig(token));
	}

	async getPrices(orig, dest, start, end) {
		const months = this._makePartialDatesList(start, end);

		let results = await Promise.all(months.map(month => new Promise((resolve, reject) => {
			const query = this._formatUrlQuery(['GB', 'gbp', 'en-US', orig, dest, month]);

			this.axios
				.get(`browsedates/v1.0/${query}?apikey=${this.token}`)
				.then(res => {
					const dates = res.data.Dates.OutboundDates;
					resolve(dates);
				})
				.catch(err => console.log(err));
		})));

		// Flatten 2D array of API responses
		results = [].concat(results);
		results = results[0];

		results = this._stripBadDates(results, start, end);

		return results;
	}


	/* Private-style funcs */

	_formatUrlQuery(arr) {
		return arr.join('/');
	}

	_makePartialDatesList(startDate, endDate) {
		// Convert start and end into Skyscanner single-date YYYY-MM format
		let list = [];

		const start = moment(startDate);
		const end = moment(endDate);

		for (start; !(moment(start).subtract(1, 'months').isSame(end, 'month')); start.add(1, 'month')) {
			const month = start.format('YYYY-MM');
		   	list.push(month);
		}

		return list;
	}

	_stripBadDates(list, startDate, endDate) {
		return list
			.filter(item => {
				return moment(item.PartialDate, 'YYYY-MM-DD').isBetween(startDate, endDate);
			})
	}
}

module.exports = Skyscanner;