const _ = require('lodash');
const moment = require('moment');
const { SKYSCANNER_KEY } = process.env;
const SkyscannerRequest = require('../requests/skyscanner.request');


exports.findRoute = async (req, res) => {
	try {
		const Skyscanner = new SkyscannerRequest(SKYSCANNER_KEY);

		let { cities, dates, prefs } = req.body;

		const names = cities.map(city => city.name);
		const perms = permute(names, 2);

		const routes = await Promise.all(
			perms.map(trip => new Promise((resolve, reject) => {
				Skyscanner
					.getPrices(trip[0], trip[1], dates.start.date)
					.then(prices => resolve({ trip, prices }))
					.catch(err => reject(err))
			}))
		)

		const evaluatedRoutes = optimise(cities, routes, dates.start.date, prefs);

		res.json(evaluatedRoutes[0]);
	} catch (error) {
		console.error(error.stack || error);
		res.status(500);
		res.send(); 
	}
}

exports.listRoutes = async (req, res) => {
	try {
		const Skyscanner = new SkyscannerRequest(SKYSCANNER_KEY);

		let { cities, dates, prefs } = req.body;

		const codes = cities.map(city => makeCode(city.name));
		const perms = permute(codes, 2);

		const routes = await Promise.all(
			perms.map(trip => new Promise(resolve => {
				Skyscanner
					.getPrices(trip[0], trip[1], dates.start.date)
					.then(prices => resolve({ trip, prices }))
					.catch(err => console.error(err))
			}))
		)

		const evaluatedRoutes = optimise(cities, routes, dates.start.date, prefs);
		evaluatedRoutes.map((route, index) => evaluatedRoutes[index].rank = index);

		res.json(evaluatedRoutes);
	} catch (error) {
		console.error(error.stack || error);
		res.status(500);
		res.send(error); 
	}
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

function product(arr) {
	return _.reduce(arr, function(a, b) {
        
        return _.flatten(_.map(a, function(x) {
            
            return _.map(b, function(y) {
              
                return _.concat(x,[y]);

            });

   		}), true);
   		
	}, [ [] ]);
}

function permute(arr, n) {

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

function findOptimalDate(list, date, error=0) {
	// Finds all available dates within some margin of error n, and selects 
	// the cheapest date. NB this algorithm gives no weight to the error 
	// value. A perfect fit will lose out to a cheaper flight n days later.

	let fits = [];
	list.find(entry => {
		const diff = Math.abs( moment(entry.PartialDate).diff(date, 'days') );
		if (diff <= error) {
			fits.push({ 
				date: entry.PartialDate, 
				error: diff, 
				cost: entry.Price 
			});
		}
	});

	fits = fits.sort((a, b) => a.price > b.price);

	return fits[0];
}

function optimise(cities, routes, startDate, prefs) {
	/*
		For a set of arrays of trips, finds
		the cheapest combination of dates
		that satisfies the requirement to spend n
		days in each.
	*/

	const names = cities.map(city => city.name);

	let possibleRoutes = permute(names, names.length);

	if (prefs && prefs.departFrom) possibleRoutes = possibleRoutes
		.filter(route => route[0] === prefs.departFrom);

	if (prefs && prefs.returnTo) possibleRoutes = possibleRoutes
		.filter(route => route[route.length-1] === prefs.returnTo);

	const evaluatedRoutes = possibleRoutes
		.map(route => calculate(route, routes, cities, prefs, startDate))
		.filter(route => route)
		.sort((a, b) => a.cost > b.cost);

	return evaluatedRoutes;
}

function calculate(route, data, cities, prefs, startDate) {
	/* 
		Calculate the cost of a particular
		permutation and return null if cost
		can't be calculated from dates.

		ROUTE: [ [a, b], ... ]
		DATA: [ {  }, ... ]
	*/

	let dateCounter = moment(startDate),
		finalRoute = [];

	try {
		for (let [index, stop] of route.entries()) {
			const nextStop = route[index+1];
			if (!nextStop) break;

			// We can safely assume that prefs.find(fn) will return a city object
			const prefThisStop = cities.find(city => city.name === nextStop);
			const prefNextStop = cities.find(city => city.name === nextStop);

			// Get list of dates and prices for this particular trip
			const tripGrid = data
				.find(entry => entry.trip[0] === stop && entry.trip[1] === nextStop);

			const { cost, date, error } = findOptimalDate(
				// Find cheapest trip from list given ideal date (totalDate) and margin of error
				tripGrid.prices, dateCounter, prefThisStop.giveOrTake
			);
			
			if (error) dateCounter.add(error, 'days');

			finalRoute.push({
				cost,
				date,
				trip: [stop, nextStop],
				url: makeBuyUrl([stop, nextStop], date)
			});

			// Advance date by time spent in destination
			dateCounter.add(prefNextStop.days, 'days');
		}

		return {
			route: finalRoute,
			cost: finalRoute.reduce((total, trip) => total + trip.cost, 0)
		}
	} catch (error) {
		return null;
	}
	
}

function makeBuyUrl(trip, date) {
	const [ orig, dst ] = trip;

	const dateString = moment(date).format('YYYY-MM-DD');

	return `http://partners.api.skyscanner.net/apiservices/referral/v1.0/GB/gbp/en-us/${orig}/${dst}/${dateString}/${dateString}`
}

function makeCode(name) {
	// Convert full name of city to IATA format
	return name
		.toLowerCase()
		.replace(' ', '')
		.substring(0,4);
}

