import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Accordion, Header, Icon } from 'semantic-ui-react';
import ObjectControls from './ObjectControls';
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
            <Header as='h3' textAlign='left' inverted>Objects</Header>
            <Accordion>
              {this.props.objects.map(object => {
                return(
                  <div key={object.id}>
                    {object.name !== 'Background' && 
                      <div>
                        <Accordion.Title
                          active={activeIndex === object.id}
                          index={object.id}
                          onClick={this.handleClick}
                        >
                          <Icon name='dropdown' />
                          {object.name}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === object.id}>
                          <ObjectControls object={object} name='aaaa'/>
                        </Accordion.Content>
                      </div>
                    }
                    </div>
                  )
                })
              }
            </Accordion>
          </div>
      );
    }

}

ObjectsMenu.defaultProps = {
  objects: []
};

ObjectsMenu.propTypes = {
  objects: PropTypes.array
};

const mapStateToProps = state => {
  return {
      objects: state.scene.objects,
  };
};

export default connect(mapStateToProps, null)(ObjectsMenu);