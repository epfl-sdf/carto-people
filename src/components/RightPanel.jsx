import React from 'react';
import { observer, inject } from 'mobx-react';

import { Col } from 'antd';

import Map from './Map';
import Details from './Details';

const RightPanel = (props) => {
  const { dataStore, viewStore } = props;

  return (<div>
    <Col xs={24} sm={24} md={16} lg={16}>
      {!dataStore.isLoading
        && <Map
          dataStore={dataStore}
          filters={viewStore.filters}
          params={props.params}
          router={props.router}
          />}
    </Col>
    <Col xs={24} sm={24} md={4} lg={4} className="padded-col">
      <Details />
    </Col>
    <a href={`https://github.com/sdfepfl/javascript-boilerplate/commit/${__COMMIT_HASH__}`}>rev link</a>
  </div>);
};

export default inject('dataStore', 'viewStore')(observer(RightPanel));
