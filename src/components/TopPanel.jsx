/* eslint react/prop-types: 0 */

import React from 'react';
import { inject, observer } from 'mobx-react';

import { AutoComplete, Col } from 'antd';

const Option = AutoComplete.Option;

@inject('employeeStore') @observer
export default class TopPanel extends React.Component {
  constructor() {
    super();
    this.state = { selected: null };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(selected) {
    if (selected) {
      this.props.router.push(`/employee/${selected}`);
    } else {
      this.props.router.push('/');
    }
  }
  render() {
    const employeeStore = this.props.employeeStore;

    const children = employeeStore.getEmployees().map(
      employee => <Option key={employee.id}>{`${employee.first_name} ${employee.last_name}`}</Option>
    );

    return (<div>
      <Col span={6}>
        <h1>Carto boilerplate</h1>
      </Col>
      <Col span={12}>
        {!employeeStore.isLoading
          && <AutoComplete size="large" style={{ width: 200 }} onChange={this.handleChange} placeholder="Search an employee...">
            {children}
          </AutoComplete>}
      </Col>
      <Col span={6}>
        <h2>Instructions</h2>
        <ul>
          <li>Select multiple nodes by pressing Cltr or Shift and then click and drag your mouse.</li>
          <li>Once one or multiple nodes are selected, you can expand them by clicking "expand" on the right panel.</li>
          <li>You can also double click on a node to expand it.</li>
        </ul>
      </Col>
    </div>);
  }
}
