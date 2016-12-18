/* eslint react/prop-types: 0 */

import React from 'react';
import { observer, inject } from 'mobx-react';

import { Col } from 'antd';

import Map from './Map';
import Details from './Details';

@inject('employeeStore', 'competenceStore') @observer
class RightPanel extends React.Component {
  render() {
    const { employeeStore, competenceStore } = this.props;
    return (<div>
      <Col span={12}>
        {!employeeStore.isLoading && !competenceStore.isLoading
          && <Map
            employeeStore={employeeStore}
            competenceStore={competenceStore}
            params={this.props.params}
            router={this.props.router}
          />}
      </Col>
      <Col span={6}>
        <Details {...this.props} />
      </Col>
    </div>);
  }
}

export default RightPanel;
