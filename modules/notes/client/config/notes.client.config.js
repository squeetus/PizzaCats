'use strict';

// Configuring the notes module
angular.module('notes').run(['Menus',
  function (Menus) {
    // Add the notes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'notes',
      state: 'notes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'notes', {
      title: 'List notes',
      state: 'notes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'notes', {
      title: 'Create notes',
      state: 'notes.create',
      roles: ['user']
    });
  }
]);
