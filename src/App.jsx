/* eslint react/prop-types: 0 */

import React from 'react';
import { withRouter } from 'react-router';
import { LocaleProvider, Row } from 'antd';
import antdEn from 'antd/lib/locale-provider/en_US';

import TopPanel from './components/TopPanel';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';

const App = props => <LocaleProvider locale={antdEn}>
  <div>
    <Row>
      <TopPanel {...props.params} router={props.router} />
    </Row>
    <Row>
      <LeftPanel {...props.params} router={props.router} />
      <RightPanel {...props.params} router={props.router} />
    </Row>
  </div>
</LocaleProvider>;

export default withRouter(App);
