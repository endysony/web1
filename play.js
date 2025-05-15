document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.audio-toggle');
    const allAudios = document.querySelectorAll('audio');
    let currentAudio = null;
    let currentButton = null;

    function fadeIn(audio, duration = 2000) {
        audio.volume = 0;
        audio.play();
        const step = 0.05;
        const interval = duration * step;
        const fade = setInterval(() => {
            if (audio.volume < 1) {
                audio.volume = Math.min(audio.volume + step, 1);
            } else {
                clearInterval(fade);
            }
        }, interval);
    }

    function fadeOut(audio, duration = 1000, onComplete = () => {}) {
        const step = 0.05;
        const interval = duration * step;
        const fade = setInterval(() => {
            if (audio.volume > 0.05) {
                audio.volume = Math.max(audio.volume - step, 0);
            } else {
                clearInterval(fade);
                audio.pause();
                audio.volume = 1;
                onComplete();
            }
        }, interval);
    }

    buttons.forEach(button => {
        const parent = button.closest('div');
        const audio = parent.querySelector('audio');

        button.addEventListener('click', () => {
            const isSameAudio = audio === currentAudio;

            if (!audio.paused) {
                // Pause current audio with fade-out, keep currentTime
                fadeOut(audio, 3000, () => {
                    button.textContent = '▶';
                });
                currentAudio = audio;
                currentButton = button;
            } else {
                if (!isSameAudio && currentAudio && !currentAudio.paused) {
                    // Stop and reset previously playing audio
                    fadeOut(currentAudio, 500, () => {
                        if (currentButton) currentButton.textContent = '▶';
                        currentAudio.currentTime = 0;
                    });
                }

                fadeIn(audio, 500);
                button.textContent = '⏸';
                currentAudio = audio;
                currentButton = button;
            }
        });

        audio.addEventListener('ended', () => {
            button.textContent = '▶';
            currentAudio = null;
            currentButton = null;
        });
    });
});
