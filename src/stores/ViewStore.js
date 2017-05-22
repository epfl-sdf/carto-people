import { observable, computed, action } from 'mobx';

export default class ViewStore {
  @observable selectedNodes = [];
  @observable changedFilters = false
  @observable filtersGroup = {
    keywords: [],
    researchGroups: undefined,
    school: undefined,
  }

  @computed get filters() {
    const filters = [];

    for (let i = 0; i < this.filtersGroup.keywords.length; i += 1) {
      const competenceId = this.filtersGroup.keywords[i];
      filters.push(
        e => e.keywords.map(c => c.id).includes(parseInt(competenceId, 10))
      );
    }
    if (this.filtersGroup.researchGroups) {
      filters.push(e => e.researchGroups
      .filter(rg => rg.id === parseInt(this.filtersGroup.researchGroups, 10)).length > 0);
    }
    if (this.filtersGroup.school) {
      filters.push(
        e => e.school.id === parseInt(this.filtersGroup.school, 10)
      );
    }

    return filters;
  }

  set filters({ type, selected: selectedIds }) {
    this.changedFilters = true;
    this.filtersGroup[type] = selectedIds;
  }

  @action resetFilters() {
    this.changedFilters = true;
    this.filtersGroup = {
      keywords: [],
      researchGroups: undefined,
      school: undefined,
    };
  }
}
