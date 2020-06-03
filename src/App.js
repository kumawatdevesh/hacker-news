import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import './App.css';
import Auth from './Auth/Auth';
import { connect } from 'react-redux';
import MainPage from './Home/MainPage';

function App() {

  const storedData = JSON.parse(localStorage.getItem('userData'));
  let routes;

  if(storedData) {
    routes = (
      <Switch>
        <Route path="/" component={MainPage} />
        <Redirect to="/" />
      </Switch>
    )
  } else {
    routes = (
      <Switch>
        <Route path="/auth" component={Auth} />
        <Redirect to="/auth" />
      </Switch>
    )
  }

  return (
    <div className="App">
    <BrowserRouter>
      {routes}
    </BrowserRouter>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    userId: state.userId,
    userToken: state.userToken
  }
}

export default connect(mapStateToProps, null)(App);
