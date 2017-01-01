import { observable, action, computed } from 'mobx';
import { flatten, uniqBy } from 'lodash';
import axios from 'axios';

export default class DataStore {
  @observable employees = [];
  @observable competences = [];
  @observable researchGroups = [];
  @observable schools = [];

  constructor() {
    this.loadEmployees();
  }

  @computed get isLoading() {
    return this.employees.length === 0 || this.competences.length === 0;
  }

  @action loadEmployees() {
    axios.get('/data/sample.json')
      .then((response) => {
        this.schools = uniqBy(flatten(response.data.employees.map(emp => emp.school)), 'id');
        this.researchGroups = uniqBy(flatten(response.data.employees.map(emp => emp.research_group)), 'id');
        this.competences = uniqBy(flatten(response.data.employees.map(emp => emp.competences)), 'id');
        this.employees = response.data.employees;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getEmployees(filters = []) {
    let ret = [...this.employees]; // Copy an array like this.employees.slice()
    for (let i = 0; i < filters.length; i += 1) {
      ret = ret.filter(filters[i]);
    }

    return ret;
  }

  getEmployee(employeeId) {
    return this.employees.find(e => e.id === parseInt(employeeId, 10));
  }

  getEmployeesWithCompetence(competenceId) {
    return this.employees.filter(
      e => e.competences.map(c => c.id).includes(parseInt(competenceId, 10))
    );
  }

  getCompetence(id) {
    return this.competences.find(c => c.id === parseInt(id, 10));
  }
}
