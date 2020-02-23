import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Accordion, Icon } from 'semantic-ui-react';
import './SceneMenu.css';

class ObjectEntry extends Component {

render() {  

  const { name, id, activeIndex, handleClick, child } = this.props
  
  return (
    <div>
      <Accordion.Title
        active={activeIndex === id}
        index={id}
        onClick={handleClick}
        >
      <div className='objectTitle'>{name}</div>
      <Icon name='dropdown' />
      </Accordion.Title>
      <Accordion.Content active={activeIndex === id}>
        {child}
      </Accordion.Content>
    </div>
  )}

}

ObjectEntry.propTypes = {
  name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
};



export default ObjectEntry;