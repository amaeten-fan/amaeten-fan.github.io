document.addEventListener('DOMContentLoaded', function() {

  // profile-section

  document.querySelectorAll('.tooltip').forEach(tooltip => {
    const color = tooltip.getAttribute('data-tooltip-color');
    if (color) {
      tooltip.addEventListener('mouseover', () => {
        tooltip.style.setProperty('--tooltip-bg-color', color);
      });
    }
  });

  const profileMore = document.getElementById('profile-more');
  if (profileMore) {
    profileMore.addEventListener('click', function() {
      profileMore.classList.add('hidden');
      document.querySelectorAll('.profile-more').forEach(item => {
        item.classList.toggle('hidden');
      });
    });
  }

  // biography-section

  const toggleButtons = document.querySelectorAll('.toggleButton');

  toggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetyearTable = document.getElementById(targetId);

      const expanded = this.getAttribute('aria-expanded') === 'true' || false;
      this.setAttribute('aria-expanded', !expanded);
      if (!expanded) {
        targetyearTable.classList.remove('hidden');
      } else {
        targetyearTable.classList.add('hidden');
      }
      // targetyearTable.style.display = expanded ? 'none' : 'block';
    });
  });

  // songs-section

  const coverTable = $('.cover');
  let currentSortKey = null;
  let currentSortOrder = 'asc';
  let coverData = null;

  const coverTableHead = coverTable.querySelector('thead');
  coverTableHead.addEventListener('click', function(event) {
    const target = event.target.closest('th[data-sort]');
    if (target) {
      handleSortClick(target);
    }
  });

  function handleSortClick(header) {
    const sortKey = header.dataset.sort;
    if (currentSortKey === sortKey) {
      currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortKey = sortKey;
      currentSortOrder = 'asc';
    }
    const sortedData = sortData(coverData, sortKey, currentSortOrder);
    createCoverTableRows(sortedData);
    updateSortIndicators();
  }

  function updateSortIndicators() {
    coverTable.querySelectorAll('th[data-sort]').forEach(header => {
      const sortKey = header.dataset.sort;
      header.classList.remove('sort-asc', 'sort-desc');
      if (sortKey === currentSortKey) {
        header.classList.add(currentSortOrder === 'asc' ? 'sort-asc' : 'sort-desc');
      }
    });
  }

  function createCoverTableRows(data, isFirst = false) {
    const coverTableBody = coverTable.querySelector('tbody');
    coverTableBody.innerHTML = '';

    data.forEach(item => {
      const row = document.createElement('tr');

      const thumbnailUrl = youtubeThumbnailUrl(item.id);
      const imgElement = document.createElement('img');
      imgElement.alt = item.title;
      if (isFirst) {
        imgElement.dataset.src = thumbnailUrl;
        imageObserver.observe(imgElement);
      } else {
        imgElement.src = thumbnailUrl;
      }

      const linkElement = document.createElement('a');
      linkElement.href = item.url;
      linkElement.target = '_blank';
      linkElement.appendChild(imgElement);

      const indexCell = document.createElement('td');
      indexCell.className = 'song-index';
      indexCell.innerHTML = `${item.index + 1} `;
      indexCell.appendChild(linkElement);
      row.appendChild(indexCell);

      const exLinkElement = document.createElement('span');
      exLinkElement.className = 'ex-link';

      const titleElement = document.createElement('a');
      titleElement.href = item.url;
      titleElement.target = '_blank';
      titleElement.textContent = item.title;
      titleElement.appendChild(exLinkElement);

      const titleCell = document.createElement('td');
      titleCell.appendChild(titleElement);
      row.appendChild(titleCell);

      const date = new Date(item.timestamp * 1000);
      const formattedDate = formatDateString(date);

      const dateCell = document.createElement('td');
      dateCell.textContent = formattedDate;
      row.appendChild(dateCell);

      let noteContent = item.note;
      const memberOnlyText = '※ メンバー限定';

      const noteCell = document.createElement('td');
      noteCell.className = 'note';

      if (noteContent.includes(memberOnlyText)) {
        const parts = noteContent.split(memberOnlyText);

        if (parts[0]) {
          noteCell.appendChild(document.createTextNode(parts[0]));
        }

        const exLinkElement = document.createElement('span');
        exLinkElement.className = 'ex-link';

        const memberOnlyLink = document.createElement('a');
        memberOnlyLink.href = 'https://www.youtube.com/@amaeten_fsp/join';
        memberOnlyLink.target = '_blank';
        memberOnlyLink.style.color = '#2ba640';
        memberOnlyLink.style.backgroundColor = 'rgba(255,255,255,0.1)';
        memberOnlyLink.textContent = memberOnlyText;
        memberOnlyLink.appendChild(exLinkElement);
        noteCell.appendChild(memberOnlyLink);

        if (parts[1]) {
          noteCell.appendChild(document.createTextNode(parts[1]));
        }
      } else {
        noteCell.textContent = noteContent;
      }
      row.appendChild(noteCell);

      coverTableBody.appendChild(row);
    });
  }

  function sortData(data, key, order) {
    return data.sort((a, b) => {
      if (key === 'date') {
        const timestampA = new Date(a[key]).getTime();
        const timestampB = new Date(b[key]).getTime();
        return (order === 'asc' ? timestampA - timestampB : timestampB - timestampA);
      } else if (key === 'index') {
        return (order === 'asc' ? a.index - b.index : b.index - a.index);
      } else {
        return (order === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]));
      }
    });
  }

  const coverFile = '../json/covers.json';
  fetchJson(coverFile).then(data => {
    coverData = data.map((item, index) => ({ ...item, index }));
    createCoverTableRows(coverData, true);
  })
  .catch(error => console.error('Error loading the JSON file:', error));

  // singing-stream-section

  const songsTable = document.getElementById('songs-table');
  songsTable.classList.toggle('hidden');

  function updateTable(videoData) {
    const singingLatestTitle = document.getElementById('singing-latest-title');
    const songsTableHead = songsTable.querySelector('thead');
    const songsTableBody = songsTable.querySelector('tbody');
    const date = new Date(videoData.timestamp * 1000);
    const formattedDate = formatDateString(date);
    singingLatestTitle.insertAdjacentHTML('afterend', `<div style="text-align: center;">
      <img alt="${videoData.title}" src=${youtubeThumbnailUrl(videoData.vid)} style="width: 360px;">
    <h4>[${formattedDate}] ${videoData.title}</h4>
    </div>`);
    songsTable.classList.remove('hidden');
    songsTableBody.innerHTML = '';

    // 檢查所有 note 欄位是否都是空的
    const allNotesEmpty = videoData.songs.every(song => song.note === '');

    // 動態生成表格頭部
    songsTableHead.innerHTML = `<tr class="select-disabled">
      <th>No.</th>
      <th>Time</th>
      <th>Song Name</th>
      <th>Author</th>
      ${!allNotesEmpty ? '<th>Note</th>' : ''}
    </tr>`;

    videoData.songs.forEach((song, index) => {
      const row = document.createElement('tr');
      row.classList.add('song-row');
      row.innerHTML = `
        <td class="song-index">${index + 1}</td>
        <td class="song-time">
          <a href="singing.html?vid=${videoData.vid}&time=${song.time}" class="song-time">${song.time}</a>
        </td>
        <td class="song-name">${song.name}</td>
        <td class="song-author">${song.author}</td>
        ${!allNotesEmpty ? `<td class="song-note">${song.note}</td>` : ''}
      `;
      songsTableBody.appendChild(row);
    });

    document.querySelectorAll('.song-time').forEach(link => {
      link.addEventListener('click', event => {
        const timeString = event.target.dataset.time;
        const timeInSeconds = convertToSeconds(timeString);
        // updateVideoSrc(videoData.vid, timeInSeconds);
      });
    });
  }


  const archiveButton = document.querySelector('.singing-archive-title');
  if (archiveButton) {
    archiveButton.addEventListener('click', function() {
      const archiveTable = document.getElementById('singing-archive-table');
      if (!archiveTable) return;
      const archiveExpended = archiveButton.getAttribute('aria-expanded') === 'true' || false;
      archiveButton.setAttribute('aria-expanded', !archiveExpended);
      archiveTable.style.display = archiveExpended ? 'none' : 'block';
    });
  }

  const singingFile = '../json/singing.json';

  fetchJson(singingFile).then(data => {
    const archiveTableBody = document.querySelector('.singing-archive tbody');
    const latestArchiveTableBody = document.querySelector('.singing-latest');

    const dataArray = Object.keys(data).map(vid => ({ ...data[vid], vid }));

    function createSingingTableRows(data) {
      archiveTableBody.innerHTML = '';
      data.forEach((item, index) => {

        if (index === data.length - 1) {
          updateTable(item);
        }

        const row = document.createElement('tr');

        const thumbnailUrl = youtubeThumbnailUrl(item.vid);
        const streamUrl = `singing.html?vid=${item.vid}`;

        const linkElement = document.createElement('a');
        linkElement.href = streamUrl;
        linkElement.style.color = 'unset';

        const imgElement = document.createElement('img');
        imgElement.dataset.src = thumbnailUrl;
        imgElement.alt = item.title;

        const textElement = document.createTextNode(` ${item.title}`);

        linkElement.appendChild(imgElement);
        linkElement.appendChild(textElement);

        const titleCell = document.createElement('td');
        titleCell.appendChild(linkElement);

        const date = new Date(item.timestamp * 1000);
        const formattedDate = formatDateString(date);

        const dateCell = document.createElement('td');
        dateCell.textContent = formattedDate;

        row.appendChild(titleCell);
        row.appendChild(dateCell);

        archiveTableBody.appendChild(row);

        imageObserver.observe(imgElement);
      });
    }

    createSingingTableRows(dataArray);

  })
  .catch(error => console.error('Error loading the JSON file:', error));

});

const observerOptions = {
  root: null, // 默認為視口
  rootMargin: '0px',
  threshold: 0.1 // 10%的圖片出現在視口中時觸發
};

// IntersectionObserver setup
const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.getAttribute('data-src');

      preloadImage(img.src, function(isValid) {
        if (!isValid) {
          handleImageError(img);
        }
      });

      img.removeAttribute('data-src');
      observer.unobserve(img);
    }
  });
}, observerOptions);

const sizes = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];

function getCurrentSize(url) {
  for (let size of sizes) {
    if (url.includes(size)) {
      return size;
    }
  }
  return null;
}

function getNextSize(currentSize) {
  // const sizes = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];
  const currentIndex = sizes.indexOf(currentSize);
  if (currentIndex === -1 || currentIndex === sizes.length - 1) {
    return null;
  }
  return sizes[currentIndex + 1];
}

function preloadImage(url, callback) {
  const img = new Image();
  img.onload = function() {
    const isValid = img.width > 120 && img.height > 90;
    callback(isValid);
  };
  img.onerror = function() {
    callback(false);
  };
  img.src = url;
}

function handleImageError(img) {
  const currentSize = getCurrentSize(img.src);
  const nextSize = getNextSize(currentSize);
  if (nextSize) {
    img.src = img.src.replace(currentSize, nextSize);
  } else {
    img.alt = 'Image not available';
  }
}
