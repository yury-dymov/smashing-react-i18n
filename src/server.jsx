import express from 'express';
import React from 'react';
import ReactDom from 'react-dom/server';
import acceptLanguage from 'accept-language';
import cookieParser from 'cookie-parser';
import { addLocaleData, IntlProvider } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import fs from 'fs';
import path from 'path';
import App from './components/App';

addLocaleData([...ru, ...en]);

const messages = {};
const localeData = {};

['en', 'ru'].forEach((locale) => {
  localeData[locale] = fs.readFileSync(path.join(__dirname, `../node_modules/react-intl/locale-data/${locale}.js`)).toString();
  messages[locale] = require(`../public/assets/${locale}.json`);
});

acceptLanguage.languages(['en', 'ru']);

const assetUrl = process.env.NODE_ENV !== 'production' ? 'http://localhost:8050' : '/';

function renderHTML(componentHTML, locale, initialNow) {
  return `
    <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello React</title>
      </head>
      <body>
        <div id="react-view">${componentHTML}</div>
        <script type="application/javascript" src="${assetUrl}/public/assets/bundle.js"></script>
        <script type="application/javascript">${localeData[locale]}</script>
        <script type="application/javascript">window.INITIAL_NOW=${JSON.stringify(initialNow)}</script>
      </body>
    </html>
  `;
}

const app = express();
app.use(cookieParser());
app.use('/public/assets', express.static('public/assets'));

function detectLocale(req) {
  const cookieLocale = req.cookies.locale;

  return acceptLanguage.get(cookieLocale || req.headers['accept-language']) || 'en';
}

app.use((req, res) => {
  const locale = detectLocale(req);
  const initialNow = Date.now();
  const componentHTML = ReactDom.renderToString(
    <IntlProvider initialNow={initialNow} locale={locale} messages={messages[locale]}>
      <App />
    </IntlProvider>
  );

  res.cookie('locale', locale, { maxAge: (new Date() * 0.001) + (365 * 24 * 3600) });
  return res.end(renderHTML(componentHTML, locale, initialNow));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on: ${PORT}`); // eslint-disable-line no-console
});
