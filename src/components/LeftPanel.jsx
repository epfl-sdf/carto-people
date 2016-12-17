/* eslint react/prop-types: 0 */

import React from 'react';
import { Col } from 'antd';

import Filters from './Filters';

const LeftPanel = () => <Col span={6}>
  <Filters />
</Col>;

export default LeftPanel;
