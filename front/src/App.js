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
    const { cities, start, end } = this.props;
    const req = new APIRequest();
    req.getRoute(cities, { start, end }).then(route => {
      this.props.setRoute(route);
    })
  }

  async add(title) {
    const { cities, setCities } = this.props;

    if (cities && cities.some(apt => apt.title.toLowerCase() === title.toLowerCase())) {
      alert("Cannot enter the same city twice");
      return;
    }

    const city = await this.format(title);
    cities.push(city);

    setCities(cities);
  }

  update(title, opts) {
    const { cities, setCities } = this.props;

    const i = cities.findIndex(city => city.title === title);
    
    Object.assign(cities[i], opts);

    setCities(cities);
  }

  remove(title) {
    let { cities, setCities } = this.props;
    cities = cities.filter(apt => apt.title !== title);
    setCities(cities);
  }

  async format(title, days=1) {
    const { location, name } = await getCoordsFromString(title);

    return {
      title: name,
      days,
      location: location
    }
  }

}

const mapStateToProps = state => state;

const mapDispatchToProps = { setCities, setRoute };

export default connect(mapStateToProps, mapDispatchToProps)(App);
