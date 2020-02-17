import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../models/clear_back_logo.png';
import './Navbar.css';


export default class Navbar extends Component {



  render() {

    var logoStyle = {
      height: "4rem",
      top: "5px",
      position: "relative"
    }
    
    return (
      <div className="navBar">
        <div className="navItem">
          <Link to="/" >
            <img src={logo} alt="Logo" className="homeLogo" style={logoStyle}/>
          </Link>
        </div>
        <div className="navItemLeft">
          <Link to="/about">About</Link>
        </div>
      </div>
    );
  }
}