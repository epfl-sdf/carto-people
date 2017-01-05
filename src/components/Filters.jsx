import React from 'react';
import { inject, observer } from 'mobx-react';
import { Select } from 'antd';

const Option = Select.Option;

@inject('dataStore', 'viewStore') @observer
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
        placeholder="Select the competence(s)"
        onChange={(selected) => { this.props.viewStore.filters = { type: 'competences', selected }; }}
      >
        {dataStore.competences.map(
          c => <Option key={c.id} value={c.id.toString()}>{c.name}</Option>
        )}
      </Select>
      <br />
      <br />
      <p>Employees in research group:</p>
      <Select
        allowClear
        key="research_group_filter"
        style={{ width: '100%' }}
        placeholder="Select the research group"
        onChange={(selected) => { this.props.viewStore.filters = { type: 'research_group', selected }; }}
      >
        {dataStore.researchGroups.map(
          r => <Option key={r.id} value={r.id.toString()}>{r.name}</Option>
        )}
      </Select>
      <br />
      <br />
      <p>Employees in school:</p>
      <Select
        allowClear
        key="school_filter"
        style={{ width: '100%' }}
        placeholder="Select the school"
        onChange={(selected) => { this.props.viewStore.filters = { type: 'school', selected }; }}
      >
        {dataStore.schools.map(
          s => <Option key={s.id} value={s.id.toString()}>{s.name}</Option>
        )}
      </Select>
    </div>;
  }
}

