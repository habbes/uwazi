import * as types from './actionTypes';
import api from '../../utils/singleton_api';

export function addProperty(config = {}, index = 0) {
  config.id = Math.random().toString(36).substr(2);
  return {
    type: types.ADD_PROPERTY,
    config,
    index
  };
}

export function updateProperty(config, index) {
  return {
    type: types.UPDATE_PROPERTY,
    config,
    index
  };
}

export function removeProperty(index) {
  return {
    type: types.REMOVE_PROPERTY,
    index
  };
}

export function reorderProperty(originIndex, targetIndex) {
  return {
    type: types.REORDER_PROPERTY,
    originIndex,
    targetIndex
  };
}

export function fetchTemplates() {
  return function (dispatch) {
    api.get('templates')
    .then((templates) => {
      dispatch({
        type: types.LIST_TEMPLATES,
        templates: templates.json.rows
      });
    });
  };
}