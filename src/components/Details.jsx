/* eslint react/prop-types: 0 */

import React from 'react';
import { Link } from 'react-router';
import { observer, inject } from 'mobx-react';

@inject('viewStore') @observer
class Details extends React.Component {
  render() {
    const nodeLists = {
      employee: [],
      competence: [],
    };

    for (let i = 0; i < this.props.viewStore.selectedNodes.length; i += 1) {
      nodeLists[this.props.viewStore.selectedNodes[i].data.type].push(this.props.viewStore.selectedNodes[i].data);
    }

    return (<div>
      <h2>Selection details</h2>
      <h3>Employees</h3>
      <ul>
        {nodeLists.employee.map(e => <li key={e.id}>{`${e.details.first_name} ${e.details.last_name}`} - <Link to={`/employee/${e.id}`}>expand</Link></li>)}
      </ul>
      <h3>Competences</h3>
      <ul>
        {nodeLists.competence.map(c => <li key={c.id}>{c.details.name} - <Link to={`/competence/${c.id}`}>expand</Link></li>)}
      </ul>
    </div>);
  }
}

export default Details;
