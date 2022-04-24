class Time {
  constructor() {
    this.currentTime = 0;
    this.time = 60000;
    this.timerInterval = 1000;
    this.intervalTimeout;
    this.callbackTimeout = function () {};
    this.callbackTimeInterval = function () {};
  }

  setTime() {
    this.time = 60000;
  }

  setCallbackTimeout(_callbackTimeout) {
    this.callbackTimeout = _callbackTimeout;
  }

  setCallbackTimeInterval(_callbackTimeInterval) {
    this.callbackTimeInterval = _callbackTimeInterval;
  }

  startTimer() {
    this.internalTimer = setInterval(() => {
      if (this.time <= 0) {
        clearInterval(this.internalTimer);
        clearTimeout(this.intervalTimeout);
        return true;
      } else {
        this.callbackTimeInterval();
        this.currentTime += this.timerInterval;
        this.time -= this.timerInterval;
      }
    }, this.timerInterval);

    this.time = this.time - this.currentTime;
    this.intervalTimeout = setTimeout(this.callbackTimeout, this.time);
    return this.time;
  }

  stopTimer() {
    clearInterval(this.internalTimer);
    clearTimeout(this.intervalTimeout);
    return "Paused";
  }

  resetTimer() {
    clearTimeout(this.intervalTimeout);
    clearInterval(this.internalTimer);
    this.time = 0;
    this.timerInterval = 1000;
    this.currentTime = 0;
    return "--";
  }

  getCurrentTime() {
    return this.time;
  }
}
