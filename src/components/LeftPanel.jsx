import React from 'react';
import { Row, Col } from 'antd';

import SearchBar from './SearchBar';
import Filters from './Filters';

const LeftPanel = props => <Col xs={24} sm={24} md={4} lg={4} className="padded-col">
  <Row>
    <SearchBar params={props.params} router={props.router} />
  </Row>
  <br />
  <Row>
    <Filters params={props.params} />
  </Row>
</Col>;

export default LeftPanel;
