import React, { Component } from 'react';
import { Accordion } from 'semantic-ui-react';
import ObjectEntry from './ObjectEntry';
import BackgroundControl from './BackgroundControl';
import CenterControl from './CenterControl';
import OrbitControl from './OrbitControl';
import TextControl from './TextControl';
import './SceneMenu.css';

class ObjectsMenu extends Component {

  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {  

    const { activeIndex } = this.state
    
    return (
          <div className="objectsAccordian">
            <Accordion>
            <ObjectEntry name={'Background'} id={0} activeIndex={activeIndex} handleClick={this.handleClick} child={<BackgroundControl/>} />
            <ObjectEntry name={'Center'} id={1} activeIndex={activeIndex} handleClick={this.handleClick} child={<CenterControl/>} />
            <ObjectEntry name={'Orbit'} id={2} activeIndex={activeIndex} handleClick={this.handleClick} child={<OrbitControl/>} />
            <ObjectEntry name={'Text'} id={3} activeIndex={activeIndex} handleClick={this.handleClick} child={<TextControl/>} />
            </Accordion>
          </div>
      );
    }

}


export default ObjectsMenu;