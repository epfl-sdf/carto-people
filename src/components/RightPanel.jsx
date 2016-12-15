/* eslint react/prop-types: 0 */

import React from 'react';
import { Col } from 'antd';

import Map from './Map';

const RightPanel = props => <Col span={18}>
  {props.type && props.id
    ? <Map {...props} />
    : <h2>General view not implemented yet.</h2>}
</Col>;

export default RightPanel;
