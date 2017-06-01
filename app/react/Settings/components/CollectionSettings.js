import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {isClient} from 'app/utils';

import {actions} from 'app/BasicReducer';
import SettingsAPI from 'app/Settings/SettingsAPI';
import {notify} from 'app/Notifications/actions/notificationsActions';
import {t} from 'app/I18N';

export class CollectionSettings extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      siteName: props.settings.site_name || '',
      homePage: props.settings.home_page || '',
      mailerConfig: props.settings.mailerConfig || '',
      customLandingpage: !!props.settings.home_page
    };
  }

  changeLandingPage(e) {
    const customLandingpage = e.target.value === 'custom';
    this.setState({customLandingpage, homePage: ''});
    let settings = Object.assign(this.props.settings, {home_page: ''});
    this.props.setSettings(settings);
  }

  changeName(e) {
    this.setState({siteName: e.target.value});
    let settings = Object.assign(this.props.settings, {site_name: e.target.value});
    this.props.setSettings(settings);
  }

  changeMailerConfig(e) {
    this.setState({mailerConfig: e.target.value});
    let settings = Object.assign(this.props.settings, {mailerConfig: e.target.value});
    this.props.setSettings(settings);
  }

  changeHomePage(e) {
    this.setState({homePage: e.target.value});
    let settings = Object.assign(this.props.settings, {home_page: e.target.value});
    this.props.setSettings(settings);
  }

  updateSettings(e) {
    e.preventDefault();
    let settings = Object.assign({}, this.props.settings);
    settings.home_page = this.state.homePage;
    settings.site_name = this.state.siteName;
    settings.mailerConfig = this.state.mailerConfig;
    SettingsAPI.save(settings)
    .then((result) => {
      this.props.notify(t('System', 'Settings updated'), 'success');
      this.props.setSettings(result);
    });
  }

  render() {
    const hostname = isClient ? window.location.origin : '';
    return (
      <div className="panel panel-default">
        <div className="panel-heading">{t('System', 'Collection settings')}</div>
        <div className="panel-body">
          <form onSubmit={this.updateSettings.bind(this)}>
            <div className="form-group">
              <label className="form-group-label" htmlFor="collection_name">{t('System', 'Name')}</label>
              <input onChange={this.changeName.bind(this)} value={this.state.siteName} type="text" className="form-control"/>
            </div>
            <div className="form-group">
              <label className="form-group-label" htmlFor="collection_name">{t('System', 'Landing page')}</label>
              <div className="radio">
                <label>
                  <input
                    onChange={this.changeLandingPage.bind(this)}
                    name="landingPage"
                    type="radio"
                    value="library"
                    checked={!this.state.customLandingpage}
                  />
                  {t('System', 'Library')}
                </label>
              </div>
              <div className="radio">
                <label>
                  <input
                    onChange={this.changeLandingPage.bind(this)}
                    name="landingPage"
                    type="radio"
                    value="custom"
                    checked={this.state.customLandingpage}
                  />
                  {t('System', 'Custom page')}
                </label>
              </div>
              <div className="input-group">
                <span disabled={!this.state.customLandingpage} className="input-group-addon">
                  {hostname}
                </span>
                <input
                  disabled={!this.state.customLandingpage}
                  onChange={this.changeHomePage.bind(this)}
                  value={this.state.homePage}
                  type="text"
                  className="form-control"
                />
              </div>
            </div>
            <div className="alert alert-info">
              <i className="fa fa-home"></i>
              <p>The landing page is the first thing users will see when visiting your Uwazi instance.
              You can use any URL from your Uwazi instance as a landing page, examples:</p>
              <ul>
                <li>A page: /page/dicxg0oagy3xgr7ixef80k9</li>
                <li>Library results: /library/?searchTerm=test</li>
                <li>An entity: /entity/9htbkgpkyy7j5rk9</li>
                <li>A document: /document/4y9i99fadjp833di</li>
              </ul>
              <p>Always use URLs relative to your site, starting with / and skipping the https://yoursite.com/.</p>
            </div>
            <div className="form-group">
              <label className="form-group-label">{t('System', 'Date format')}</label>
              <h6>Order</h6>
              <div className="radio">
                <label>
                  <input
                      onChange={this.changeLandingPage.bind(this)}
                      name="dateFormatOrder"
                      type="radio"
                      value="YMD"
                      checked
                    />
                  <span>Year, Month, Day <code>2017/06/30</code></span>
                </label>
              </div>
              <div className="radio">
                <label>
                  <input
                      onChange={this.changeLandingPage.bind(this)}
                      name="dateFormatOrder"
                      type="radio"
                      value="DMY"
                    />
                  <span>Day, Month, Year <code>30/06/2017</code></span>
                </label>
              </div>
              <div className="radio">
                <label>
                  <input
                      onChange={this.changeLandingPage.bind(this)}
                      name="dateFormatOrder"
                      type="radio"
                      value="MDY"
                    />
                  <span>Month, Day, Year <code>06/30/2017</code></span>
                </label>
              </div>
              <h6>Separator</h6>
              <div className="radio">
                <label>
                  <input
                      onChange={this.changeLandingPage.bind(this)}
                      name="dateFormatSeparator"
                      type="radio"
                      value="slash"
                      checked
                    />
                  <span>Slash <code>/</code></span>
                </label>
              </div>
              <div className="radio">
                <label>
                  <input
                      onChange={this.changeLandingPage.bind(this)}
                      name="dateFormatSeparator"
                      type="radio"
                      value="dash"
                    />
                  <span>Dash <code>-</code></span>
                </label>
              </div>
            </div>
            <hr />
            <h5>Advanced configuration</h5>
            <div className="form-group">
              <label className="form-group-label" htmlFor="collectionMailerConfig">{t('System', 'Mailer configuration')}</label>
              <textarea name="collectionMailerConfig"
                        onChange={this.changeMailerConfig.bind(this)}
                        value={this.state.mailerConfig}
                        type="text"
                        className="form-control"
                        rows="5"/>
            </div>
            <div className="alert alert-info">
              <i className="fa fa-lightbulb-o"></i>
              <p>This is a JSON configuration object that should match the options values required by Nodemailer, as explained in:</p>
              <ul>
                <li><a href="https://nodemailer.com/smtp/" target="_blank">nodemailer.com/smtp/</a></li>
              </ul>
              <p>This setting takes precedence over all other mailer configuration.
                 If left blank, then the configuration file in /api/config/mailer.js will be used.</p>
            </div>
            <button type="submit" className="btn btn-success">{t('System', 'Update')}</button>
          </form>
        </div>
      </div>
    );
  }
}

CollectionSettings.propTypes = {
  settings: PropTypes.object,
  setSettings: PropTypes.func,
  notify: PropTypes.func
};

export function mapStateToProps(state) {
  return {settings: state.settings.collection.toJS()};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({setSettings: actions.set.bind(null, 'settings/collection'), notify}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionSettings);
