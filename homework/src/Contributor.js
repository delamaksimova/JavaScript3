'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Contributor {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the contributor info to the DOM.
   * @param {HTMLElement} contributorList The parent element in which to render the contributor.
  */
  render(contributorList) {
    let contributorItem = Util.createAndAppend('li', contributorList, { class: "contributor-item", 'aria-label': this.data.login });
    let contributorAvatar = Util.createAndAppend('img', contributorItem, { class: "contributor-avatar", src: this.data.avatar_url });
    let contributorData = Util.createAndAppend('div', contributorItem, { class: "contributor-data" });
    let contributorLink = Util.createAndAppend('a', contributorData, {
      href: this.data.login,
      target: '_blank',
      text: this.data.login,
      class: "contributor-name",
    }); // end of the variable contributorLink
    let contributorBadge = Util.createAndAppend('div', contributorItem, {class: "contributor-barge", text: this.data.contributions });      
  }
}
