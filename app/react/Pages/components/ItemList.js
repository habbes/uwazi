import React, {Component} from 'react';
import {connect} from 'react-redux';
import {fromJS as Immutable} from 'immutable';
import PropTypes from 'prop-types';
import queryString from 'query-string';

import {RowList} from 'app/Layout/Lists';
import Doc from 'app/Library/components/Doc';
import {t, I18NLink} from 'app/I18N';

export class ItemList extends Component {
  render() {
    const {items, link} = this.props;
    const sort = queryString.parse(link.substring(link.indexOf('?'))).sort;
    const searchParams = sort ? {sort} : {sort: 'title'};

    return (
      <div>
        <RowList>
          {items.map((item, index) => <Doc doc={Immutable(item)} key={index} searchParams={searchParams} />)}
        </RowList>
        <div className="row">
          <div className="col-sm-12 text-center">
            <I18NLink to={`${link}`}>
              <button className="btn btn-default">{t('System', 'View in library')}</button>
            </I18NLink>
          </div>
        </div>
      </div>
    );
  }
}

ItemList.propTypes = {
  items: PropTypes.array,
  link: PropTypes.string
};

export default connect()(ItemList);
