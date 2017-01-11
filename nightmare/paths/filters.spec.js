/*eslint max-nested-callbacks: ["error", 10]*/
import Nightmare from 'nightmare';
import config from '../helpers/config.js';
import selectors from '../helpers/selectors.js';
import {catchErrors} from 'api/utils/jasmineHelpers';

let getInnerText = (selector) => {
  return document.querySelector(selector).innerText;
};

fdescribe('filters path', () => {
  let nightmare = new Nightmare({show: true, typeInterval: 10}).viewport(1100, 600);

  describe('login', () => {
    it('should log in as admin then click the settings nav button', (done) => {
      nightmare
      .login('admin', 'admin')
      .waitToClick(selectors.navigation.settingsNavButton)
      .wait(selectors.settingsView.settingsHeader)
      .url()
      .then((url) => {
        expect(url).toBe(config.url + '/settings/account');
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('Filters settings tests', () => {
    it('should click Filters button and then click on Create Group button', (done) => {
      nightmare
      .waitToClick(selectors.settingsView.filtersButton)
      .waitToClick(selectors.settingsView.createFilterGroupButton)
      .wait(selectors.settingsView.newFilterGroupForm)
      .exists(selectors.settingsView.newFilterGroupForm)
      .then((result) => {
        expect(result).toBe(true);
        done();
      })
      .catch(catchErrors(done));
    });

    it('should create a group called Test Group', (done) => {
      nightmare
      .clearInput(selectors.settingsView.newFilterGroupForm)
      .type(selectors.settingsView.newFilterGroupForm, 'Test Group')
      .waitToClick(selectors.settingsView.filtrableTypesSaveButton)
      .wait('.alert.alert-success')
      .exists('.alert.alert-success')
      .then((result) => {
        expect(result).toBe(true);
        done();
      })
      .catch(catchErrors(done));
    });

    it('should delete the filters group', (done) => {
      nightmare
      .wait(3200)
      .deleteItemFromList(selectors.settingsView.listOfFilterGroups, 'Test Group')
      .waitToClick(selectors.settingsView.saveFilterGroupButton)
      .wait('.alert.alert-success')
      .exists('.alert.alert-success')
      .then((result) => {
        expect(result).toBe(true);
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('library filters tests', () => {
    it('should click on the library nav button', (done) => {
      nightmare
      .wait(3200)
      .waitToClick(selectors.navigation.libraryNavButton)
      .exists(selectors.libraryView.searchInput)
      .then((result) => {
        expect(result).toBe(true);
        done();
      })
      .catch(catchErrors(done));
    });

    it('should perform a search for Daneryl', (done) => {
      nightmare
      .type(selectors.libraryView.searchInput, 'Daneryl')
      .waitToClick(selectors.libraryView.searchButton)
      .wait(100)
      .evaluate(getInnerText, selectors.libraryView.libraryFirstDocumentTitle)
      .then((result) => {
        expect(result).toBe('Daneryl');
        done();
      })
      .catch(catchErrors(done));
    });

    it('should clear the search input by clicking the cross button', (done) => {
      nightmare
      .waitToClick(selectors.libraryView.searchInput)
      .waitToClick(selectors.libraryView.clearSearchInput)
      .evaluate(getInnerText, selectors.libraryView.searchInput)
      .then((result) => {
        expect(result).toBe('');
        done();
      })
      .catch(catchErrors(done));
    });

    it('should check the COMIC CHARACTER and FLY checkboxs to find Star Lord Wikipedia', (done) => {
      nightmare
      .waitToClick(selectors.libraryView.comicCharacterCheckBox)
      .waitToClick(selectors.libraryView.flyCheckBoxOfComicChar)
      .evaluate(getInnerText, selectors.libraryView.librarySecondDocumentTitle)
      .then((result) => {
        expect(result).toBe('Star Lord Wikipedia');
        done();
      })
      .catch(catchErrors(done));
    });

    it('should reset the search and check the SUPER VILLIAN checkbox to find SCARECROW as first result', (done) => {
      nightmare
      .waitToClick(selectors.libraryView.resetSearch)
      .waitToClick(selectors.libraryView.superVillianCheckBox)
      .wait(100)
      .evaluate(getInnerText, selectors.libraryView.libraryFirstDocumentTitle)
      .then((result) => {
        expect(result).toBe('Scarecrow');
        done();
      })
      .catch(catchErrors(done));
    });

    it('should expand the SUPER POWERS checkboxlist then check OBLITERATE SPECIES checkbox to find DANERYL as 2nd result', (done) => {
      nightmare
      .waitToClick(selectors.libraryView.expandCheckBoxesList)
      .waitToClick(selectors.libraryView.flyCheckBoxOfSuperVillian)
      .waitToClick(selectors.libraryView.obliterateSpeciesCheckBox)
      .evaluate(getInnerText, selectors.libraryView.libraryFirstDocumentTitle)
      .then((result) => {
        expect(result).toBe('Daneryl');
        done();
      })
      .catch(catchErrors(done));
    });

    it('should perform a search for THANOS', (done) => {
      nightmare
      .type(selectors.libraryView.searchInput, 'Thanos')
      .waitToClick(selectors.libraryView.searchButton)
      .wait(100)
      .evaluate(getInnerText, selectors.libraryView.libraryFirstDocumentTitle)
      .then((result) => {
        expect(result).toBe('Thanos');
        done();
      })
      .catch(catchErrors(done));
    });
  });

  describe('closing browser', () => {
    it('should close the browser', (done) => {
      nightmare.end()
      .then(done);
    });
  });
});
