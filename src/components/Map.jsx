import React from 'react';
import { Menu, Icon } from 'antd';
import { inject } from 'mobx-react';
import cytoscape from 'cytoscape';
import { intersection } from 'lodash';

const SubMenu = Menu.SubMenu;

const colors = {
  contour: '#E12727',
  inside: '#F1AE9D',
  blue: '#3498db',
  orange: '#d35400',
  green: '#2ecc71',
  gray: '#7f8c8d',
  white: '#ffffff',
  red: '#e74c3c',
  dark: '#2c3e50',
  black: '#000000',
};

@inject('viewStore')
class Map extends React.Component {

  cy = null;

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
    console.log("mount")
    this.constructGraph();
    this.renderGraph();
  }

  componentDidUpdate() {
    console.log("update")
    this.clearGraph();
    this.renderGraph();
  }

  componentWillUnmount() {
    this.clearEvents();
  }

  clearEvents() {
    this.cy.off(['select', 'unselect', 'doubleTap']);
  }

  resetLayout() {
    this.cy.layout({
      name: 'breadthfirst',
      circle: true,
      avoidOverlap: true,
      roots: this.cy.$(`#${this.props.params.id}`),
    });
  }

  cytoStyleSheet = cytoscape.stylesheet()
    .selector('node')
    .css({
      height: 60,
      width: 60,
      'background-fit': 'cover',
      'border-width': 1,
      borderColor: colors.inside,
      marginBottom: '5px',
      // text style
      content: 'data(label)',
      'text-outline-width': 2,
      'text-outline-color': colors.contour,
      'text-margin-y': "-5px",
      'font-style': "'Open Sans', sans-serif",
      color: '#fff'
    })
    .selector('node.root')
    .css({
      'border-width': 3,
      height: 60,
      width: 60,
    })
    .selector('node.employee')
    .css({
      'background-color': colors.white,
    })
    .selector('node.competence')
    .css({
      'background-color': colors.white,
      'background-image': 'url(/images/comp_icon.svg)',
    })
    .selector('node.employee.m')
    .css({
      'background-image': 'url(/images/man_icon.svg)',
    })
    .selector('node.employee.f')
    .css({
      'background-image': 'url(/images/woman_icon.svg)',
    })
    .selector('node:selected')
    .css({
      'border-width': 3,
      'border-color': colors.contour,
      'background-color': colors.inside,
    })
    .selector('edge')
    .css({
      width: 2,
      'line-color': colors.inside,
      'curve-style': 'bezier',
      // text style
      content: 'data(label)',
      'text-outline-width': 2,
      'text-outline-color': colors.contour,
      'edge-text-rotation': 'autorotate',
      color: colors.white,
    })

  createDoubleTapEvent() {
    let tappedBefore;
    let tappedTimeout;

    // create a doubleTap event
    this.cy.on('tap', (event) => {
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
  }

  addComp(data) {
    this.cy.add({
      group: 'nodes',
      classes: 'competence',
      data: {
        id: data.id,
        label: `${data.name}`,
        type: 'competence',
        details: data,
      },
    })
  }

  addEmploye(data) {
    this.cy.add({
      group: 'nodes',
      classes: `employee ${data.sex}`,
      data: {
        id: data.id,
        label: `${data.first_name} ${data.last_name}`,
        type: 'employee',
        details: data,
      },
    })
  }

  expandCompFromPeople(nodeData) {
    const competences = nodeData.competences

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
        }
      ]);
    }
  }

  expandPeopleFromComp(nodeData) {
    const employees = this.props.dataStore.getEmployeesWithCompetence(nodeData.id);

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
  }

  clearGraph() {
    this.cy.remove(this.cy.elements())
  }

  constructGraph() {

    /* START CY INIT */
    this.cy = cytoscape({
      container: document.getElementById('graph-container'),
      userPanningEnabled: false,
      pan: 'center',
      style: this.cytoStyleSheet,
      motionBlur: true,
    });

    this.cy.$(`#${this.props.params.id}`).addClass('root');

    this.resetLayout();
    /* END CY INIT */

    /* START CY EVENT MANAGER */
    this.cy.on('select', () => {
      this.props.viewStore.selectedNodes = this.cy.$(':selected').jsons().filter(e => e.group === 'nodes');
    });

    this.cy.on('unselect', () => {
      this.props.viewStore.selectedNodes = this.cy.$(':selected').jsons().filter(e => e.group === 'nodes');
    });

    this.createDoubleTapEvent()

    this.cy.on('doubleTap', 'node', (event) => {
      const nodeData = event.cyTarget.data();
      const nodeDetails = nodeData.details;

      switch (nodeData.type) {

        case 'employee': {
          this.props.router.push(`/employee/${nodeData.id}`)
          break;
        }

        case 'competence': {
          this.props.router.push(`/competence/${nodeData.id}`)
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
        return this.props.dataStore.getEmployee(this.props.params.id);
      }
      case 'competence': {
        return this.props.dataStore.getCompetence(this.props.params.id);
      }
      default:
        return this.props.dataStore.getEmployees(this.props.filters);
    }
  }

  constructLinkedData(data) {

    switch (this.props.params.type) {
      case 'employee': 
        this.addEmploye(data)
        this.expandCompFromPeople(data)
        break;
      case 'competence': 
        this.addComp(data)
        this.expandPeopleFromComp(data)
        break;
      // default is for the main map
      // nodes are employees and link are common competences between them
      default:
        for (let i = 0; i < data.length; i += 1) {
          this.addEmploye(data[i])
        }

        // for each node
        for (let i = 0; i < data.length; i += 1) {
          // check other next nodes
          for (let j = i + 1; j < data.length; j += 1) {

            // get competences in common
            const inter = intersection(
              data[j].competences.map(c => c.id),
              data[i].competences.map(c => c.id)
            );

            if (inter.length !== 0) {
              for (let k = 0; k < inter.length; k += 1) {
                const comp = this.props.dataStore.getCompetence(inter[k]);

                this.cy.add({
                  group: 'edges',
                  data: {
                    id: `${data[i].id}_${data[j].id}_${comp.name}`,
                    label: comp.name,
                    source: data[i].id,
                    target: data[j].id,
                  },
                });
              }
            }

          }
        }

        break;
    }
  }

  handleMenuClick(e) {
    if (this.cy) {
      switch (e.key) {
        case 'export:jpg': {
          // ugly solution due to the fact that HTML5 download tag not widely supported
          const link = document.createElement('a');
          link.href = this.cy.jpg();
          link.download = 'export.jpg';
          link.click();
          break;
        }
        case 'export:png': {
          const link = document.createElement('a');
          link.href = this.cy.png();
          link.download = 'export.png';
          link.click();
          break;
        }
        case 'export:svg': {
          alert('Not implemented yet');
          break;
        }
        case 'zoom:in': {
          this.cy.zoom(this.cy.zoom() * 1.1);
          this.cy.center();
          break;
        }
        case 'zoom:out': {
          this.cy.zoom(this.cy.zoom() / 1.1);
          this.cy.center();
          break;
        }
        case 'recenter': {
          this.cy.fit(10);
          break;
        }
        case 'back': {
          this.props.router.push('/');
          break;
        }
        default:
          break;
      }
    }
  }

  renderGraph() {
    this.constructLinkedData(this.fetchData());
    this.resetLayout()
  }

  render() {
    return (<div>
      <Menu mode="horizontal" onClick={this.handleMenuClick}>
        <SubMenu title={<span><Icon type="download" />Export</span>}>
          <Menu.Item key="export:jpg">To JPG</Menu.Item>
          <Menu.Item key="export:png">To PNG</Menu.Item>
          <Menu.Item key="export:svg">To SVG</Menu.Item>
        </SubMenu>
        <Menu.Item key="zoom:in">
          <Icon type="plus-circle-o" /> Zoom in
          </Menu.Item>
        <Menu.Item key="zoom:out">
          <Icon type="minus-circle-o" /> Zoom out
          </Menu.Item>
        <Menu.Item key="recenter">
          <Icon type="select" /> Fit to viewport
          </Menu.Item>
        {this.props.params.type && this.props.params.id &&
          <Menu.Item key="back" style={{ float: 'Right' }}>
            <Icon type="rollback" /> Back to main map
          </Menu.Item>}
      </Menu>
      <div id="graph-container" />
    </div>);
  }
}

export default Map;
