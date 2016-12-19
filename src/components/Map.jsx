/* eslint react/prop-types: 0 */

import React from 'react';
import { Menu, Icon } from 'antd';
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

    this.handleMenuClick = this.handleMenuClick.bind(this);

    this.resetLayout = this.resetLayout.bind(this);
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
  cy = null;
  resetLayout() {
    this.cy.layout({
      name: 'breadthfirst',
      avoidOverlap: true,
      circle: true,
      fit: true,
      roots: this.cy.filter('.root'),
    });
  }
  constructGraph(data) {
    /* START CY INIT */
    this.cy = cytoscape({
      container: document.getElementById('graph-container'),
      userPanningEnabled: false,
      pan: 'center',
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
        .selector('.root')
        .css({
          'border-width': 3,
          height: 60,
          width: 60,
        })
        .selector(':selected')
        .css({
          'border-width': 3,
          'border-color': colors.blue,
          'text-outline-color': colors.blue,
        })
        .selector('.employee')
        .css({
          'background-color': colors.white,
        })
        .selector('.competence')
        .css({
          'background-color': colors.gray,
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
        // put depths in concentric circles if true, put depths top down if false
        circle: true,
      },
    });
    /* END CY INIT */
    this.cy.$(`#${this.props.params.id}`).addClass('root');

    /* START CY EVENT MANAGER */
    this.cy.on('select', () => {
      this.props.viewStore.selectedNodes = this.cy.$(':selected').jsons().filter(e => e.group === 'nodes');
    });
    this.cy.on('unselect', () => {
      this.props.viewStore.selectedNodes = this.cy.$(':selected').jsons().filter(e => e.group === 'nodes');
    });

    let tappedBefore;
    let tappedTimeout;
    this.cy.on('tap', (event) => {
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

    this.cy.on('doubleTap', 'node', (event) => {
      const nodeData = event.cyTarget.data();
      const nodeDetails = nodeData.details;
      switch (nodeData.type) {
        case 'employee': {
          const competences = nodeDetails.competences.filter(
            comp => comp.id !== parseInt(this.props.params.id, 10)
          );

          for (let i = 0; i < competences.length; i += 1) {
            this.cy.add([{
              group: 'nodes',
              classes: 'competence',
              data: {
                id: competences[i].id,
                label: `${competences[i].name}`,
                type: 'competence',
                details: competences[i],
              },
            }, {
              group: 'edges',
              data: {
                id: `${nodeData.id}_${competences[i].id}`,
                source: nodeData.id,
                target: competences[i].id,
              },
            }]);
          }
          break;
        }
        case 'competence': {
          const employees = this.props.employeeStore.getEmployeesWithCompetence(nodeData.id);

          for (let i = 0; i < employees.length; i += 1) {
            this.cy.add([{
              group: 'nodes',
              classes: `employee ${employees[i].sex}`,
              data: {
                id: employees[i].id,
                label: `${employees[i].first_name} ${employees[i].last_name}`,
                type: 'employee',
                details: employees[i],
              },
            }, {
              group: 'edges',
              data: {
                id: `${nodeData.id}_${employees[i].id}`,
                source: nodeData.id,
                target: employees[i].id,
              },
            }]);
          }
          break;
        }
        default: {
          break;
        }
      }
      this.cy.nodes().removeClass('root');
      event.cyTarget.addClass('root');
      this.resetLayout();
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
  handleMenuClick(e) {
    if (this.cy) {
      switch (e.key) {
        case 'export': {
          const url = this.cy.jpg().replace(/^data:image\/[^;]/, 'data:application/octet-stream');
          window.open(url);
          break;
        }
        case 'zoom_in': {
          this.cy.zoom(this.cy.zoom() * 1.1);
          this.cy.center();
          break;
        }
        case 'zoom_out': {
          this.cy.zoom(this.cy.zoom() / 1.1);
          this.cy.center();
          break;
        }
        default:
          break;
      }
    }
  }
  renderGraph() {
    if (this.props.params.id && this.props.params.type) {
      const data = this.constructLinkedData(this.fetchData());
      this.constructGraph(data);
    }
  }
  render() {
    return (this.props.params.id && this.props.params.type
      ? <div>
        <Menu mode="horizontal" onClick={this.handleMenuClick}>
          <Menu.Item key="export">
            <Icon type="download" /> Export
          </Menu.Item>
          <Menu.Item key="zoom_in">
            <Icon type="plus-circle-o" /> Zoom in
          </Menu.Item>
          <Menu.Item key="zoom_out">
            <Icon type="minus-circle-o" /> Zoom out
          </Menu.Item>
        </Menu>
        <div id="graph-container" />
      </div>
      : <h2>General mal not implemented yet, please select an employee</h2>);
  }
}

export default Map;
