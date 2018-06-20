const Joi = require('joi');

exports.findRoute = {
	cities: Joi.array().items(
			Joi.object().keys({
  				name: Joi.string().required(),
  				days: Joi.number().required(),
  				giveOrTake: Joi.number()
			})
		),
	dates: {
		start: Joi.string().required()
	},
	prefs: {
		departFrom: Joi.string(),
		returnTo: Joi.string()
	}
}

exports.listRoutes = {
	cities: Joi.array().items(
			Joi.object().keys({
  				name: Joi.string().required(),
  				days: Joi.number().required(),
  				giveOrTake: Joi.number()
			})
		),
	dates: {
		start: Joi.string().required()
	},
	prefs: {
		departFrom: Joi.string(),
		returnTo: Joi.string()
	}
}