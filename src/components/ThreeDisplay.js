import React from 'react';
import { connect } from 'react-redux';


class ThreeDisplay extends React.Component {


    render() {
        return (
            <div
                id="container"
                className={'three-display'}
            />
        );
    }
}



export default connect()(ThreeDisplay);