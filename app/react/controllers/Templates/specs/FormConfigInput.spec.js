import React from 'react';
import {FormConfigInput, mapStateToProps} from '~/controllers/Templates/FormConfigInput';
import {shallow} from 'enzyme';
import Immutable from 'immutable';

describe('FormConfigInput', () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      fields: {label: {}, required: {}, filter: {}},
      values: {value: 'some value'},
      index: 0,
      updateProperty: jasmine.createSpy('updateProperty')
    };

    component = shallow(<FormConfigInput {...props}/>);
  });

  describe('when form changes', () => {
    it('should updateProperty', (done) => {
      component.find('form').simulate('change');

      setTimeout(() => {
        expect(props.updateProperty).toHaveBeenCalledWith(props.values, props.index);
        done();
      });
    });
  });

  describe('mapStateToProps', () => {
    it('should map the correct field to the props', () => {
      let state = {
        fields: Immutable.fromJS([{label: 'first property'}, {label: 'second property'}])
      };
      props = {index: 0};
      expect(mapStateToProps(state, props)).toEqual({initialValues: {label: 'first property'}});
    });
  });
});