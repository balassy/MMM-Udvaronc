/* global Module */

/* Magic Mirror Module: MMM-Udvaronc (https://github.com/balassy/MMM-Udvaronc)
 * By György Balássy (https://www.linkedin.com/in/balassy)
 * MIT Licensed.
 */

Module.register('MMM-Udvaronc', {
  defaults: {
    updateInterval: 3600000
  },

  requiresVersion: '2.1.0',

  start() {
    this.viewModel = null;
    this.hasData = false;
    this.sendSocketNotification('MMM-UDVARONC.INIT', this.config);
  },

  getDom() {
    const wrapper = document.createElement('div');

    if (this.config.classes) {
      wrapper.className = this.config.classes;
    } else {
      wrapper.className = 'thin bright pre-line ';
      wrapper.className += this.viewModel && this.viewModel.bow && this.viewModel.bow.length > 70 ? 'large' : 'xlarge';
    }

    const complimentText = this.viewModel ? this.viewModel.bow : 'Üdvözöllek Mesterem!';
    wrapper.appendChild(document.createTextNode(complimentText));

    return wrapper;
  },

  socketNotificationReceived(notificationName, payload) {
    if (notificationName === 'MMM-UDVARONC.STARTED') {
      this.updateDom();
    } else if (notificationName === 'MMM-UDVARONC.VALUE_RECEIVED') {
      this.hasData = true;
      this.viewModel = payload;
      this.updateDom();
    }
  }
});
