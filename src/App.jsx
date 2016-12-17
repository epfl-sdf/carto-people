/* eslint react/prop-types: 0 */

import React from 'react';
import { withRouter } from 'react-router';
import { observer, inject } from 'mobx-react';

import { LocaleProvider, Row } from 'antd';
import antdEn from 'antd/lib/locale-provider/en_US';

import TopPanel from './components/TopPanel';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

@inject('employeeStore') @observer
class App extends React.Component {
  componentWillMount() {
    this.props.employeeStore.loadEmployees();
  }

  render() {
    const employeeStore = this.props.employeeStore;

    return (<LocaleProvider locale={antdEn}>
      <div>
        <Row>
          <TopPanel {...this.props.params} employeeStore={employeeStore} router={this.props.router} />
        </Row>
        <Row>
          <LeftPanel {...this.props.params} employeeStore={employeeStore} router={this.props.router} />
          <RightPanel {...this.props.params} employeeStore={employeeStore} router={this.props.router} />
        </Row>
      </div>
    </LocaleProvider>);
  }
}

export default withRouter(App);
