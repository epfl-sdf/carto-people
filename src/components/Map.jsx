import React from 'react';
import { Menu, Icon } from 'antd';
import { inject } from 'mobx-react';
import { intersection } from 'lodash';

import GraphHelper from './GraphHelper';

const SubMenu = Menu.SubMenu;

@inject('viewStore')
class Map extends React.Component {

  graphHelper = new GraphHelper();

  constructor() {
    super();

    this.handleMenuClick = this.handleMenuClick.bind(this);
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
    this.graphHelper.clearGraph();
    this.renderGraph();
  }

  componentWillUnmount() {
    console.log(this.graphHelper)
    this.graphHelper.clearEvents();
  }

  constructGraph() {
    this.graphHelper.initGraph(this.props.params.id)

    this.graphHelper.setupEvents(
      () => {this.props.viewStore.selectedNodes = this.graphHelper.getSelectedNode();},
      () => {this.props.viewStore.selectedNodes = this.graphHelper.getSelectedNode();},
      (event) => {
        const nodeData = event.cyTarget.data();

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
      }
    )
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

  buildCompEdges(data) {
    // for each node
    for (let i = 0; i < data.length; i += 1) {
      // check other next nodes
      for (let j = i + 1; j < data.length; j += 1) {

        // get competences in common
        const inter = intersection(
          data[j].competences.map(c => c.id),
          data[i].competences.map(c => c.id)
        );

        // build edge per intersecting competences
        if (inter.length !== 0) {
          for (let k = 0; k < inter.length; k += 1) {
            const comp = this.props.dataStore.getCompetence(inter[k]);
            this.graphHelper.addCompEdge(comp, data[i], data[j])
          }
        }

      }
    }
  }

  constructLinkedData(data) {

    switch (this.props.params.type) {
      case 'employee': {
        this.graphHelper.addEmploye(data)
        this.graphHelper.expandCompFromPeople(data)
        break;
      }
      case 'competence': {
        this.graphHelper.addComp(data)
        this.graphHelper.expandPeopleFromComp(data, this.props.dataStore)
        break;
      }
      // default is for the main map
      // nodes are employees and link are common competences between them
      default: {
        
        for (let i = 0; i < data.length; i += 1) {
          this.graphHelper.addEmploye(data[i])
        }

        this.buildCompEdges(data)

        break;
      }
    }
  }

  handleMenuClick(e) {
    switch (e.key) {
      case 'export:jpg': {
        // ugly solution due to the fact that HTML5 download tag not widely supported
        const link = document.createElement('a');
        link.href = this.graphHelper.getJpg();
        link.download = 'export.jpg';
        link.click();
        break;
      }
      case 'export:png': {
        const link = document.createElement('a');
        link.href = this.graphHelper.getPng();
        link.download = 'export.png';
        link.click();
        break;
      }
      case 'export:svg': {
        alert('Not implemented yet');
        break;
      }
      case 'zoom:in': {
        this.graphHelper.zoom(1.1);
        break;
      }
      case 'zoom:out': {
        this.graphHelper.zoom(1 / 1.1);
        break;
      }
      case 'recenter': {
        this.graphHelper.recenter();
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

  renderGraph() {
    this.constructLinkedData(this.fetchData());
    this.graphHelper.resetLayout()
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
