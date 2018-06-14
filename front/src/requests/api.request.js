import axios from 'axios';

export default class APIRequest {
			
	constructor(token) {
		this.baseURL = process.env.REACT_APP_BASE_API_URL;
	}

	async getRoute(cities, dates) {
		const res = await axios.post(this.baseURL + '/route', { cities, dates });
		return res.data;
	}

}