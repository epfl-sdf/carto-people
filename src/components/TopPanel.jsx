/* eslint react/prop-types: 0 */

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Select, Col } from 'antd';

const Option = Select.Option;
const OptGroup = Select.OptGroup;

@inject('employeeStore', 'competenceStore') @observer
export default class TopPanel extends React.Component {
  constructor() {
    super();
    this.state = { selected: null };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(selected) {
    const selectedItem = JSON.parse(selected);

    if (selected) {
      this.props.router.push(`/${selectedItem.type}/${selectedItem.id}`);
    } else {
      this.props.router.push('/');
    }
  }
  render() {
    const { employeeStore, competenceStore } = this.props;

    const employees = employeeStore.getEmployees().map(
      employee => <Option key={employee.id} value={JSON.stringify({ id: employee.id, type: 'employee' })}>{`${employee.first_name} ${employee.last_name}`}</Option>
    );
    const competences = competenceStore.getCompetences().map(
      competence => <Option key={competence.id} value={JSON.stringify({ id: competence.id, type: 'competence' })}>{competence.name}</Option>
    );

    return (<div>
      <Col span={4}>
        <h1>Carto boilerplate</h1>
      </Col>
      <Col span={14}>
        {!employeeStore.isLoading
          && <Select
            showSearch
            size="large"
            style={{ width: '350px', paddingTop: '20px' }}
            onChange={this.handleChange}
            optionFilterProp="children"
            placeholder="Search an employee or competence..."
          >
            <OptGroup label="Employees">
              {employees}
            </OptGroup>
            <OptGroup label="Competences">
              {competences}
            </OptGroup>
          </Select>}
      </Col>
      <Col span={6}>
        <h2>Instructions</h2>
        <ul>
          <li>Once one or multiple nodes are selected, you can expand them by clicking "expand" on the right panel.</li>
          <li>You can also double click on a node to expand it.</li>
        </ul>
      </Col>
    </div>);
  }
}
