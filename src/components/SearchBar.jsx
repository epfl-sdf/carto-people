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

    this.setState({ selected: null });
  }
  render() {
    const { dataStore } = this.props;
    const employees = dataStore.getEmployees().map(
      employee => <Option key={employee.id} searchKey={`${employee.name} ${employee.lastname}`.toLowerCase()} value={JSON.stringify({ id: employee.id, type: 'employee' })}>{`${employee.name} ${employee.lastname}`}</Option>
    );
    const keywords = dataStore.keywords.map(
      competence => <Option key={competence.id} searchKey={competence.key.toLowerCase()} value={JSON.stringify({ id: competence.id, type: 'competence' })}>{competence.key}</Option>
    );

    return !dataStore.isLoading
      && <div>
        <h2>Search</h2>
        <Select
          showSearch
          size="large"
          style={{ width: '100%' }}
          onChange={this.handleChange}
          value={this.state.selected ? JSON.stringify(this.state.selected) : undefined}
          optionFilterProp="searchKey"
          placeholder="Search an employee or competence..."
        >
          <OptGroup label="Employees">
            {employees}
          </OptGroup>
          <OptGroup label="keywords">
            {keywords}
          </OptGroup>
        </Select>
      </div>;
  }
}
