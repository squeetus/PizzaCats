'use strict';

// Configuring the vis module
angular.module('vis').run(['Menus',
  function (Menus) {
    // Add the vis dropdown item
    Menus.addMenuItem('topbar', {
      title: 'vis',
      state: 'vis',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'vis', {
      title: 'Visualize Notes',
      state: 'vis.default'
    });
  }
]);
