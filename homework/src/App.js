'use strict';

/* global Util, Repository, Contributor */

class App {
  constructor(url) {
    this.initialize(url);
  }

  /**
   * Initialization
   * @param {string} url The GitHub URL for obtaining the organization's repositories.
   */
  async initialize(url) {
    // Add code here to initialize your app
    const root = document.getElementById('root');

    // 1. Create the fixed HTML elements of your page
    const header = Util.createAndAppend('header', root, { class: "header" });
    const headerTitle = Util.createAndAppend('p', header, { class: "header-title", text: "HackYourFuture Repositories" });
    const selector = Util.createAndAppend('select', header, {
      class: 'repo-selector',
      'aria-label': "HYF Repositories"
    }); // end of selector variable
    const container = Util.createAndAppend('div', root, {id: "container"});

    // 2. Make an initial XMLHttpRequest using Util.fetchJSON() to populate your <select> element
    try {
      const repos = await Util.fetchJSON(url);
      this.repos = repos
        .sort((item1, item2) => 
          (item1.name.toUpperCase()).localeCompare(item2.name.toUpperCase()))
        .map(repo => new Repository(repo))
      this.repos.forEach((element, index) => {
        Util.createAndAppend('option', selector, {
          value: index,
          text: element.data.name
        });
      }); // end of forEach
      this.fetchContributorsAndRender(0);
      selector.onchange = () => {
        this.fetchContributorsAndRender(selector.selectedIndex);
      } // end of onchange
    } catch (error) {
      this.renderError(container, error);
    }
  }

  /**
   * Removes all child elements from a container element
   * @param {*} container Container element to clear
   */
  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  /**
   * Fetch contributor information for the selected repository and render the
   * repo and its contributors as HTML elements in the DOM.
   * @param {number} index The array index of the repository.
   */
  async fetchContributorsAndRender(index) {
    try {
      const repo = this.repos[index];
      const contributors = await repo.fetchContributors();

      const container = document.getElementById('container');
      this.clearContainer(container);

      const leftDiv = Util.createAndAppend('div', container, { class: "infoBox" });
      const rightDiv = Util.createAndAppend('div', container, { class: "contributorBox" });
      const rightDivTitle = Util.createAndAppend('p', rightDiv, { class: "contributor-header", text: "Contributions: "});
      const contributorList = Util.createAndAppend('ul', rightDiv);

      repo.render(leftDiv);

      contributors
        .map(contributor => new Contributor(contributor))
        .forEach(contributor => contributor.render(contributorList));
    } catch (error) {
      this.renderError(container, error);
    }
  }

  /**
   * Render an error to the DOM.
   * @param {Error} error An Error object describing the error.
   */
  renderError(parent, error) {
    Util.createAndAppend('div', parent, { id: 'alert-error', text: error.message });
  }
}

const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

window.onload = () => new App(HYF_REPOS_URL);
