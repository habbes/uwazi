import React from 'react';
import {shallow} from 'enzyme';
import {PDFJS} from '../../../../../node_modules/pdfjs-dist/web/pdf_viewer.js';

import PDF from '../PDF';
import PDFPage from '../PDFPage.js';

describe('PDF', () => {
  let component;
  let instance;
  const pdfObject = {numPages: 2};

  let props;

  beforeEach(() => {
    spyOn(PDFJS, 'getDocument').and.returnValue(Promise.resolve(pdfObject));
    props = {
      file: 'file_url',
      onLoad: jasmine.createSpy('onLoad')
    };
  });

  let render = () => {
    component = shallow(<PDF {...props}/>);
    instance = component.instance();
  };

  fdescribe('on instance', () => {
    it('should get the pdf with pdfjs', (done) => {
      render();
      spyOn(instance, 'setState');
      expect(PDFJS.getDocument).toHaveBeenCalledWith(props.file);
      setTimeout(() => {
        expect(instance.setState).toHaveBeenCalledWith({pdf: pdfObject});
        done();
      });
    });
  });

  fdescribe('render', () => {
    it('should render a pdfPage for each page', () => {
      render();
      instance.setState({pdf: {numPages: 3}});
      component.update();
      expect(component.find(PDFPage).length).toBe(3);
    });
  });

  fdescribe('onLoad', () => {
    it('should be called when there is no pages loading with the range of characters being rendered', () => {
      props.pdfInfo = {
        1: {chars: 10},
        2: {chars: 20},
        3: {chars: 30},
        4: {chars: 40},
        5: {chars: 50}
      };
      render();
      instance.setState({pdf: {numPages: 5}});
      instance.pageLoaded(1);
      props.onLoad.calls.reset();
      instance.pageLoading(2);
      instance.pageLoaded(3);
      expect(props.onLoad).not.toHaveBeenCalled();
      instance.pageLoaded(2);
      expect(props.onLoad).toHaveBeenCalledWith({start: 0, end: 30});
    });

    it('should be called when a pages is unloaded', () => {
      props.pdfInfo = {
        1: {chars: 10},
        2: {chars: 20},
        3: {chars: 30},
        4: {chars: 40},
        5: {chars: 50}
      };
      render();
      instance.setState({pdf: {numPages: 5}});

      instance.pageLoaded(1);
      instance.pageLoaded(2);
      instance.pageLoaded(3);
      props.onLoad.calls.reset();
      instance.pageUnloaded(3);

      expect(props.onLoad).toHaveBeenCalledWith({start: 0, end: 20});
    });
  });
});
