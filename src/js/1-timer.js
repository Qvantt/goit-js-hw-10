let userSelectedDate = null;
const startButton = document.querySelector('button[data-start]');
const datetimePicker = document.getElementById('datetime-picker');
const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

startButton.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(datetimePicker, options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  timerFields.days.textContent = addLeadingZero(days);
  timerFields.hours.textContent = addLeadingZero(hours);
  timerFields.minutes.textContent = addLeadingZero(minutes);
  timerFields.seconds.textContent = addLeadingZero(seconds);
}

function startTimer() {
  const intervalId = setInterval(() => {
    const now = new Date();
    const timeRemaining = userSelectedDate - now;

    if (timeRemaining <= 0) {
      clearInterval(intervalId);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      datetimePicker.disabled = false;
      startButton.disabled = true;
      return;
    }

    const time = convertMs(timeRemaining);
    updateTimerDisplay(time);
  }, 1000);
}

startButton.addEventListener('click', () => {
  datetimePicker.disabled = true;
  startButton.disabled = true;
  startTimer();
});
