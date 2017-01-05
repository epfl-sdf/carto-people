import React from 'react';
import { inject, observer } from 'mobx-react';
import { Select } from 'antd';

const Option = Select.Option;
const OptGroup = Select.OptGroup;

@inject('dataStore') @observer
export default class SearchBar extends React.Component {
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
    const { dataStore } = this.props;
    const employees = dataStore.getEmployees().map(
      employee => <Option key={employee.id} value={JSON.stringify({ id: employee.id, type: 'employee' })}>{`${employee.first_name} ${employee.last_name}`}</Option>
    );
    const competences = dataStore.competences.map(
      competence => <Option key={competence.id} value={JSON.stringify({ id: competence.id, type: 'competence' })}>{competence.name}</Option>
    );

    return !dataStore.isLoading
      && <div>
        <h2>Search</h2>
        <Select
          showSearch
          size="large"
          style={{ width: '100%' }}
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
        </Select>
      </div>;
  }
}
