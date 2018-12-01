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

  function main(url) {
    // root, header, selector with dropdown-menu
    const root = document.getElementById('root');
    const header = createAndAppend('header', root, { class: "header" });
    const headerTitle = createAndAppend('p', header, { class: "header-title", text: "HackYourFuture Repositories" });
    const selector = createAndAppend('select', header, {
      class: 'repo-selector',
      'aria-label': "HYF Repositories"
    }); // end of selector variable
    const container = createAndAppend('div', root, {id: "container" });

    // fetchJSON function
    fetchJSON(url)
      .then(data => {
        selector.onchange = () => repositoryAndContributors(selector.options[selector.selectedIndex].text, container);
        data.sort((a, b) => (a.name).localeCompare(b.name));
        const optionArray = [];
        for (let i = 0; i < data.length; i++) {
          let option = createAndAppend('option', selector, { value: i, text: data[i].name});
          optionArray.push(option);
        } // end of for
        repositoryAndContributors(selector.options[0].text, container); // chooses the first option in selector
      }) // end of .then
      .catch(err => {
        container.id = 'alert-error';
        container.innerText =  err.message;
      });
  } // end of main


  function repositoryAndContributors(repo, container) {
    container.innerHTML = ""; // set it to "" every time the option get selected
    // information box
    const informationBox = createAndAppend('table', container, { class: "infoBox" });
    const tableBody = createAndAppend('tbody', informationBox, {});
    const repository = createAndAppend('tr', tableBody, {});
    const repositoryA = createAndAppend('td', repository, { class: "label", text: "Repository: " });
    const description = createAndAppend('tr', tableBody, {});
    const descriptionA = createAndAppend('td', description, { class: "label", text: "Description: " });
    const forks = createAndAppend('tr', tableBody, {});
    const forksA = createAndAppend('td', forks, { class: "label", text: "Forks: " });
    const updated = createAndAppend('tr', tableBody, {});
    const updatedA = createAndAppend('td', updated, { class: "label", text: "Updated: " });

    // fetchJSON function for the information box
    fetchJSON('https://api.github.com/repos/HackYourFuture/' + repo)
    .then(data => {
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
    }) // end of .then
    .catch(err => {
      container.id = 'alert-error';
      container.innerText =  err.message;
    })

    // contributor box
    const contributorBox = createAndAppend('div', container, { class: "contributorBox"});
    const contributorBoxTitle = createAndAppend('p', contributorBox, { class: "contributor-header", text: "Contributions"});
    const contributorList = createAndAppend('ul', contributorBox, { class: "contributor-list" });
    const contributorListArray = [];

    // fetchJSON function for the contributor box
    fetchJSON('https://api.github.com/repos/HackYourFuture/' + repo + '/contributors')
    .then(data => {
      for (let i = 0; i < data.length; i++) {
        let contributorItem = createAndAppend('li', contributorList, { class: "contributor-item", 'aria-label': data[i].login });
        contributorListArray.push(contributorItem);
        let contributorAvatar = createAndAppend('img', contributorItem, { class: "contributor-avatar", src: data[i].avatar_url });
        let contributorData = createAndAppend('div', contributorItem, { class: "contributor-data" });
        let contributorLink = createAndAppend('a', contributorData, {
          href: 'https://github.com/' + data[i].login,
          target: '_blank',
          text: data[i].login,
          class: "contributor-name",
        }); // end of the variable contributorLink
        let contributorBadge = createAndAppend('div', contributorItem, {class: "contributor-barge", text: data[i].contributions });
      } // end of for
    }) // end of .then
    .catch(err => {
      container.id = 'alert-error';
      container.innerText =  err.message;
    })
  }
  
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL);
}