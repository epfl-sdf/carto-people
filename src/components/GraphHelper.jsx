import cytoscape from 'cytoscape';

const colors = {
  contour: '#E12727',
  inside: '#F1AE9D',
  lines: '#C0BAB9',
  lines2: '#F3E2DE',
  blue: '#3498db',
  orange: '#d35400',
  green: '#2ecc71',
  gray: '#EAEAEA',
  white: '#ffffff',
  red: '#e74c3c',
  dark: '#2c3e50',
  black: '#000000',
};

export default class GraphHelper {
  cy = null

  constructor() {
  }

  initGraph(rootid) {
    this.cy = cytoscape({
      container: document.getElementById('graph-container'),
      userPanningEnabled: false,
      pan: 'center',
      style: this.cytoStyleSheet,
      motionBlur: true,
    });

    this.cy.$(`#${rootid}`).addClass('root');

    this.resetLayout();
  }

  recenter() {
    this.cy.fit(10);
  }

  zoom(coef) {
    this.cy.zoom(this.cy.zoom() * coef);
    this.cy.center();
  }

  getPng() {
    this.cy.png();
  }

  getJpg() {
    this.cy.jpg();
  }

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

  setupEvents(onSelect, onUnSelect, onDoubleTap) {
    this.createDoubleTapEvent()
    this.cy.on('select', onSelect);
    this.cy.on('unselect', onUnSelect);
    this.cy.on('doubleTap', 'node', onDoubleTap);
  }

  clearEvents() {
    this.cy.off(['select', 'unselect', 'doubleTap']);
  }

  resetLayout(rootid) {
    this.cy.layout({
      name: 'breadthfirst',
      circle: true,
      avoidOverlap: true,
      roots: this.cy.$(`#${rootid}`),
    });
  }

  addCompEdge(comp, data1, data2) {
    this.cy.add({
      group: 'edges',
      data: {
        id: `${data1.id}_${data2.id}_${comp.name}`,
        label: comp.name,
        source: data1.id,
        target: data2.id,
      },
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

  expandPeopleFromComp(nodeData, dataStore) {
    const employees = dataStore.getEmployeesWithCompetence(nodeData.id);

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

  getSelectedNode() {
    return this.cy.$(':selected').jsons().filter(e => e.group === 'nodes');
  }

  clearGraph() {
    this.cy.remove(this.cy.elements())
  }

  cytoStyleSheet = cytoscape.stylesheet()
    .selector('node')
    .css({
      height: 60,
      width: 60,
      'border-width': 4,
      'background-fit': 'cover',
      borderColor: colors.inside,
      marginBottom: '5px',
      // text style
      content: 'data(label)',
      // 'text-outline-width': 2,
      // 'text-outline-color': colors.contour,
      'text-margin-y': "-5px",
      'font-style': "'Open Sans', sans-serif",
      color: colors.contour,
      "font-size": 24,
    })
    .selector('node.root')
    .css({
      'border-width': 4,
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
      width: 3,
      'line-color': colors.gray,
      'curve-style': 'bezier',
      // text style
      content: 'data(label)',
      'letter-spacing': '3px',
      //'text-outline-width': 1,
      //'text-outline-color': colors.contour,
      'edge-text-rotation': 'autorotate',
      color: colors.contour,
      "font-size": 24,
    })


}