import React from 'react';
import { inject, observer } from 'mobx-react';
import { Checkbox, Row, Col } from 'antd';

@inject('viewStore', 'dataStore')
@observer
class CompList extends React.Component {

  onChange(checkedValues) {
    console.log('checked = ', checkedValues);
  }

  render() {
    const { dataStore, viewStore } = this.props;
    const employes = dataStore.getEmployees(viewStore.filters);
    console.log(employes);
    const keywords = dataStore.keywords;
    console.log('keywords:', keywords.map(
            ({ val, id }) => <Col key={id} span={8}><Checkbox value={id}>{val}</Checkbox></Col>
          ));

    return (<Checkbox.Group onChange={this.onChange}>
      <Row>
        {
          keywords.map(
            ({ val, id }) => <Col key={id} span={8}><Checkbox value={id}>{val}</Checkbox></Col>
          )
        }
      </Row>
    </Checkbox.Group>);
  }
}

export default CompList;
