/* eslint react/prop-types: 0 */

import React from 'react';
import go from 'gojs';
import axios from 'axios';
import { find } from 'lodash';

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

class Map extends React.Component {
  constructor() {
    super();
    this.fetchData = this.fetchData.bind(this);
    this.constructLinkedData = this.constructLinkedData.bind(this);
  }
  componentDidMount() {
    const $ = go.GraphObject.make;
    const myDiagram = $(go.Diagram, 'graph-container',
      { // automatically scale the diagram to fit the viewport's size
        initialAutoScale: go.Diagram.Uniform,
        // start everything in the middle of the viewport
        initialContentAlignment: go.Spot.Center,
        // disable user copying of parts
        allowCopy: false,
        'undoManager.isEnabled': true,
        'animationManager.isEnabled': false,
        maxSelectionCount: 1,
      });

    myDiagram.nodeTemplate =
      $(go.Node, 'Vertical',
        $(go.TextBlock, // the text label
          new go.Binding('text', 'node_text')),
        $(go.Panel, 'Table',
          $(go.Shape,
            { strokeWidth: 2, stroke: colors.black, width: 60, height: 60 },
            new go.Binding('figure', 'shape'),
            new go.Binding('fill', 'color')),
          $(go.Picture, // the icon showing the logo
            { desiredSize: new go.Size(40, 40) },
            new go.Binding('source', 'node_image')))
      );

    myDiagram.linkTemplate =
      $(go.Link,
        {
          selectable: false, // links cannot be selected by the user
          curve: go.Link.Bezier,
          layerName: 'Background', // don't cross in front of any nodes
        },
        $(go.Shape, { strokeWidth: 1.5 }),
        $(go.Shape, { toArrow: 'Standard' })
      );

    this.fetchData((data) => {
      // the array of link data objects: the relationships between the nodes
      const dataArrays = this.constructLinkedData(data);
      // create the model and assign it to the Diagram
      myDiagram.model = new go.GraphLinksModel(dataArrays.nodeDataArray, dataArrays.linkDataArray);
    });
  }
  fetchData(callback) {
    axios.get('/data/sample.json')
      .then((response) => {
        switch (this.props.type) {
          case 'employee': {
            const employee = find(response.data.employees, { id: parseInt(this.props.id, 10) });
            callback(employee);
            break;
          }
          case 'competence': {
            break;
          }
          default:
            break;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  constructLinkedData(data) {
    const linkDataArray = [];
    const nodeDataArray = [];

    switch (this.props.type) {
      case 'employee': {
        nodeDataArray.push({
          key: data.id,
          node_text: `${data.first_name} ${data.last_name}`,
          node_image: `/images/${data.sex}.svg`,
          color: colors.blue,
          shape: 'Ellipse',
        });

        for (let i = 0; i < data.competences.length; i += 1) {
          linkDataArray.push({
            from: data.id,
            to: data.competences[i].id,
          });

          nodeDataArray.push({
            key: data.competences[i].id,
            node_text: data.competences[i].name,
            node_image: '/images/brain.svg',
            color: colors.red,
            shape: 'Rectangle',
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

    return { linkDataArray, nodeDataArray };
  }
  render() {
    return (<div id="graph-container" />);
  }
}

export default Map;
