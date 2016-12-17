/* eslint react/prop-types: 0 */

import React from 'react';
import { observer } from 'mobx-react';

import { Col } from 'antd';

import Map from './Map';
import Details from './Details';

@observer
class RightPanel extends React.Component {
  render() {
    const employeeStore = this.props.employeeStore;

    return (this.props.type && this.props.id
      ? <div>
        <Col span={12}>
          {!employeeStore.isLoading && <Map employees={employeeStore.getEmployees().slice()} type={this.props.type} id={this.props.id} />}
        </Col>
        <Col span={6}>
          <Details {...this.props} type={this.props.type} id={this.props.id} />
        </Col>
      </div>
      : <Col span={18}>
        <h2>General view not implemented yet.</h2>
      </Col>);
  }
}

export default RightPanel;
