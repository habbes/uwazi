import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NeedAuthorization} from 'app/Auth';
import {I18NLink, I18NMenu, t} from 'app/I18N';
import {processFilters, encodeSearch} from 'app/Library/actions/libraryActions';

class Menu extends Component {

  libraryUrl() {
    const params = processFilters(this.props.librarySearch, this.props.libraryFilters.toJS());
    return '/library/' + encodeSearch(params);
  }

  uploadsUrl() {
    const params = processFilters(this.props.uploadsSearch, this.props.uploadsFilters.toJS());
    return '/uploads/' + encodeSearch(params);
  }

  render() {
    const {links} = this.props;
    const user = this.props.user.toJS();

    const navLinks = links.map(link =>
      <li key={link.get('_id')} className="menuNav-item">
        <I18NLink to={link.get('url') || '/'} className="btn menuNav-btn">{t('Menu', link.get('title'))}</I18NLink>
      </li>
    );

    return (
      <ul onClick={this.props.onClick} className={this.props.className}>
        <li className="menuItems">
          <ul className="menuNav-list">{navLinks}</ul>
        </li>
        <li className="menuActions">
          <ul className="menuNav-list">
            <li className="menuNav-item">
              <I18NLink to={this.libraryUrl()} className="menuNav-btn btn btn-default">
                  <svg data-prefix="fas" data-icon="th" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M149.3 226.7v58.7c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24v-58.7c0-13.3 10.7-24 24-24h101.3c13.3 0 24 10.7 24 24zM362.7 88v58.7c0 13.3 10.7 24 24 24H488c13.3 0 24-10.7 24-24V88c0-13.3-10.7-24-24-24H386.7c-13.3 0-24 10.7-24 24zM125.3 64H24C10.7 64 0 74.7 0 88v58.7c0 13.3 10.7 24 24 24h101.3c13.3 0 24-10.7 24-24V88c0-13.3-10.7-24-24-24zm205.4 82.7V88c0-13.3-10.7-24-24-24H205.3c-13.3 0-24 10.7-24 24v58.7c0 13.3 10.7 24 24 24h101.3c13.3 0 24.1-10.8 24.1-24zm-24 56H205.3c-13.3 0-24 10.7-24 24v58.7c0 13.3 10.7 24 24 24h101.3c13.3 0 24-10.7 24-24v-58.7c.1-13.3-10.7-24-23.9-24zm80 106.6H488c13.3 0 24-10.7 24-24v-58.7c0-13.3-10.7-24-24-24H386.7c-13.3 0-24 10.7-24 24v58.7c0 13.3 10.7 24 24 24zm0 138.7H488c13.3 0 24-10.7 24-24v-58.7c0-13.3-10.7-24-24-24H386.7c-13.3 0-24 10.7-24 24V424c0 13.3 10.7 24 24 24zM0 365.3V424c0 13.3 10.7 24 24 24h101.3c13.3 0 24-10.7 24-24v-58.7c0-13.3-10.7-24-24-24H24c-13.3 0-24 10.8-24 24zm181.3 0V424c0 13.3 10.7 24 24 24h101.3c13.3 0 24-10.7 24-24v-58.7c0-13.3-10.7-24-24-24H205.3c-13.2 0-24 10.8-24 24z"></path></svg>
              </I18NLink>
            </li>
            <NeedAuthorization roles={['admin', 'editor']}>
              <li className="menuNav-item">
                <I18NLink to={this.uploadsUrl()} className="menuNav-btn btn btn-default">
                  <svg data-prefix="fas" data-icon="upload" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg>
                </I18NLink>
              </li>
            </NeedAuthorization>
            <NeedAuthorization roles={['admin', 'editor']}>
              <li className="menuNav-item">
                <I18NLink to='/settings/account' className="menuNav-btn btn btn-default">
                  <svg data-prefix="fas" data-icon="cog" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M444.788 291.1l42.616 24.599c4.867 2.809 7.126 8.618 5.459 13.985-11.07 35.642-29.97 67.842-54.689 94.586a12.016 12.016 0 0 1-14.832 2.254l-42.584-24.595a191.577 191.577 0 0 1-60.759 35.13v49.182a12.01 12.01 0 0 1-9.377 11.718c-34.956 7.85-72.499 8.256-109.219.007-5.49-1.233-9.403-6.096-9.403-11.723v-49.184a191.555 191.555 0 0 1-60.759-35.13l-42.584 24.595a12.016 12.016 0 0 1-14.832-2.254c-24.718-26.744-43.619-58.944-54.689-94.586-1.667-5.366.592-11.175 5.459-13.985L67.212 291.1a193.48 193.48 0 0 1 0-70.199l-42.616-24.599c-4.867-2.809-7.126-8.618-5.459-13.985 11.07-35.642 29.97-67.842 54.689-94.586a12.016 12.016 0 0 1 14.832-2.254l42.584 24.595a191.577 191.577 0 0 1 60.759-35.13V25.759a12.01 12.01 0 0 1 9.377-11.718c34.956-7.85 72.499-8.256 109.219-.007 5.49 1.233 9.403 6.096 9.403 11.723v49.184a191.555 191.555 0 0 1 60.759 35.13l42.584-24.595a12.016 12.016 0 0 1 14.832 2.254c24.718 26.744 43.619 58.944 54.689 94.586 1.667 5.366-.592 11.175-5.459 13.985L444.788 220.9a193.485 193.485 0 0 1 0 70.2zM336 256c0-44.112-35.888-80-80-80s-80 35.888-80 80 35.888 80 80 80 80-35.888 80-80z"></path></svg>
                </I18NLink>
              </li>
            </NeedAuthorization>
            {(() => {
              if (!user._id) {
                return (
                  <li className="menuNav-item">
                    <I18NLink to='/login' className="menuNav-btn btn btn-default">
                      <svg data-prefix="fas" data-icon="power-off" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M400 54.1c63 45 104 118.6 104 201.9 0 136.8-110.8 247.7-247.5 248C120 504.3 8.2 393 8 256.4 7.9 173.1 48.9 99.3 111.8 54.2c11.7-8.3 28-4.8 35 7.7L162.6 90c5.9 10.5 3.1 23.8-6.6 31-41.5 30.8-68 79.6-68 134.9-.1 92.3 74.5 168.1 168 168.1 91.6 0 168.6-74.2 168-169.1-.3-51.8-24.7-101.8-68.1-134-9.7-7.2-12.4-20.5-6.5-30.9l15.8-28.1c7-12.4 23.2-16.1 34.8-7.8zM296 264V24c0-13.3-10.7-24-24-24h-32c-13.3 0-24 10.7-24 24v240c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24z"></path></svg>
                    </I18NLink>
                  </li>
                );
              }
            })()}
          </ul>
          <I18NMenu location={this.props.location}/>
        </li>
      </ul>
    );
  }
}

Menu.propTypes = {
  user: PropTypes.object,
  location: PropTypes.object,
  librarySearch: PropTypes.object,
  libraryFilters: PropTypes.object,
  uploadsSearch: PropTypes.object,
  uploadsFilters: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  links: PropTypes.object
};

export function mapStateToProps({user, settings, library, uploads}) {
  return {
    user,
    librarySearch: library.search,
    libraryFilters: library.filters,
    uploadsSearch: uploads.search,
    uploadsFilters: uploads.filters,
    uploadsSelectedSorting: uploads.selectedSorting,
    links: settings.collection.get('links')
  };
}

export default connect(mapStateToProps)(Menu);
