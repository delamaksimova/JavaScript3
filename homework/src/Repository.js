'use strict';

/* global Util */

// eslint-disable-next-line no-unused-vars
class Repository {
  constructor(data) {
    this.data = data;
  }

  /**
   * Render the repository info to the DOM.
   * @param {HTMLElement} parent The parent element in which to render the repository. //  A CONTAINER element
   */
  render(parent) {
    const table = Util.createAndAppend('table', parent);
    const tableBody = Util.createAndAppend('tbody', table);

    const repository = Util.createAndAppend('tr', tableBody);
    const repositoryA = Util.createAndAppend('td', repository, { class: "label", text: "Repository: " });
    const repositoryB = Util.createAndAppend('td', repository, {});
    const repositoryLink = Util.createAndAppend('a', repositoryB, {
      href: this.data.html_url,
      target: '_blank',
      text: this.data.name,
    }); // end of the variable repoLink 

    const description = Util.createAndAppend('tr', tableBody);
    const descriptionA = Util.createAndAppend('td', description, { class: "label", text: "Description: " });
    const descriptionB = Util.createAndAppend('td', description, { text: this.data.description });

    const forks = Util.createAndAppend('tr', tableBody);
    const forksA = Util.createAndAppend('td', forks, { class: "label", text: "Forks: " });
    const forksB = Util.createAndAppend('td', forks, { text: this.data.forks_count });

    const updated = Util.createAndAppend('tr', tableBody);
    const updatedA = Util.createAndAppend('td', updated, { class: "label", text: "Updated: " });
    const date = new Date(this.data.updated_at).toUTCString();
    const updatedB = Util.createAndAppend('td', updated, { text: date });
  } // end of render

  /**
   * Returns an array of contributors as a promise
   */
  fetchContributors() {
    return Util.fetchJSON(this.data.contributors_url);
  }

  /**
   * Returns the name of the repository
   */
  name() {
    return this.data.name;
  }
}