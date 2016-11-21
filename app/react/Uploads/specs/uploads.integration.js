import React from 'react';
import CustomProvider from '../../App/Provider';
import {Provider} from 'react-redux';
import store from '../../store';
import {mount} from 'enzyme';
import {Router} from 'react-router';
import Routes from '../../Routes';
import {browserHistory} from 'react-router';
import Login from 'app/Users/Login';
import {Field, Form} from 'react-redux-form';

//import UploadsRoute from '../UploadsRoute';

describe('uploads', () => {
  let component;
  let route;
  beforeEach(() => {
    component = mount(
      <Provider store={store()}>
        <CustomProvider>
          <Router ref={ref => route = ref} history={browserHistory}>{Routes}</Router>
        </CustomProvider>
      </Provider>,
      {context: {store: store()}}
    );
  });

  it('should be true', (done) => {
    browserHistory.push('/login');
    console.log(component.find('.has-error').length);

    console.log(component.find(Login).root.component.getInstance());

    done();
    //component.find(Login).props().onSubmit()
    //.then(() => {
      //console.log(component.find('.has-error').length);
      //expect(true).toBe(true);
      //done();
    //});
  });
});
