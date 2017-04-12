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
        this.schools = uniqBy(response.data.People.map(emp => emp.school), 'id');

        // When research groups are back :
        // uniqBy(response.data.employees.map(emp => emp.research_group), 'id');
        this.researchGroups = [];

        const uniqueKeywords = uniqBy(flatten(
          response.data.People.map(emp => (emp.keywords ? emp.keywords : []))
        ));

        const keywordMap = uniqueKeywords
          .reduce((acc, value, i) => ({ ...acc, [value.key]: i }), {});

        this.keywords = uniqueKeywords.map((value, i) => ({ key: value.key, id: i }));

        this.employees = response.data.People.map((emp) => {
          if (emp.keywords) {
            const newKeywords = emp.keywords
              .map(({ key }) => ({ id: keywordMap[key], key }));
            return { ...emp, keywords: newKeywords };
          }
          return Object.assign({}, emp, { keywords: [] });
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
