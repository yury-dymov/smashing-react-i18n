import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import Cookie from 'js-cookie';
import fetch from 'isomorphic-fetch';
import App from './components/App';

const locale = Cookie.get('locale') || 'en';

fetch(`/public/assets/${locale}.json`)
  .then((res) => {
    if (res.status >= 400) {
      throw new Error('Bad response from server');
    }

    return res.json();
  })
  .then((localeData) => {
    addLocaleData(window.ReactIntlLocaleData[locale]);

    ReactDOM.render(
      <IntlProvider initialNow={parseInt(window.INITIAL_NOW, 10)} locale={locale} messages={localeData}>
        <App />
      </IntlProvider>,
      document.getElementById('react-view'),
    );
  })
  .catch((error) => {
    console.error(error);
  });
