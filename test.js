import React, { Component } from 'react';
import data from './mods/promos.json';

class App extends Component {
  render() {
    return (
        <ul>
        {
          data.map(function(promos){
            return <li>{promos.name} - {promos.promotions}</li>;
          })
        }
        </ul>
    );
  }
}

export default App;
