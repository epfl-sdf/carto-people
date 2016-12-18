/* eslint react/prop-types: 0 */

import React from 'react';
import { withRouter } from 'react-router';

import { LocaleProvider, Row } from 'antd';
import antdEn from 'antd/lib/locale-provider/en_US';

import TopPanel from './components/TopPanel';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

class App extends React.Component {
  render() {
    return (<LocaleProvider locale={antdEn}>
      <div>
        <Row>
          <TopPanel params={this.props.params} router={this.props.router} />
        </Row>
        <Row>
          <LeftPanel params={this.props.params} router={this.props.router} />
          <RightPanel params={this.props.params} router={this.props.router} />
        </Row>
      </div>
    </LocaleProvider>);
  }
}

export default withRouter(App);
