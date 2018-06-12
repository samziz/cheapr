const axios = require('axios');
const axiosConfig = require('../config/axios.config');


class Skyscanner {
			
	// TODO: Unfinished example implementation

	
	constructor(token) {
		this.axios = axios.create(axiosConfig(token));
	}

	findCheaperDatesForRoute(orig, dest, start, end) {		
		const query = this._formatUrlQuery(['gbp', 'uk', orig, dest, start, end]);

		this.axios
			.get(`browsedates/v1.0/${queryString}`)
			.then(data => {

			});
	}


	/* Private-style funcs */

	_formatUrlQuery(arr) {
		return arr.join('/');
	}
}

module.exports = Skyscanner;