define(function(require) {
  var _ = require('underscore');

  var AppDispatcher = require('app/dispatcher/AppDispatcher');
  var AppConstants = require('app/constants/AppConstants');
  var EventEmitter = require('event-emitter');

  var Actions = AppConstants.Actions;
  var States = AppConstants.States;

  var CHANGE_EVENT = 'change';

  // State
  var appState = States.SETTING_INSTRUMENT;
  var selectedInstrument = -1;

  var AppStore = _.extend({}, EventEmitter.prototype, {
    getState: function() {
      return {
        state: appState,
        instrument: selectedInstrument
      };
    },

    emitChange: function() {
      this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    }
  });

  // Register callback to handle all updates
  AppStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {

      case Actions.SET_INSTRUMENT:
        selectedInstrument = action.instrument;
        appState = States.AWAITING_POSITION;
        AppStore.emitChange();
        break;
      case Actions.START_PLAYING:
        appState = States.PLAYING;
        AppStore.emitChange();
        break;  
    }
  });

  return AppStore;
});
