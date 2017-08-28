import React from 'react';
import { inject, observer } from 'mobx-react';
import { Select } from 'antd';

const Option = Select.Option;

const Filters = ({ viewStore, dataStore, params: { id, type } }) => !dataStore.isLoading && (!type || type === 'competence') && <div>
  <h2>Filters</h2>
    {!type && <div><h4>keywords:</h4>
      <Select
        showSearch
        key="competence_filter"
        mode="multiple"
        style={{ width: '100%' }}
        placeholder="Select the competence(s)"
        onChange={(selected) => { viewStore.filters = { type: 'keywords', selected }; }}
      >
        {dataStore.keywords.map(
        c => <Option key={c.id} searchKey={c.key} value={c.key}>{c.key}</Option>
      )}
      </Select></div>}
  <br />
  <br />
  <h4>Instituts:</h4>
  <Select
    mode="multiple"
    allowClear
    key="research_group_filter"
    style={{ width: '100%' }}
    placeholder="Select the research group"
    onChange={(selected) => { viewStore.filters = { type: 'researchGroups', selected }; }}
  >
    {dataStore.researchGroups.map(
        r => <Option key={r.id} value={r.id.toString()}>{r.key}</Option>
      )}
  </Select>
  <br />
  <br />
  <h4>Schools:</h4>
  <Select
    mode="multiple"
    allowClear
    key="school_filter"
    style={{ width: '100%' }}
    placeholder="Select the school"
    onChange={(selected) => { viewStore.filters = { type: 'school', selected }; }}
  >
    {dataStore.schools.map(
        s => <Option key={s.id} value={s.id.toString()}>{s.name}</Option>
      )}
  </Select>
  <br />
    {viewStore.selectedComps.length > 0 &&
    <div>
      <br />
      <h4>Selected link keywords</h4>
      <ul>
        {viewStore.selectedComps.map(c => <li>{c}</li>)}
      </ul>
    </div>
    }
  </div>;

export default inject('dataStore', 'viewStore')(observer(Filters));
