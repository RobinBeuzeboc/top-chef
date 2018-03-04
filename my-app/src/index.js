import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import { scrape } from './node/scraper.js';

let data = require('./proms.json')
// scrape();

function get_deals(deals) {
  let rows = deals.map(function(row) {
    return (
      <div className='restaurant-deal-title'>
        <h6>Deal</h6> {row.title}
      </div>
    );
  });
  return rows;
}

function get_star_number(stars) {
  let s = [];
  for(let i = 0; i < stars; i++){
    s.push(
      <li>
        <div className='star'></div>
      </li>
    );
  }
  return s;
}

function get_restaurants(data) {
  let rows = data.map(function(row) {
    return (
      <div className='restaurant'>
        <div className='restaurant-name'>
          {row.name}
        </div>
        <div className='restaurant-address'>
          <div className='address'>Address</div>
          <div className='restaurant-address-complement'>
            <h6>Address</h6> {row.address.complement}
          </div>
          <div className='restaurant-address-city'>
            <h6>City</h6> {row.address.city}
          </div>
          <div className='restaurant-address-postal'>
            <h6>Postal Code</h6> {row.address.postal}
          </div>
        </div>
        <div className='michelin'>
          <div className='chief'>Michelin</div>
          <div className='restaurant-stars'>
            <h6>Stars</h6>
            <ul className='stars'>
              {get_star_number(row.stars)}
            </ul>
          </div>
          <div className='restaurant-chief-name'>
            <h6>Chief Name</h6> {row.chief}
          </div>
        </div>
        <div className='cuisinesblock'>
          <div className='cuisines'>Cooking Type</div>
          <div className='restaurant-cuisines'>
            <h6>Type:</h6> {row.cuisines}
          </div>
        </div>
        <div className='deals'>Deals</div>
        <div className='restaurant-deals'>
          {get_deals(row.deals)}
        </div>
        <br />
      </div>
    );
  });
  return rows;
}

function get_content() {
  let rows = [
    <div className='page-title'>TOP-CHEF</div>,
    <div className='restaurants'>{get_restaurants(data)}</div>
  ];
  return rows;
}

class Table extends React.Component{
  render() {
    let content = get_content();
    return content;
  }
}

ReactDOM.render(<Table />, document.getElementById('root'));