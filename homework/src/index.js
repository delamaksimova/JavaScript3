'use strict';

{
  function fetchJSON(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';
      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`))
        }
      }; // end of reject
      xhr.onerror = () => reject(new Error('Network request failed'));
      xhr.send();
    }); // end of promise
  } // end of fetchJSON

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach((key) => {
      const value = options[key];
      if (key === 'text') {
        elem.innerText = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  } // end of createAndAppend

  async function main(url) {
    // root, header, selector with dropdown-menu
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { class: "header" });
    const headerTitle = createAndAppend('p', header, { class: "header-title", text: "HackYourFuture Repositories" });
    const selector = createAndAppend('select', header, {
      class: 'repo-selector',
      'aria-label': "HYF Repositories"
    }); // end of selector variable
    const container = createAndAppend('div', root, {id: "container" });

    try {
      const data = await fetchJSON(url);
      data.sort((a, b) => (a.name).localeCompare(b.name));
      selector.onchange = () => {
        repositoryBox(selector.options[selector.selectedIndex].text, container);
        contributorsBox(selector.options[selector.selectedIndex].text, container);
      }; // end of selector.onchange
      const optionArray = [];
      for (let i = 0; i < data.length; i++) {
        let option = createAndAppend('option', selector, { value: i, text: data[i].name});
        optionArray.push(option);
      } // end of for
      await repositoryBox(selector.options[0].text, container); // DO I NEED AWAIT HERE?
      await contributorsBox(selector.options[0].text, container); // DO I NEED AWAIT HERE?
    } // end of try
    catch (err) {
      displayError(container, err);
    } // end of catch
  } // end of main

  async function repositoryBox(repo, container) {
    container.innerHTML = ""; // set it to "" every time the option get selected
    // information box
    const box = createAndAppend('table', container, { class: "infoBox" });
    const tableBody = createAndAppend('tbody', box, {});
    const repository = createAndAppend('tr', tableBody, {});
    const repositoryA = createAndAppend('td', repository, { class: "label", text: "Repository: " });
    const description = createAndAppend('tr', tableBody, {});
    const descriptionA = createAndAppend('td', description, { class: "label", text: "Description: " });
    const forks = createAndAppend('tr', tableBody, {});
    const forksA = createAndAppend('td', forks, { class: "label", text: "Forks: " });
    const updated = createAndAppend('tr', tableBody, {});
    const updatedA = createAndAppend('td', updated, { class: "label", text: "Updated: " });

    // fetchJSON function for the information box
    try {
      const data = await fetchJSON('https://api.github.com/repos/HackYourFuture/' + repo);
      const repositoryB = createAndAppend('td', repository, {});
      const repoLink = createAndAppend('a', repositoryB, {
        href: 'https://api.github.com/repos/HackYourFuture/' + repo,
        target: '_blank',
        text: repo,
      }); // end of the variable repoLink 
      const descriptionB = createAndAppend('td', description, { text: data.description });
      const forksB = createAndAppend('td', forks, { text: data.forks_count });
      const date = new Date(data.updated_at).toUTCString();
      const updatedB = createAndAppend('td', updated, { text: date });
    }
    catch (err) {
      displayError(container, err);
    } // end of catch
  } // end of repositoryBox

  async function contributorsBox(repo, container) {
    const box = createAndAppend('div', container, { class: "contributorBox"});
    const contributorBoxTitle = createAndAppend('p', box, { class: "contributor-header", text: "Contributions"});

    try {
      const data = await fetchJSON('https://api.github.com/repos/HackYourFuture/' + repo + '/contributors');
      const contributorList = createAndAppend('ul', box, { class: "contributor-list" });
      const contributorListArray = [];
      for (let i = 0; i < data.length; i++) {
        let contributorItem = createAndAppend('li', contributorList, { class: "contributor-item", 'aria-label': data[i].login });
        let contributorAvatar = createAndAppend('img', contributorItem, { class: "contributor-avatar", src: data[i].avatar_url });
        let contributorData = createAndAppend('div', contributorItem, { class: "contributor-data" });
        let contributorLink = createAndAppend('a', contributorData, {
          href: 'https://github.com/' + data[i].login,
          target: '_blank',
          text: data[i].login,
          class: "contributor-name",
        }); // end of the variable contributorLink
        let contributorBadge = createAndAppend('div', contributorItem, {class: "contributor-barge", text: data[i].contributions });
        await contributorListArray.push(contributorItem); // DO I NEED AWAIT HERE?????
      } // end of for
    } catch (err) {
      displayError(container, err);
    } // end of catch

  } // end of contributorsBox

  function displayError(parent, err) {
    createAndAppend('div', parent, { id: 'alert-error', text: err.message });
  }
  
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}