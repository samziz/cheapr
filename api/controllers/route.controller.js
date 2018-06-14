const _ = require('lodash');
const moment = require('moment');
const { SKYSCANNER_KEY } = process.env;
const SkyscannerRequest = require('../requests/skyscanner.request');

const Skyscanner = new SkyscannerRequest(SKYSCANNER_KEY)

exports.findRoute = async (req, res) => {
	// Read array of cities in IATA format from request
	let { cities, dates } = req.body;

	const codes = cities.map(apt => apt.code);
	const perms = permute(codes, 2);

	const apiPromises = perms.map(perm => new Promise(resolve => {
		Skyscanner
			.getPrices(perm[0], perm[1], dates.start, dates.end)
			.then(prices => resolve({
				trip: perm,
				prices
			}))
			.catch(err => console.error('ERR!:',err))
	}))

	const routes = await Promise.all(apiPromises);

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

    n = n || arr.length;

    for (var j = 0, inds=[]; j < n; j++) { 
    	inds.push(_.keys(arr));
    }

    let arrangements = product(inds).filter(pair => pair[0] !== pair[1]);

    arrangements = _.map(arrangements, indices => _.map(indices, i => arr[i]));

    arrangements = arrangements.filter(arr => arr.length === new Set(arr).size);

    return arrangements;
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

		ROUTE: [ [a, b], [b, c] ... ]
		DATA: [ {  } ]
	*/

	let cost = 0;
	let date = moment(startDate);
	let finalRoute = [];

	for (let [index, stop] of route.entries()) {
		const nextStop = route[index+1];
		if (!nextStop) break;

		const tripGrid = data.find(datum => datum.trip = [stop, nextStop]);

		const tripGridDate = tripGrid.prices.find(datum => {
			if (moment(datum.PartialDate) === date) return true;
			
			const diff = moment(datum.PartialDate).diff(date, 'days');

			if (diff < 3) {
				date.add(diff, 'days');
				return true;
			};
		});
		
		// TODO: Support flexible scheduling
		if (!tripGridDate) return null;

		cost += tripGridDate.Price;

		finalRoute.push({
			trip: [stop, nextStop],
			date
		});

		// Advance date by time spent in destination
		const stopPref = prefs.find(city => city.code === stop);
		date.add(stopPref.days, 'days');
	}

	return {
		route: finalRoute,
		cost
	}
}

