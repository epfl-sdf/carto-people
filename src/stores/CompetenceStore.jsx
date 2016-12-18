import { observable, action, computed } from 'mobx';
import axios from 'axios';
import { flatten, uniqBy } from 'lodash';

export default class CompetenceStore {
  @observable competences = [];

  constructor() {
    this.loadCompetences();
  }

  @computed get isLoading() {
    return this.competences.length === 0;
  }

  @action loadCompetences() {
    axios.get('/data/sample.json')
      .then((response) => {
        this.competences = uniqBy(flatten(response.data.employees.map(emp => emp.competences)), 'id');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getCompetences() {
    return this.competences;
  }

  getCompetence(id) {
    return this.competences.find(c => c.id === parseInt(id, 10));
  }
}
