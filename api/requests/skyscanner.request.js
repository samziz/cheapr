const axios = require('axios');
const axiosConfig = require('../config/axios.config');


class Skyscanner {
			
	constructor(token) {
		this.axios = axios.create(axiosConfig(token));
	}

	getPrices(orig, dest, start, end) {		
		const query = this._formatUrlQuery(['gbp', 'uk', orig, dest, start, end]);

		this.axios
			.get(`browsedates/v1.0/${query}`)
			.then(data => data)
			.catch(err => console.error(err))
	}


	/* Private-style funcs */

	_formatUrlQuery(arr) {
		return arr.join('/');
	}
}

module.exports = Skyscanner;