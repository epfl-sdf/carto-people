import { observable, computed, action } from 'mobx';

export default class ViewStore {
  @observable selectedNodes = [];
  @observable filtersGroup = {
    competences: [],
    research_groups: undefined,
    schools: undefined,
  }

  @computed get filters() {
    const filters = [];

    for (let i = 0; i < this.filtersGroup.competences.length; i += 1) {
      const competenceId = this.filtersGroup.competences[i];
      filters.push(
        e => e.competences.map(c => c.id).includes(parseInt(competenceId, 10))
      );
    }
    if (this.filtersGroup.research_groups) {
      filters.push(
        e => e.school.id === parseInt(this.filtersGroup.research_groups, 10)
      );
    }
    if (this.filtersGroup.schools) {
      filters.push(
        e => e.school.id === parseInt(this.filtersGroup.schools, 10)
      );
    }

    return filters;
  }

  set filters({ type, selected: selectedIds }) {
    this.filtersGroup[type] = selectedIds;
  }

  @action resetFilters() {
    this.filtersGroup = {
      competences: [],
      research_groups: undefined,
      schools: undefined,
    };
  }
}
