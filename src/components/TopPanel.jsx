/* eslint react/prop-types: 0 */

import React from 'react';
import { observer } from 'mobx-react';

import { AutoComplete, Col } from 'antd';

const Option = AutoComplete.Option;

@observer
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
      <Col span={18}>
        {!employeeStore.isLoading
          && <AutoComplete style={{ width: 200 }} onChange={this.handleChange} placeholder="Search person or competence...">
            {children}
          </AutoComplete>}
      </Col>
    </div>);
  }
}
