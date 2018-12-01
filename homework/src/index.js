'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response);
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

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
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      
      const root = document.getElementById('root');
      // creating header with a title and dropdown-menu
      const header = createAndAppend('header', root, { class: "header" });
      const headerTitle = createAndAppend('p', header, { text: "HYF Repositories" });
      const selector = createAndAppend('select', header, {
        class: 'repo-selector',
        'aria-label': "HYF Repositories"
      });
      
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        // container
        const container = createAndAppend('div', root, {id: "container" });
        selector.onchange = () => showInfo(selector.options[selector.selectedIndex].text, container); // !!
        // sorting repos
        data.sort((a, b) => (a.name).localeCompare(b.name)); // explain!
        // an array of repo options
        const optionArray = [];
        for(let i = 0; i < data.length; i++) {
          let option = createAndAppend('option', selector, { value: i, text: data[i].name});
          optionArray.push(option);    
      };
      showInfo(selector.options[0].text, container); // chooses the first option in selector
    }
    })
  }

  function showInfo(repo, container) {
    container.innerHTML = ""; // set it to "" every time the option get selected
    // infoBox
    const infoBox = createAndAppend('table', container, { class: "infoBox" });
    const tableBody = createAndAppend('tbody', infoBox, {});
    // ROW 1 - repository link row
    const row1 = createAndAppend('tr', tableBody, {});

    // fetching data for InfoBox - ROW 1
    fetchJSON('https://api.github.com/repos/HackYourFuture/' + repo, (err, data) => {
      if (err) {
        createAndAppend('div', repoRow, { text: err.message, class: 'alert-error' });
      } else {
        const row1A = createAndAppend('td', row1, { class: "label", text: "Repository: " });
        const row1B = createAndAppend('td', row1, {});
        const repoLink = createAndAppend('a', row1B, {
          href: 'https://github.com/HackYourFuture/' + repo,
          target: '_blank',
          text: repo,
        });
      }

      // ROW 2 - description row
      const row2 = createAndAppend('tr', tableBody, {});
      const row2A = createAndAppend('td', row2, { class: "label", text: "Description: " });
      const row2B = createAndAppend('td', row2, { text: data.description });
      // ROW 3 - forks row
      const row3 = createAndAppend('tr', tableBody, {});
      const row3A = createAndAppend('td', row3, { class: "label", text: "Forks: " });
      const row3B = createAndAppend('td', row3, { text: data.forks_count });
      // ROW 4 - 'updated' row
      const row4 = createAndAppend('tr', tableBody, {});
      const row4A = createAndAppend('td', row4, { class: "label", text: "Updated: " });
      const date = new Date(data.updated_at).toUTCString();
      const row4B = createAndAppend('td', row4, { text: date });
    });
    
    // contributorBox with unordered list of contributors
    const contributorBox = createAndAppend('div', container, { class: "contributorBox"});
    const contributorBoxTitle = createAndAppend('p', contributorBox, { class: "contributor-header", text: "Contributions"});
    const contributorList = createAndAppend('ul', contributorBox, { class: "contributor-list" });
    const contributorListArray = [];

    // fetching data for contributorBox list array
    fetchJSON('https://api.github.com/repos/HackYourFuture/' + repo + '/contributors', (err, data) => {
      if (err) {
        createAndAppend('div', repoRow, { text: err.message, class: 'alert-error' });
      } else {
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
          });
          let contributorBadge = createAndAppend('div', contributorItem, {class: "contributor-barge", text: data[i].contributions });
        }
        
      }
    });

  }
  
  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';
  
  window.onload = () => main(HYF_REPOS_URL);
}
