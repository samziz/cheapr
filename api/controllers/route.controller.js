const _ = require('lodash');
const moment = require('moment');
const { SKYSCANNER_KEY } = process.env;
const SkyscannerRequest = require('../requests/skyscanner.request');

const Skyscanner = new SkyscannerRequest(SKYSCANNER_KEY)

exports.findRoute = async (req, res) => {
	// Read array of cities in IATA format from request
	let { cities, dates } = req.body;

	const codes = cities.map(city => city.title.toLowerCase().substring(0,3));
	const perms = permute(codes, 2);

	const routes = await Promise.all(
		perms.map(perm => new Promise(resolve => {
			Skyscanner
				.getPrices(perm[0], perm[1], dates.start, dates.end)
				.then(prices => resolve({
					trip: perm,
					prices
				}))
				.catch(err => console.error(err))
		}))
	)

	const route = optimise(cities, routes, dates.start);

	res.json(route);
}


function permuteForTwo(arr) {
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

function permute(arr, n) {

    function product(arr) {
		return _.reduce(arr, function(a, b) {
	        return _.flatten(_.map(a, function(x) {
	            return _.map(b, function(y) {
	                return _.concat(x,[y]);
	            });
	   		}), true);
    	}, [ [] ]);
	}

	// If user doesn't specify a permutation size, set permutation size to array length
    n = n || arr.length;

    for (var j = 0, inds=[]; j < n; j++) { 
    	inds.push(_.keys(arr));
    }

    let arrangements = product(inds).filter(pair => pair[0] !== pair[1]);

    arrangements = _.map(arrangements, indices => _.map(indices, i => arr[i]));

    arrangements = arrangements.filter(arr => arr.length === new Set(arr).size);

    return arrangements;
}

function findOptimalDate(list, date, error=3) {
	// Finds all available dates within some margin of error n, and selects 
	// the cheapest date. NB this algorithm gives no weight to the error 
	// value. A perfect fit will lose out to a cheaper flight n days later.

	let fits = [];

	list.find(entry => {
		const diff = moment(entry.PartialDate).diff(date, 'days');

		if (diff <= error) {
			dates.push({ 
				date: entry.PartialDate, 
				error: diff, 
				price: entry.Price 
			});
		}
	});

	fits = fits.sort((a, b) => a.price > b.price);

	return fits[0];
}

function optimise(prefs, routes, startDate) {
	/*
		For a set of arrays of trips, finds
		the cheapest combination of dates
		that satisfies the requirement to spend n
		days in each.
	*/

	const stops = prefs.map(apt => apt.code);

	const possibleRoutes = permute(stops, stops.length);

	const evaluatedRoutes = possibleRoutes
		.map(route => calculate(route, routes, prefs, startDate))
		.filter(route => route)
		.sort((a, b) => a.cost > b.cost);

	return evaluatedRoutes[0];
}

function calculate(route, data, prefs, startDate) {
	/* 
		Calculate the cost of a particular
		permutation and return null if cost
		can't be calculated from dates.

		ROUTE: [ [a, b], ... ]
		DATA: [ {  }, ... ]
	*/

	let totalCost = 0,
		dateCounter = moment(startDate),
		finalRoute = [];

	for (let [index, stop] of route.entries()) {
		const nextStop = route[index+1];
		if (!nextStop) break;

		const prefThisStop = prefs.find(city => city.code === nextStop).time;
		const prefNextStop = prefs.find(city => city.code === nextStop).time;

		// Get list of dates and prices for this particular trip
		const tripGrid = data.find(entry => entry.trip === [stop, nextStop]);

		const { cost, date, error } = findOptimalDate(
			// Find cheapest trip from list given ideal date (totalDate) and margin of error
			tripGrid.prices, dateCounter, prefThisStop.giveOrTake
		);

		if (!date) return null;
		if (error) dateCounter.add(error, 'days');
		totalCost += cost;

		finalRoute.push({
			cost,
			date,
			trip: [stop, nextStop],
		});

		// Advance date by time spent in destination
		// We can safely assume prefs.find(fn) returns a city object
		dateCounter.add(prefNextStop.days, 'days');
	}

	return {
		route: finalRoute,
		cost
	}
}

