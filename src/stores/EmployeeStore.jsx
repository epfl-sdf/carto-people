import { observable, action, computed } from 'mobx';
import axios from 'axios';

export default class EmployeeStore {
  @observable employees = [];

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
}
