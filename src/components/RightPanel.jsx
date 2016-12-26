/* eslint react/prop-types: 0 */

import React from 'react';
import { observer, inject } from 'mobx-react';

import { Col } from 'antd';

import Map from './Map';
import Details from './Details';

const RightPanel = inject('dataStore')(observer((props) => {
  const { dataStore } = props;

  return (<div>
    <Col xs={24} sm={24} md={16} lg={16}>
      {!dataStore.isLoading
        && <Map
          dataStore={dataStore}
          params={props.params}
          router={props.router}
        />}
    </Col>
    <Col xs={24} sm={24} md={4} lg={4} className="padded-col">
      <Details />
    </Col>
  </div>);
}));

export default RightPanel;
