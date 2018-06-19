import APIRequest from './requests/api.request';
import './App.css';
import { capitalise, getCoordsFromString } from './utils'
import { connect } from 'react-redux';
import List from './components/list/list';
import Map from './components/map/map';
import React from 'react';
import Search from './components/search/search';
import { setCities, setRoute } from './redux/actions';

class App extends React.PureComponent {

  render() {
    return (
      <div className='app'>
        <div style={{ display: 'flex' }}>
          <div className='container left'>
            <Search onSubmit={apt => this.add(apt)}/>
            <List 
              remove={title => this.remove(title)}
              update={(title, opts) => this.update(title, opts)}
              onSubmit={() => this.getRoute()}
              onClear={() => this.props.setRoute([])}
            />
          </div>
          <div className='container right'>
            <Map />
          </div>
        </div>
        <div className='footer'>
          <p className='footer-text'>
            Made with ❤️by Sam. You can contribute on Github
            <a href='http://www.github.com/samziz/cheapr'> here</a>.
          </p>
        </div>
      </div>
    );
  }

  async getRoute() {
    const { cities, dates, prefs } = this.props;
    const req = new APIRequest();
    req.getRoute(cities, dates, prefs).then(route => {
      this.props.setRoute(route);
    })
  }

  async add(name) {
    const { cities, setCities } = this.props;

    if (cities && cities.some(apt => apt.name.toLowerCase() === name.toLowerCase())) {
      alert("Cannot enter the same city twice");
      return;
    }

    const city = await this.format(name);
    cities.push(city);

    setCities(cities);
  }

  update(name, opts) {
    const { cities, setCities } = this.props;

    const i = cities.findIndex(city => city.name === name);
    
    Object.assign(cities[i], opts);

    setCities(cities);
  }

  remove(name) {
    let { cities, setCities } = this.props;
    cities = cities.filter(apt => apt.name !== name);
    setCities(cities);
  }

  async format(string, days=1) {
    const { location, name } = await getCoordsFromString(string);

    return {
      name,
      days,
      location
    }
  }

}

const mapStateToProps = state => state;

const mapDispatchToProps = { setCities, setRoute };

export default connect(mapStateToProps, mapDispatchToProps)(App);
