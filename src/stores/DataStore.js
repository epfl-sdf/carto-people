import { observable, action, computed } from 'mobx';
import { flatten, uniqBy } from 'lodash';
import axios from 'axios';

export default class DataStore {
  @observable employees = [];
  @observable keywords = [];
  @observable researchGroups = [];
  @observable schools = [];

  constructor() {
    this.loadEmployees();
  }

  @computed get isLoading() {
    return this.employees.length === 0;
  }

  @action loadEmployees() {
    axios.get('/data/realTest.json')
      .then((response) => {
        const uniqSchools = uniqBy(response.data.People.map(emp => emp.school), 'name');
        const schoolMap = uniqSchools
          .reduce((acc, value, i) => ({ ...acc, [value.name]: i }), {});
        this.schools = uniqSchools.map((value, i) => ({ name: value.name, id: i }));

        const uniqueRG = uniqBy(flatten(
          response.data.People.map(emp => (emp.research_group ? emp.research_group : []))
        ), 'key');

        const rgMap = uniqueRG
          .reduce((acc, value, i) => ({ ...acc, [value.key]: i + 2000 }), {});

        this.researchGroups = uniqueRG.map((value, i) => ({ key: value.key, id: i + 2000 }));

        const uniqueKeywords = uniqBy(flatten(
          response.data.People.map(emp => (emp.keywords ? emp.keywords : []))
        ), 'key');

        const keywordMap = uniqueKeywords
          .reduce((acc, value, i) => ({ ...acc, [value.key]: i + 1000 }), {});

        this.keywords = uniqueKeywords.map((value, i) => ({ key: value.key, id: i + 1000 }));

        this.employees = response.data.People.map((emp) => {
          let newRG = [];
          let newKeywords = [];
          let school = {};

          if (emp.research_group) {
            newRG = emp.research_group
              .map(({ key }) => ({ id: rgMap[key], key }));
          }

          if (emp.school) {
            school = { id: schoolMap[emp.school.name], name: emp.school.name };
          }

          if (emp.keywords) {
            newKeywords = emp.keywords
              .map(({ key }) => ({ id: keywordMap[key], key }));
          }
          return { ...emp, keywords: newKeywords, researchGroups: newRG, school };
        });
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
      e => e.keywords.map(c => c.id).includes(parseInt(competenceId, 10))
    );
  }

  getCompetence(id) {
    return this.keywords.find(c => c.id === parseInt(id, 10));
  }
}
