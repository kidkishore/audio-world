import React, { Component } from 'react';
import {
    Menu,
    Segment,
    Sidebar,
    Tab,
  } from 'semantic-ui-react';
import ThreeApp from '../../containers/ThreeApp';
import AudioMenu from '../../containers/AudioMenu/AudioMenu';
import SceneMenu from '../../containers/SceneMenu/SceneMenu';
import AudioPlayer from '../../containers/AudioPlayer/AudioPlayer';
import '../../index.css'; 
import './MainScreen.css'; 

class MainScreen extends Component {

  constructor(props){
    super(props)

    this.state = {
      visible: false
    }
  }

  handleClick = () => { this.setState({ visible:  !this.state.visible }); };

 
  render() {
    const { visible } = this.state;


    const panes = [
      { key: 1, menuItem: 'AUDIO', pane: {key:1, content: <AudioMenu/>}},
      { key: 2,  menuItem: 'SCENE', pane: {key:2, content: <SceneMenu/>}},
    ];

    return (
        <div className='mainScreen'>
        <Sidebar.Pushable as={Segment} className='appPushable'>
          <Sidebar
              as={Menu}
              animation='overlay'
              icon='labeled'
              inverted
              onHide={this.handleSidebarHide}
              vertical
              visible={visible}
              width='wide'
              className='sideBar'
          >
            <div className="showAudio">
            <Tab panes={panes} renderActiveOnly={false}/>
            </div> 
          </Sidebar>
          <Sidebar.Pusher>
          <div className='appScene'>
            <ThreeApp />
          </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <div className='bottomBar'>
          <button className="barButton" onClick={this.handleClick} >
              <i aria-hidden="true" className={this.state.visible ? "options icon menu-on" : "options icon menu-off"}></i>
          </button>
          <AudioPlayer />
        </div>   
      </div>
    )
  }
}

export default MainScreen;