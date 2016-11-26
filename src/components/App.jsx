import React, { Component } from 'react';
import {
  FormattedDate,
  FormattedRelative,
  FormattedNumber,
  FormattedMessage,
  intlShape,
  injectIntl,
  defineMessages,
} from 'react-intl';
import LocaleButton from './LocaleButton';

const propTypes = {
  intl: intlShape.isRequired,
};

const messages = defineMessages({
  counting: {
    id: 'app.counting',
    defaultMessage: 'I need to buy {count, number} {count, plural, one {apple} other {apples}}',
  },
  helloWorld2: {
    id: 'app.hello_world2',
    defaultMessage: 'Hello World 2!',
  },
});

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>
          <FormattedMessage
            id="app.hello_world"
            defaultMessage="Hello World!"
            description="Hello world header greeting"
          />
        </h1>
        <h1>{this.props.intl.formatMessage(messages.helloWorld2)}</h1>
        <LocaleButton locale={this.props.intl.locale} />
        <div>{this.props.intl.formatMessage(messages.counting, { count: 1 })}</div>
        <div>{this.props.intl.formatMessage(messages.counting, { count: 2 })}</div>
        <div>{this.props.intl.formatMessage(messages.counting, { count: 5 })}</div>
        <div><FormattedDate value={Date.now()} /></div>
        <div><FormattedNumber value="1000" currency="USD" currencyDisplay="symbol" style="currency" /></div>
        <div><FormattedRelative value={Date.now()} /></div>
      </div>
    );
  }
}

App.propTypes = propTypes;

export default injectIntl(App);
