import React from 'react';
import { Menu, Icon, Col, Row } from 'antd';
import { inject } from 'mobx-react';
import { intersectionBy, intersection } from 'lodash';

import GraphHelper from './GraphHelper';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

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
    this.constructGraph();
    this.renderGraph(!this.props.params.type);
  }

  componentDidUpdate(prevProps) {
    if (this.props.viewStore.changedFilters || prevProps.params !== this.props.params) {
      this.graphHelper.clearGraph();
      this.renderGraph(!this.props.params.type);
      this.props.viewStore.changedFilters = false;
    }
  }

  componentWillUnmount() {
    this.graphHelper.clearEvents();
  }

  constructGraph() {
    this.graphHelper.initGraph(this.props.params.id);

    this.graphHelper.setupEvents(
      (event) => {
        const selected = event.cyTarget.data();
        if (selected.type === 'link') {
          this.props.viewStore.selectedComps = this.graphHelper.getSelectedEdges();
        } else {
          this.props.viewStore.selectedNodes = this.graphHelper.getSelectedNode();
        }
      },
      () => { this.props.viewStore.selectedNodes = this.graphHelper.getSelectedNode(); },
      (event) => {
        const nodeData = event.cyTarget.data();

        switch (nodeData.type) {
          case 'employee': {
            this.props.router.push(`/employee/${nodeData.id}`);
            break;
          }
          case 'competence': {
            this.props.router.push(`/competence/${nodeData.id}`);
            break;
          }
          default: {
            break;
          }
        }
      }
    );
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

  buildCompEdges(data, keywords) {
    const edges = []
    // for each node
    for (let i = 0; i < data.length; i += 1) {
      // check other next nodes
      for (let j = i + 1; j < data.length; j += 1) {
        // get keywords in common
        const inter = intersectionBy(
          data[j].keywords,
          data[i].keywords,
          'id'
        );
        // build edge per intersecting keywords
        if (inter.length !== 0) {
          console.log(i, j);
          const hasKey = !keywords ? false : inter.some(r => keywords.includes(r.key));
          edges.push(this.graphHelper.getEdge(inter.map(r => r.key), data[i], data[j], hasKey));
        }
      }
    }
    this.graphHelper.addEdges(edges);
  }

  constructLinkedData(data) {
    switch (this.props.params.type) {
      case 'employee': {
        this.graphHelper.addEmploye(data);
        this.graphHelper.expandCompFromPeople(data);
        break;
      }
      case 'competence': {
        this.graphHelper.addComp(data);
        this.graphHelper.expandPeopleFromComp(data, this.props.filters, this.props.dataStore);
        break;
      }
      // default is for the main map
      // nodes are employees and link are common keywords between them
      default: {
        for (let i = 0; i < data.length; i += 1) {
          this.graphHelper.addEmploye(data[i]);
        }

        this.buildCompEdges(data, this.props.keywords);

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
        this.props.router.goBack();
        break;
      }
      case 'forward': {
        this.props.router.goForward();
        break;
      }
      case 'Origin': {
        this.props.router.push('/');
        break;
      }
      default:
        break;
    }
  }

  renderGraph(big) {
    this.constructLinkedData(this.fetchData());
    this.graphHelper.resetLayout(big);
  }

  render() {
    return (<div>
      <Row>
        <Col span={24} className="menu">
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
              <Icon type="select" /> Fit to view
          </Menu.Item>
            <Menu.Item key="back">
              <Icon type="arrow-left" /> Previous
          </Menu.Item>
            <Menu.Item key="forward">
              <Icon type="arrow-right" /> Forward
          </Menu.Item>
            {this.props.params.type && this.props.params.id &&
            <Menu.Item key="Origin" style={{ float: 'Right' }}>
              <Icon type="rollback" /> Back to main map
            </Menu.Item>}
          </Menu>
        </Col>
      </Row>
      <Row>
        <Col><div id="graph-container" /></Col>
      </Row>
    </div>);
  }
}

export default Map;
