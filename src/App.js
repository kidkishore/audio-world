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


class App extends Component {
  render() {
		return(
      <Router>
        <Helmet>
          <title>AudioWorld.io: Visualizing your music in new ways.</title>
        </Helmet>
        <Favicon url={favicon} />
        <MetaTags>
            <meta name="viewport" content="width=device-width" />
        </MetaTags>
        <Provider store={store}>
          <Navbar />
          <Route path="/" exact component={MainScreen} />
          <Route path="/about" component={About} />
        </Provider>
      </Router>
		);
	}
}



export default App;