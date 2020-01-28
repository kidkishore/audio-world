import React, { Component } from 'react';
import './About.css';
// import Section from '../Section.js'
import ScrollAnimation from 'react-animate-on-scroll';

class About extends Component {
  render() {
		return(
      <div className='aboutMain'>
        <div className='aboutContent'>
          <ScrollAnimation animateIn="fadeIn">
            <div className='mainHeader'>Visualize your Music with Ease</div>
          </ScrollAnimation>
          
          <ScrollAnimation animateIn="fadeIn">
            <div className='mainContent'>
                Audioworld brings a whole new experience to enjoying your music.
                Simply contect a microphone or upload a song file to get started with your own audio visualization.
            </div>
          </ScrollAnimation>
      </div>
      </div>
		);
	}
}



export default About;