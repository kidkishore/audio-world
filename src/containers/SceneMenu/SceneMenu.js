import React, { Component } from 'react';
import { Divider, Menu } from 'semantic-ui-react';
import './SceneMenu.css';
import ObjectsMenu from './ObjectsMenu';
import ScenesMenu from './ScenesMenu';

class SceneMenu extends Component {

  state = { activeItem: 'Choose' }
  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
      

    const { activeItem } = this.state
      
    return (
      <div>
        <div className='sceneOptions'>
          <Menu secondary>
          <Menu.Item
            name='Choose'
            active={activeItem === 'Choose'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='Create'
            active={activeItem === 'Create'}
            onClick={this.handleItemClick}
          />
        </Menu>
      </div>
      <Divider />
      {activeItem === 'Choose' && <ScenesMenu/>}
        {activeItem === 'Create' && <ObjectsMenu/>}
      </div>
    );
  }
}


export default SceneMenu;