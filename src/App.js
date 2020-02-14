import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import './index.css';
import { Provider } from 'react-redux';
import { Helmet } from 'react-helmet'
import MainScreen from './components/MainScreen/MainScreen';
import About from "./components/About/About";
import Navbar from "./components/Navbar/Navbar";
import Favicon from 'react-favicon';
import store from './store';
import favicon from './models/favicon.png';
import MetaTags from 'react-meta-tags';
import './index.css';


class App extends Component {

  constructor(props){
    super(props)

    console.log('app loading')
    console.log(window.visualViewport.width)

    this.state = {
      mobile: true
    }

  }

  componentDidMount(){
    if(window.visualViewport.width < 420){
      this.setState({mobile: false})
    }

  }



  render() {
    console.log('is mobile?: ', this.state.mobile)
		return(
      <Router>
        <Helmet>
          <title>AudioWorld.io: Visualizing your music in new ways.</title>
        </Helmet>
        <Favicon url={favicon} />
        <Provider store={store}>
          <Navbar />
          <Route path="/" exact component={MainScreen} />
          {!this.state.mobile && <Route path="/about" component={About} />}
        </Provider>
      </Router>
		);
	}
}



export default App;