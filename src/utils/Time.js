class Time {

  // Default time acceleration (# of in-game seconds per real second)
  static DEFAULT_TIME_ACCELERATION = 24;

  static toGameDuration (inRealityDuration, timeAcceleration) {
    return inRealityDuration * (timeAcceleration || Time.DEFAULT_TIME_ACCELERATION);
  }

  static toRealDuration (inGameDuration, timeAcceleration) {
    return inGameDuration / (timeAcceleration || Time.DEFAULT_TIME_ACCELERATION);
  }

  static getSecondsPerAday (timeAcceleration = null) {
    return 86400 / (timeAcceleration || Time.DEFAULT_TIME_ACCELERATION);
  }


  // Zero date timestamp for in-game clock display
  static CLOCK_ZERO_TIMESTAMP = 1618668000;

  // Zero date timestamp for orbits
  static ORBIT_ZERO_TIMESTAMP = 1609459200;

  constructor (unixTimeMS, secondsPerAday = null) {
    this.unixTimeMS = unixTimeMS;
    this.secondsPerAday = secondsPerAday || Time.getSecondsPerAday();
  }

  static fromGameClockADays (adalianClockTime, timeAcceleration = null) {
    // convert from adays to elapsed seconds, then shift to zero timestamp
    const secondsPerAday = Time.getSecondsPerAday(timeAcceleration);
    return new Time(
      1000 * (adalianClockTime * secondsPerAday + Time.CLOCK_ZERO_TIMESTAMP),
      secondsPerAday
    );
  }

  static fromOrbitADays (elapsedOrbitADays, timeAcceleration = null) {
    // convert from adays to elapsed seconds, then shift to zero timestamp
    const secondsPerAday = Time.getSecondsPerAday(timeAcceleration);
    return new Time(
      1000 * (elapsedOrbitADays * secondsPerAday + Time.ORBIT_ZERO_TIMESTAMP),
      secondsPerAday
    );
  }

  static fromUnixSeconds (unixTime, timeAcceleration = null) {
    return new Time(unixTime * 1000, Time.getSecondsPerAday(timeAcceleration));
  }

  static fromUnixMilliseconds (unixTime, timeAcceleration = null) {
    return new Time(unixTime, Time.getSecondsPerAday(timeAcceleration));
  }

  /**
   * Return the game clock time (in adays)
   * @returns
   */
  toGameClockADays (format = false) {
    let adays = (this.unixTimeMS / 1000 - Time.CLOCK_ZERO_TIMESTAMP) / this.secondsPerAday;
    if (format) adays = adays.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return adays;
  }

  /**
   * Return elapsed orbit time (in adays)
   * @returns
   */
  toOrbitADays () {
    return (this.unixTimeMS / 1000 - Time.ORBIT_ZERO_TIMESTAMP) / this.secondsPerAday;
  }

  /**
   * Returns a date object
   * @returns
   */
  toDate () {
    return new Date(this.unixTimeMS);
  }
}

export default Time;
