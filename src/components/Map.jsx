/* eslint react/prop-types: 0 */

import React from 'react';
import { observer } from 'mobx-react';
import { find } from 'lodash';
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

@observer
class Map extends React.Component {
  constructor() {
    super();

    this.fetchData = this.fetchData.bind(this);
    this.constructLinkedData = this.constructLinkedData.bind(this);
  }
  componentDidMount() {
    const data = this.fetchData();

    /* START CY INIT */
    const cy = cytoscape({
      container: document.getElementById('graph-container'),
      autounselectify: true,
      style: cytoscape.stylesheet()
        .selector('node')
        .css({
          height: 60,
          width: 60,
          'background-fit': 'cover',
          'border-width': 2,
          padding: '20px',
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
      elements: this.constructLinkedData(data),
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
    cy.on('select', (e) => {
      console.log(e);
    });
    /* END CY EVENT MANAGER */
  }
  fetchData() {
    switch (this.props.type) {
      case 'employee': {
        return this.props.employees.find(employee => employee.id === parseInt(this.props.id, 10));
      }
      case 'competence': {
        return [];
      }
      default:
        return [];
    }
  }
  constructLinkedData(data) {
    const linkedDatas = [];

    switch (this.props.type) {
      case 'employee': {
        linkedDatas.push({
          group: 'nodes',
          classes: `employee ${data.sex}`,
          data: {
            id: data.id,
            details: data,
          },
        });

        for (let i = 0; i < data.competences.length; i += 1) {
          linkedDatas.push({
            group: 'nodes',
            classes: 'competence',
            data: {
              id: data.competences[i].id,
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
        break;
      }
      default:
        break;
    }

    return linkedDatas;
  }
  render() {
    return (<div id="graph-container" />);
  }
}

export default Map;
