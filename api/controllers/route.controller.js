const { SKYSCANNER_KEY } = process.env;
const moment = require('moment');
const SkyscannerRequest = require('../requests/skyscanner.request');

const Skyscanner = new SkyscannerRequest(SKYSCANNER_KEY)

exports.get = async (req, res) => {
	// Read array of cities in IATA format from request
	const { cities, dates } = req;
	const routes = {};

	const codes = cities.map(apt => apt.code);
	const perms = permute(cities);

	for (let perm of perms) {

		const route = await Skyscanner
				.getPrices(orig, dst, dates.start, dates.end);

		prices[orig] = prices[orig] || [];
		prices[orig][dst] = route;

	}
}


function permute(arr) {
	// Return every combination of two items within arr

 	let perms = [];

	for (let item of arr) {

		for (let other of arr) {

			if (other !== item) {
				perms.push([item, other])
			}
			
		}

	}

	return perms;
}

function optimise(arr) {
	/*
		For a set of arrays of trips, finds
		the cheapest combination of flight dates
		that satisfies the requirement to spend n
		days in each.
	*/


}


// Skyscanner.getPrices('lond', 'pari', moment('2018-06-22'), moment('2018-07-29'))
// 	.then(res => console.log(res));