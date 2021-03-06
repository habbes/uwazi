import React from 'react';

import RouteHandler from 'app/App/RouteHandler';
import entitiesAPI from './EntitiesAPI';
import {actions} from 'app/BasicReducer';
import EntityViewer from './components/EntityViewer';
import referencesAPI from 'app/Viewer/referencesAPI';
import relationTypesAPI from 'app/RelationTypes/RelationTypesAPI';
import {actions as formActions} from 'react-redux-form';
import * as uiActions from './actions/uiActions';

import SearchButton from 'app/Entities/components/SearchButton';
import {get as prioritySortingCriteria} from 'app/utils/prioritySortingCriteria';

export default class Entity extends RouteHandler {

  static requestState({entityId, lang}, query, globalResources) {
    return Promise.all([
      entitiesAPI.get(entityId),
      relationTypesAPI.get(),
      referencesAPI.getGroupedByConnection(entityId)
    ])
    .then(([entities, relationTypes, connectionsGroups]) => {
      const filteredTemplates = connectionsGroups.reduce((templateIds, group) => {
        return templateIds.concat(group.templates.map(t => t._id.toString()));
      }, []);

      const sortOptions = prioritySortingCriteria({currentCriteria: {}, filteredTemplates, templates: globalResources.templates});

      return Promise.all([entities[0], relationTypes, connectionsGroups, referencesAPI.search(entityId, sortOptions), sortOptions]);
    })
    .then(([entity, relationTypes, connectionsGroups, searchResults, sort]) => {
      return {
        entityView: {
          entity
        },
        connectionsList: {
          entityId: entity.sharedId,
          connectionsGroups,
          searchResults,
          sort,
          filters: {}
        },
        relationTypes
      };
    });
  }

  componentWillMount() {
    this.context.store.dispatch(uiActions.showTab('info'));
  }

  componentWillUnmount() {
    this.emptyState();
  }

  emptyState() {
    this.context.store.dispatch(actions.unset('entityView/entity'));

    this.context.store.dispatch(actions.unset('connectionsList/entityId'));
    this.context.store.dispatch(actions.unset('connectionsList/connectionsGroups'));
    this.context.store.dispatch(actions.unset('connectionsList/searchResults'));
    this.context.store.dispatch(actions.unset('connectionsList/filters'));
    this.context.store.dispatch(actions.unset('connectionsList.sort'));
  }

  setReduxState(state) {
    this.context.store.dispatch(actions.set('relationTypes', state.relationTypes));
    this.context.store.dispatch(actions.set('entityView/entity', state.entityView.entity));

    this.context.store.dispatch(actions.set('connectionsList/entityId', state.connectionsList.entityId));
    this.context.store.dispatch(actions.set('connectionsList/connectionsGroups', state.connectionsList.connectionsGroups));
    this.context.store.dispatch(actions.set('connectionsList/searchResults', state.connectionsList.searchResults));
    this.context.store.dispatch(actions.set('connectionsList/filters', state.connectionsList.filters));
    this.context.store.dispatch(formActions.merge('connectionsList.sort', state.connectionsList.sort));
  }

  static renderTools() {
    return (
      <div className="searchBox">
        <SearchButton storeKey="library"/>
      </div>
    );
  }

  render() {
    return <EntityViewer/>;
  }
}
