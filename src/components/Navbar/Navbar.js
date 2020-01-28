import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../models/AW-logo-clear.png';
import './Navbar.css';


export default class Navbar extends Component {



  render() {

    var logoStyle = {
      height: '4rem',
    }
    
    var linkStyle = {
      color: '#de1d2a',
    }

    return (
      <div className="navBar">
        <div className="navItem">
          <Link to="/" >
            <img src={logo} alt="Logo" className="homeLogo" style={logoStyle}/>
          </Link>
        </div>
        <div className="navItem">
          <Link to="/about" style={linkStyle}>About</Link>
        </div>
      </div>
    );
  }
}