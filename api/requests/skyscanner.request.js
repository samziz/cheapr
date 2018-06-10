import axios from 'axios';

export default class Skyscanner {
			
	// TODO: Unfinished example implementation

	
	constructor(token) {
		this.axios = axios.create(this.axiosConfig);
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


	/* Constants */

	axiosConfig = {
        baseUrl: 'http://partners.api.skyscanner.net/apiservices/',
        timeout: 2000,
        headers: {
        	Accept: 'application/json'
        },
        defaults: {
        	params: {
        		apiKey: token
        	}
        }
	}
}