import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'mobx-react';

import EmployeeStore from './stores/EmployeeStore';
import CompetenceStore from './stores/CompetenceStore';
import ViewStore from './stores/ViewStore';
import App from './App';

const employeeStore = new EmployeeStore();
const competenceStore = new CompetenceStore();
const viewStore = new ViewStore();

const stores = { employeeStore, competenceStore, viewStore };

ReactDOM.render(
  <Provider {...stores} >
    <Router history={browserHistory}>
      <Route path="/" component={App} />
      <Route path="/:type/:id" component={App} />
    </Router>
  </Provider>,
  document.getElementById('app')
);
