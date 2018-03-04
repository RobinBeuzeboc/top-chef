import React, { Component } from 'react';

import './App.css';
import data from './proms.json';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="header">

          <h1 className="title">List of promotions</h1>
        </header>
		<div className="headP">
		<ul>
        {
          data.map(function(restaurant){
		  return <li>{restaurant.name}--------------- 
		  {restaurant.address.postal_code}, ---------------
		  {restaurant.link}                  
		  {restaurant.promotions.exclusions}</li>;
          })
        }
        </ul>
        </div>
      </div>
    );
  }
}

export default App;
