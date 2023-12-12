class Time {
  constructor (unixTimeMS) {
    this.unixTimeMS = unixTimeMS;
  }

  // Default time acceleration (# of in-game seconds per real second)
  static DEFAULT_TIME_ACCELERATION = 24;

  // Zero date timestamp for in-game clock display
  static CLOCK_ZERO_TIMESTAMP = 1618668000;

  // Zero date timestamp for orbits
  static ORBIT_ZERO_TIMESTAMP = 1609459200;

  static fromGameClockADays (adalianClockTime) {
    // convert from adays to elapsed seconds, then shift to zero timestamp
    return new Time(
      1000 * (adalianClockTime * 3600 + Time.CLOCK_ZERO_TIMESTAMP)
    );
  }

  static fromOrbitADays (elapsedOrbitADays) {
    // convert from adays to elapsed seconds, then shift to zero timestamp
    return new Time(
      1000 * (elapsedOrbitADays * 3600 + Time.ORBIT_ZERO_TIMESTAMP)
    );
  }

  static fromUnixTime (unixTime, isMS = true) {
    return new Time(unixTime * (isMS ? 1 : 1000));
  }

  static toGameDuration (inRealityDuration, timeAcceleration) {
    return inRealityDuration * (timeAcceleration || Time.DEFAULT_TIME_ACCELERATION);
  }

  static toRealDuration (inGameDuration, timeAcceleration) {
    return inGameDuration / (timeAcceleration || Time.DEFAULT_TIME_ACCELERATION);
  }

  /**
   * Return the game clock time (in adays)
   * @returns
   */
  toGameClockADays (format = false) {
    let adays = (this.unixTimeMS / 1000 - Time.CLOCK_ZERO_TIMESTAMP) / 3600;
    if (format) adays = adays.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return adays;
  }

  /**
   * Return elapsed orbit time (in adays)
   * @returns
   */
  toOrbitADays () {
    return (this.unixTimeMS / 1000 - Time.ORBIT_ZERO_TIMESTAMP) / 3600;
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
