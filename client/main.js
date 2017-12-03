import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

Meteor.startup(() => {
  import App from '../imports/ui/App'
  render(
    <App />,
    document.getElementById('root')
  );
});