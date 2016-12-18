import { observable, action, computed } from 'mobx';
import axios from 'axios';

export default class EmployeeStore {
  @observable employees = [];

  constructor() {
    this.loadEmployees();
  }

  @computed get isLoading() {
    return this.employees.length === 0;
  }

  @action loadEmployees() {
    axios.get('/data/sample.json')
      .then((response) => {
        this.employees = response.data.employees;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getEmployees() {
    return this.employees;
  }

  getEmployee(employeeId) {
    return this.employees.find(e => e.id === parseInt(employeeId, 10));
  }

  getEmployeesWithCompetence(competenceId) {
    return this.employees.filter(
      e => e.competences.map(c => c.id).includes(parseInt(competenceId, 10))
    );
  }
}
