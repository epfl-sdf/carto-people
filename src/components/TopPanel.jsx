/* eslint react/prop-types: 0 */

import React from 'react';
import { AutoComplete, Col } from 'antd';
import axios from 'axios';

const Option = AutoComplete.Option;

export default class TopPanel extends React.Component {
  constructor() {
    super();
    this.state = { data: [], selected: null };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    axios.get('/data/sample.json')
      .then((response) => {
        this.setState({ data: response.data.employees });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleChange(selected) {
    if (selected) {
      this.props.router.push(`/employee/${selected}`);
    } else {
      this.props.router.push('/');
    }
  }
  render() {
    const children = this.state.data.map(
      employee => <Option key={employee.id}>{`${employee.first_name} ${employee.last_name}`}</Option>
    );

    return (<div>
      <Col span={6}>
        <h1>Carto boilerplate</h1>
      </Col>
      <Col span={28}>
        <AutoComplete style={{ width: 200 }} onChange={this.handleChange} placeholder="Search person or competence...">
          {children}
        </AutoComplete>
      </Col>
    </div>);
  }
}
