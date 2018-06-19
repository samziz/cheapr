# Cheapr

## What does Cheapr do?

Cheapr finds the cheapest route that covers any given list of cities.

## How does it work?

First, we fetch from Skyscanner all the prices for every possible trip from any A to any B within these dates. Then we calculate all the permutations .

The algorithm **gives no weight to your date preferences**. In other words, if you specify that you can give or take five days in a particular city, it will prefer a £499 flight five days from your preferred departure date, rather than a £500 flight on that date.

## API-only use

You can use the API for Cheapr by making a POST call to `api.cheapr.cf/route`. The front end is just a basic client for this endpoint. You can also use `/route/all` to retrieve all calculated routes in ascending order of price. The API expects a JSON body containing a list of cities and dates in the following format:

```
	{
		"cities": [
			{
				"name": "London",
				"days": 5,
				"giveOrTake": 3
			},
			{
				"name": "Paris",
				"days": 3,
				"giveOrTake": 5
			},
			{
				"name": "Berlin",
				"days": 4,
				"giveOrTake": 1
			}
		],

		"dates": {
			"start": {
				"date": "2018-06-21",
				"giveOrTake": 5
			}
		},

		"prefs": {
			"departFrom": "London",
			"returnTo": "Berlin"
		}
	}
```

The 'prefs' field is optional. Including the 'departFrom' or 'returnTo' will reduce the number of possible routes, so you shouldn't use it unless you need to. You should also avoid running the query with too many cities. 

Given the unpredictability of flight prices, the algorithm can't infer anything about the price of one trip from the price of another (like you would with spatial distance in normal TSP-type problems). Instead it uses a brute-force solution, calculating all possible permutations, and therefore runs in factorial time. Queries using extremely long lists of cities will be prohibitively slow. 

Last of all, the API is rate limited in the sense that it will crash if you send too many requests, so please don't.