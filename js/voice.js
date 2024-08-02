document.addEventListener('DOMContentLoaded', function() {
  fetchJson('json/voice.json').then(buttons => {
    const buttonContainer = document.getElementById('buttonContainer');
    const customAudioControls = document.getElementById('customAudioControls');
    const seekBar = document.getElementById('seekBar');
    const playPauseButton = document.getElementById('playPauseButton');
    const loopButton = document.getElementById('loopButton');
    const currentTimeSpan = document.getElementById('currentTime');
    const totalTimeSpan = document.getElementById('totalTime');
    const volumeButton = document.getElementById('volumeButton');
    const volumeControlContent = document.querySelector('.volume-control-content');
    const volumeControl = document.getElementById('volumeControl');
    const playbackRateControl = document.getElementById('playbackRateControl');
    const moreOptionsButton = document.getElementById('moreOptionsButton');
    const moreOptionsContent = document.querySelector('.more-options-content');
    const hideControlsButton = document.getElementById('hideControlsButton');
    let lastVolume = 1;

    const audio = new Audio();

    let isPlaying = false;

    buttons.forEach(button => {
      const btn = document.createElement('button');
      btn.classList.add('voice-button');
      btn.type = 'button';
      btn.setAttribute('data-voice', button.voice);
      btn.textContent = button.label;
      buttonContainer.appendChild(btn);

      btn.addEventListener('click', function() {
        const voiceFile = button.voice;
        audio.src = voiceFile;
        customAudioControls.classList.remove('hidden');
        customAudioControls.classList.add('show');
        audio.play();
        playPauseButton.textContent = '⏸️';
      });
    });

    seekBar.addEventListener('input', function() {
      const seekTime = (seekBar.value / 100) * audio.duration;
      audio.currentTime = seekTime;
    });

    playPauseButton.addEventListener('click', function() {
      if (audio.paused) {
        audio.play();
        playPauseButton.textContent = '⏸️';
      } else {
        audio.pause();
        playPauseButton.textContent = '▶️';
      }
    });

    loopButton.addEventListener('click', function() {
      audio.loop = !audio.loop;
      loopButton.textContent = audio.loop ? 'Loop On' : 'Loop Off';
    });

    audio.addEventListener('timeupdate', function() {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      seekBar.value = (audio.currentTime / audio.duration) * 100;
      currentTimeSpan.textContent = formatTime(currentTime);
      totalTimeSpan.textContent = formatTime(duration);
    });

    audio.addEventListener('ended', function() {
      playPauseButton.textContent = '▶️';
      customAudioControls.classList.remove('show');
      setTimeout(() => {
        customAudioControls.classList.add('hidden');
      }, 500);
    });

    volumeButton.addEventListener('click', function() {
      // volumeControlContent.classList.toggle('hidden');
      if (audio.muted) {
        audio.muted = false;
        volumeButton.textContent = '🔊';
        volumeControl.value = lastVolume;
        audio.volume = lastVolume;
      } else {
        lastVolume = audio.volume;
        audio.muted = true;
        volumeButton.textContent = '🔇';
        volumeControl.value = 0;
      }
    });

    volumeButton.addEventListener('mouseenter', function() {
      volumeControlContent.classList.remove('hidden');
    })

    volumeControlContent.addEventListener('mouseenter', function() {
      volumeControlContent.classList.remove('hidden');
    })

    volumeButton.addEventListener('mouseleave', function() {
      volumeControlContent.classList.add('hidden');
    })

    volumeControlContent.addEventListener('mouseleave', function() {
      volumeControlContent.classList.add('hidden');
    })

    document.addEventListener('click', function(event) {
      if (!volumeButton.contains(event.target) && !volumeControlContent.contains(event.target)) {
        volumeControlContent.classList.add('hidden');
      }
    });

    volumeControl.addEventListener('input', function() {
      audio.volume = volumeControl.value;
      if (audio.volume === 0) {
        audio.muted = true;
        volumeButton.textContent = '🔇';
      } else {
        audio.muted = false;
        volumeButton.textContent = '🔊';
      }
    });

    moreOptionsButton.addEventListener('click', function() {
      moreOptionsContent.classList.toggle('hidden');
    });

    document.addEventListener('click', function(event) {
      if (!moreOptionsButton.contains(event.target) && !moreOptionsContent.contains(event.target)) {
        moreOptionsContent.classList.add('hidden');
      }
    });

    playbackRateControl.addEventListener('change', function() {
      audio.playbackRate = playbackRateControl.value;
    });

    hideControlsButton.addEventListener('click', function() {
      customAudioControls.classList.remove('show');
      setTimeout(() => {
        customAudioControls.classList.add('hidden');
      }, 500); // 與 CSS 中的 transition 時間一致
    });
  })
  .catch(error => console.error('Error loading buttons:', error));
});

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}