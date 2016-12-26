/* eslint react/prop-types: 0 */

import React from 'react';
import { inject, observer } from 'mobx-react';
import { Select, Button } from 'antd';

const Option = Select.Option;

@inject('dataStore') @observer
export default class Filters extends React.Component {
  render() {
    const { dataStore, params: { id, type } } = this.props;

    return !dataStore.isLoading && !id && !type && <div>
      <h2>Filters</h2>
      <p>Employees with competences:</p>
      <Select
        key="competence_filter"
        multiple
        style={{ width: '100%' }}
        placeholder="Select competence(s)"
        onChange={value => console.log(value)}
      >
        {dataStore.competences.map(
          c => <Option key={c.id} value={c.id.toString()}>{c.name}</Option>
        )}
      </Select>
      <br />
      <br />
      <Button key="reset_filter" type="dashed" onClick={() => dataStore.loadEmployees()}>Reset</Button>
    </div>;
  }
}

