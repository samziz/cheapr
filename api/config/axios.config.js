module.exports = token => ({
  baseURL: 'http://partners.api.skyscanner.net/apiservices/',
  timeout: 1000,
  headers: {'apikey': token}
});