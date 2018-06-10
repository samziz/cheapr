import React, { Component } from 'react';
import List from './components/list/list';
import Map from './components/map/map';
import Search from './components/search/search';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className='app'>
        <div style={{ display: 'flex' }}>
          <div className='container left'>
            <Search />
            <List />
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
}

export default App;
