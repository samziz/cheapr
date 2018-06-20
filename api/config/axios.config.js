module.exports = token => ({
  baseURL: 'http://partners.api.skyscanner.net/apiservices/',
  timeout: 3000,
  headers: {
  	Accept: 'application/json',
  	apikey: token
  }
});