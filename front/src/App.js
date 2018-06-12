import './App.css';
import { connect } from 'react-redux';
import List from './components/list/list';
import Map from './components/map/map';
import React from 'react';
import Search from './components/search/search';
import { setItems } from './redux/actions';

class App extends React.PureComponent {

  render() {
    const { airports } = this.props;

    return (
      <div className='app'>
        <div style={{ display: 'flex' }}>
          <div className='container left'>
            <Search onSubmit={apt => this.add(apt)}/>
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

  add(airport) {
    const { airports, setItems } = this.props;
    airports.push(airport);
    setItems(airports);
  }

  remove(airport) {
    let { airports, setItems } = this.props;
    airports = airports.filter(apt => apt !== airport);
    setItems(airports);
  }
}

const mapStateToProps = state => state;

const mapDispatchToProps = { setItems };

export default connect(mapStateToProps, mapDispatchToProps)(App);
