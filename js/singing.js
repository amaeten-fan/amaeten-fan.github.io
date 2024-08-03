document.addEventListener('DOMContentLoaded', function() {
  const webTitle = document.querySelector('title');
  const videoSelect = document.getElementById('videoSelect');
  const youtubeVideo = document.getElementById('youtubeVideo');
  const videoContainer = document.getElementById('videoContainer');
  const songsTable = document.getElementById('songsTable');
  const songsTableBody = songsTable.querySelector('tbody');
  const songsTableHead = songsTable.querySelector('thead tr');
  const singingFile = '../json/singing.json';

  let selectedVid = '';
  
  // 隱藏視頻和表格的函數
  function hideVideoAndTable() {
    if (youtubeVideo) {
      youtubeVideo.src = '';
    }
    if (videoContainer) {
      videoContainer.classList.toggle('hidden');
    }
    if (songsTable) {
      songsTable.classList.toggle('hidden');
    }
  }

  function updateVideoSrc(vid, timeInSeconds) {
    if (vid === 'default') {
      hideVideoAndTable();
      return;
    }
    videoContainer.classList.remove('hidden');
    if (timeInSeconds) {
      youtubeVideo.src = `https://www.youtube.com/embed/${vid}?start=${timeInSeconds}`;
    } else {
      youtubeVideo.src = `https://www.youtube.com/embed/${vid}`;
    }
  }

  function updateTable(videoData) {
    if (!videoData) {
      webTitle.textContent = '天廻てんの歌枠 | Amae Ten\'s Singing Stream (unofficial)';
      return;
    }
    webTitle.textContent = `天廻てんの歌枠 | ${videoData.title}`;
    songsTable.classList.remove('hidden');
    songsTableBody.innerHTML = '';

    const allNotesEmpty = videoData.songs.every(song => song.note === "");

    if (videoData.songs.length) {
      songsTableHead.innerHTML = `<tr class="select-disabled">
        <th>No.</th>
        <th>Time</th>
        <th>Song Name</th>
        <th>Author</th>
        ${!allNotesEmpty ? '<th>Note</th>' : ''}
      </tr>`;
    }

    videoData.songs.forEach((song, index) => {
      const row = document.createElement('tr');
      row.classList.add('song-row');
      row.innerHTML = `
        <td class="song-index">${index + 1}</td>
        <td class="song-time">
          <a href="javascript:void(0);" data-time="${song.time}" class="song-time">${song.time}</a>
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
        updateVideoSrc(videoData.vid, timeInSeconds);
      });
    });
  }

  videoSelect.addEventListener('change', () => {
    selectedVid = videoSelect.value;
    if (selectedVid === 'default') {
      hideVideoAndTable();
      webTitle.textContent = '天廻てんの歌枠 | Amae Ten\'s Singing Stream (unofficial)';
      history.replaceState(null, '', 'singing.html');
      // history.pushState({}, '', `singing.html`);
    } else {
      fetchJson(singingFile).then(data => {
        updateTable(data[selectedVid]);
      })
      .catch(error => console.error('Error fetching videos:', error));

      updateVideoSrc(selectedVid);
      // history.pushState({}, '', `singing.html?vid=${selectedVid}`);
      history.replaceState(null, '', `?vid=${selectedVid}`);
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const initialVid = urlParams.get('vid');
  const initialTime = urlParams.get('time');
  fetchJson(singingFile).then(data => {
    populateSelect(data);
    if (!initialVid) {
      hideVideoAndTable();
      return;
    }
    videoSelect.value = initialVid;
    updateTable(data[initialVid]);
    if (initialTime) {
      updateVideoSrc(initialVid, convertToSeconds(initialTime));
    } else {
      updateVideoSrc(initialVid);
    }
  })
  .catch(error => console.error('Error fetching videos:', error));

});

function populateSelect(data) {
  for (let key in data) {
    const date = new Date(data[key].timestamp * 1000);
    const formattedDate = formatDateString(date);

    const option = document.createElement('option');
    option.value = key;
    // option.textContent = `[${formattedDate}]`;
    option.textContent = `[${formattedDate}]${data[key].title}`;
    videoSelect.appendChild(option);
  }
}
