const { API_KEY } = process.env;

const SkyscannerRequest = require('../requests/skyscanner.request');

const Skyscanner = new SkyscannerRequest(API_KEY)

exports.get = async (req, res) => {
	// Read array of airports in IATA format from request
	const { airports, dates } = req;
	const routes = {};

	for (let orig of airports) {

		for (let dst of airports) {

			const route = await Skyscanner
				.getPrices(orig, dst, dates.start, dates.end);


			prices[orig] = prices[orig] || [];
			prices[orig][dst] = route;

		}

	}
}