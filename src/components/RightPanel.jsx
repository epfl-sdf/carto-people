import React from 'react';
import { observer, inject } from 'mobx-react';

import { Col } from 'antd';

import Map from './Map';
import Card from './Card';

const RightPanel = (props) => {
  const { dataStore, viewStore } = props;

  const employes = dataStore.getEmployees(viewStore.filters);
  let finalOrder;
  if (viewStore.selectedNodes.length >= 1 && viewStore.selectedNodes[0].classes.includes('employee')) {
    const selected = viewStore.selectedNodes.map(s => s.data.details);
    const others = employes.filter(emp => selected.every(s => s.id !== emp.id));
    finalOrder = selected.concat(others);
  } else {
    finalOrder = employes;
  }

  return (<div>
    <Col xs={24} sm={24} md={15} lg={15}>
      {!dataStore.isLoading
        && <Map
          dataStore={dataStore}
          filters={viewStore.filters}
          keywords={viewStore.keywords}
          params={props.params}
          router={props.router}
        />}
    </Col>
    <Col xs={24} sm={24} md={5} lg={5} className="padded-col cover">
      {!dataStore.isLoading
        && finalOrder.map(employe => <Card key={employe.id} {...{ employe }} />)
      }
    </Col>
    <a href={`https://github.com/sdfepfl/javascript-boilerplate/commit/${__COMMIT_HASH__}`}>rev link</a>
  </div>);
};

export default inject('dataStore', 'viewStore')(observer(RightPanel));
