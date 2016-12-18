/* eslint react/prop-types: 0 */

import React from 'react';
import { inject } from 'mobx-react';
import cytoscape from 'cytoscape';

const colors = {
  blue: '#3498db',
  orange: '#d35400',
  green: '#2ecc71',
  gray: '#7f8c8d',
  white: '#ecf0f1',
  red: '#e74c3c',
  dark: '#2c3e50',
  black: '#000000',
};

@inject('viewStore')
class Map extends React.Component {
  constructor() {
    super();

    this.renderGraph = this.renderGraph.bind(this);
    this.constructGraph = this.constructGraph.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.constructLinkedData = this.constructLinkedData.bind(this);
  }
  componentDidMount() {
    this.renderGraph();
  }
  componentDidUpdate() {
    this.renderGraph();
  }
  renderGraph() {
    if (this.props.params.id && this.props.params.type) {
      const data = this.constructLinkedData(this.fetchData());
      this.constructGraph(data);
    }
  }
  constructGraph(data) {
    /* START CY INIT */
    const cy = cytoscape({
      container: document.getElementById('graph-container'),
      panningEnabled: false,
      style: cytoscape.stylesheet()
        .selector('node')
        .css({
          height: 40,
          width: 40,
          'background-fit': 'cover',
          'border-color': colors.black,
          'border-width': 2,
          padding: '20px',
          'text-size': '20pt',
          content: 'data(label)',
          'text-outline-width': 2,
          'text-outline-color': colors.black,
          color: '#fff',
        })
        .selector(':selected')
        .css({
          'border-width': 3,
          'border-color': colors.blue,
          'text-outline-color': colors.blue,
        })
        .selector('.employee')
        .css({
          'background-color': '#ecf0f1',
        })
        .selector('.competence')
        .css({
          'background-color': '#95a5a6',
          'background-image': 'url(/images/brain.svg)',
        })
        .selector('.employee.m')
        .css({
          'background-image': 'url(/images/m.svg)',
        })
        .selector('.employee.f')
        .css({
          'background-image': 'url(/images/f.svg)',
        })
        .selector('edge')
        .css({
          width: 2,
          'target-arrow-shape': 'triangle',
          'line-color': '#000000',
          'target-arrow-color': '#000000',
          'curve-style': 'bezier',
        }),
      elements: data,
      layout: {
        // The breadthfirst layout puts nodes in a hierarchy,
        // based on a breadthfirst traversal of the graph.
        name: 'breadthfirst',
        // whether the tree is directed downwards (or edges can point in any direction if false)
        directed: true,
        // prevents node overlap, may overflow boundingBox if not enough space
        avoidOverlap: true,
        // put depths in concentric circles if true, put depths top down if false
        circle: true,
      },
    });
    /* END CY INIT */

    /* START CY EVENT MANAGER */
    cy.on('select', () => {
      this.props.viewStore.selectedNodes = cy.$(':selected').jsons().filter(e => e.group === 'nodes');
    });

    let tappedBefore;
    let tappedTimeout;
    cy.on('tap', (event) => {
      // create a doubleTap event
      const tappedNow = event.cyTarget;
      if (tappedTimeout && tappedBefore) {
        clearTimeout(tappedTimeout);
      }
      if (tappedBefore === tappedNow) {
        tappedNow.trigger('doubleTap');
        tappedBefore = null;
      } else {
        tappedTimeout = setTimeout(() => { tappedBefore = null; }, 300);
        tappedBefore = tappedNow;
      }
    });

    cy.on('doubleTap', 'node', (event) => {
      const nodeData = event.cyTarget.data();

      this.props.router.push(`/${nodeData.type}/${nodeData.id}`);
    });

    /* END CY EVENT MANAGER */
  }
  fetchData() {
    switch (this.props.params.type) {
      case 'employee': {
        return this.props.employeeStore.getEmployee(this.props.params.id);
      }
      case 'competence': {
        return this.props.competenceStore.getCompetence(this.props.params.id);
      }
      default:
        return [];
    }
  }
  constructLinkedData(data) {
    const linkedDatas = [];

    switch (this.props.params.type) {
      case 'employee': {
        linkedDatas.push({
          group: 'nodes',
          classes: `employee ${data.sex}`,
          data: {
            id: data.id,
            label: `${data.first_name} ${data.last_name}`,
            type: 'employee',
            details: data,
          },
        });

        // iterate through competences for the given employee and add a node + edge
        for (let i = 0; i < data.competences.length; i += 1) {
          linkedDatas.push({
            group: 'nodes',
            classes: 'competence',
            data: {
              id: data.competences[i].id,
              label: `${data.competences[i].name}`,
              type: 'competence',
              details: data.competences[i],
            },
          });

          linkedDatas.push({
            group: 'edges',
            data: {
              id: `${data.id}_${data.competences[i].id}`,
              source: data.id,
              target: data.competences[i].id,
            },
          });
        }
        break;
      }
      case 'competence': {
        linkedDatas.push({
          group: 'nodes',
          classes: 'competence',
          data: {
            id: data.id,
            label: `${data.name}`,
            type: 'competence',
            details: data,
          },
        });

        const employees = this.props.employeeStore.getEmployeesWithCompetence(this.props.params.id);
        // iterate through employees for the given competence and add a node + edge
        for (let i = 0; i < employees.length; i += 1) {
          linkedDatas.push({
            group: 'nodes',
            classes: `employee ${employees[i].sex}`,
            data: {
              id: employees[i].id,
              label: `${employees[i].first_name} ${employees[i].last_name}`,
              type: 'employee',
              details: employees[i],
            },
          });

          linkedDatas.push({
            group: 'edges',
            data: {
              id: `${data.id}_${employees[i].id}`,
              source: data.id,
              target: employees[i].id,
            },
          });
        }
        break;
      }
      default:
        break;
    }

    return linkedDatas;
  }
  render() {
    return (this.props.params.id && this.props.params.type
      ? <div id="graph-container" />
      : <h2>General mal not implemented yet, please select an employee</h2>);
  }
}

export default Map;
