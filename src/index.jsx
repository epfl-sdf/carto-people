import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'mobx-react';

import EmployeeStore from './stores/EmployeeStore';
import App from './App';

ReactDOM.render(
  <Provider employeeStore={new EmployeeStore()} >
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <Route path="/:type/:id" component={App} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('app')
);
