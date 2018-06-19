const axios = require('axios');
const axiosConfig = require('../config/axios.config');
const moment = require('moment');

class Skyscanner {
			
	constructor(token) {
		this.token = token;
		this.axios = axios.create(axiosConfig(token));
	}

	async getPrices(orig, dest, start, days) {
		const months = this._makePartialDatesList(start);

		let results = await Promise.all(
			months.map(month => new Promise((resolve, reject) => {
				const query = this._formatUrlQuery(['GB', 'gbp', 'en-US', orig, dest, month]);

				this.axios
					.get(`browsedates/v1.0/${query}?apikey=${this.token}`)
					.then(res => {
						const dates = res.data.Dates.OutboundDates;
						resolve(dates);
					})
			})
		));

		// Flatten 2D array of API responses
		results = [].concat(results);
		results = results[0];

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

		for (let i = 0; i < 3; i++) {
			const month = start.format('YYYY-MM');
		   	list.push(month);
		   	start.add(1, 'month');
		}

		return list;
	}
}

module.exports = Skyscanner;