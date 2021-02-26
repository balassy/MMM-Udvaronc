const NodeHelper = require('node_helper'); // eslint-disable-line import/no-unresolved
const request = require('request'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = NodeHelper.create({
  start() {
    this._started = false;
    this._config = null;
  },

  socketNotificationReceived(notificationName, payload) {
    const self = this;

    if (notificationName === 'MMM-UDVARONC.INIT') {
      if (!self._started) {
        self._config = payload;
        self._init();
        self.sendSocketNotification('MMM-UDVARONC.STARTED', true);
        self._started = true;
      }
    }
  },

  _init() {
    const self = this;

    self._getData();

    setInterval(() => {
      self._getData();
    }, self._config.updateInterval);
  },

  _getData() {
    const self = this;

    const url = 'https://www.udvaronc.hu/php/api.php';

    request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        self._processResponse(body);
      } else {
        console.error(`MMM-Udvaronc Node helper: Failed to load data. Error: ${error}. Response: ${response}`); // eslint-disable-line no-console
      }
    });
  },

  _processResponse(responseBody) {
    const response = JSON.parse(responseBody);

    const payload = {
      bow: response.bow
    };

    this.sendSocketNotification('MMM-UDVARONC.VALUE_RECEIVED', payload);
  }
});
