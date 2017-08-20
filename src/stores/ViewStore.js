import { observable, computed, action } from 'mobx';
import _ from 'lodash';

export default class ViewStore {
  @observable selectedNodes = [];
  @observable selectedComps = [];
  @observable changedFilters = false;
  @observable filtersGroup = {
    keywords: [],
    researchGroups: undefined,
    school: undefined,
  };

  @computed get filters() {
    const filters = [];

    /*
    for (let i = 0; i < this.filtersGroup.keywords.length; i += 1) {
      const competenceId = this.filtersGroup.keywords[i];
      filters.push(
        e => e.keywords.map(c => c.id).includes(parseInt(competenceId, 10))
      );
    }*/
    if (this.filtersGroup.researchGroups) {
      filters.push(
        e => _.find(
          this.filtersGroup.researchGroups,
          id => e.researchGroups.length > 0 && parseInt(id, 10) === e.researchGroups[0].id)
      );
    }
    if (this.filtersGroup.school) {
      filters.push(
        e => _.find(this.filtersGroup.school, id => parseInt(id, 10) === e.school.id)
      );
    }

    return filters;
  }

  set filters({ type, selected: selectedIds }) {
    this.changedFilters = true;
    if (selectedIds.length > 0) {
      this.filtersGroup[type] = selectedIds;
    } else {
      this.filtersGroup[type] = undefined;
    }
  }

  @computed get keywords() {
    return this.filtersGroup.keywords;
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
