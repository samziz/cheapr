import './App.css';
import { connect } from 'react-redux';
import List from './components/list/list';
import Map from './components/map/map';
import React from 'react';
import Search from './components/search/search';
import { setItems } from './redux/actions';
import { getCoordsFromString } from './utils';

class App extends React.PureComponent {

  render() {
    return (
      <div className='app'>
        <div style={{ display: 'flex' }}>
          <div className='container left'>
            <Search onSubmit={apt => this.add(apt)}/>
            <List setDays={(title, val) => this.setDays(title, val)} />
          </div>
          <div className='container right'>
            <Map />
          </div>
        </div>
        <div className='footer'>
          <p className='footer-text'>
            Made with ❤️by Sam. See the project on 
            Github <a href='http://www.github.com/samziz/cheapr'>here</a>.
          </p>
        </div>
      </div>
    );
  }

  async add(title) {
    const { cities, setItems } = this.props;

    if (cities && cities.some(apt => apt.title === title)) {
      alert("Cannot enter the same city twice");
      return;
    }

    const airport = await this.format(title);
    cities.push(airport);

    setItems(cities);
  }

  setDays(title, n) {
    const { cities, setItems } = this.props;

    const i = cities.findIndex(city => city.title === title);
    cities[i].days = n;

    setItems(cities);
  }

  remove(title) {
    let { cities, setItems } = this.props;
    cities = cities.filter(apt => apt.title !== title);
    setItems(cities);
  }

  async format(title, days=1) {
    const code = title.toLowerCase().substring(0,4);
    const location = await getCoordsFromString(title);

    return {
      title,
      code,
      days,
      location
    }
  }

}

const mapStateToProps = state => state;

const mapDispatchToProps = { setItems };

export default connect(mapStateToProps, mapDispatchToProps)(App);
