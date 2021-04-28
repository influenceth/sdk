const dayjs = require('dayjs')

// Difference in speed between Earth and Adalian time
const TIME_DILATION = 24

// The date time the calendar begins (in Earth time)
const TIME_ZERO = dayjs('2021-04-17T10:00:00+00:00')

// Helper contants
const MILLIS_PER_SECOND = 1000
const MILLIS_PER_MINUTE = MILLIS_PER_SECOND * 60
const MILLIS_PER_HOUR = MILLIS_PER_MINUTE * 60
const MILLIS_PER_DAY = MILLIS_PER_HOUR * 24
const DAYS_PER_YEAR = 6 * 4 * 12 // days * weeks * months
const DAYS_PER_TRANSIT_YEAR = 6 * 4 * 13 // (Leap) days * weeks * months (inc Zeus)
const DAYS_PER_TRANSIT_LEAP_YEAR = DAYS_PER_TRANSIT_YEAR + 5
const YEARS_PER_TRANSIT = 8
const TRANSITS_PER_LEAP = 7
const DAYS_PER_WEEK = 6
const DAYS_PER_MONTH = DAYS_PER_WEEK * 4

// Names
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday']
const WEEKS = ['1st', '2nd', '3rd', '4th', '5th']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December', 'Zeus'
]
const YEARS = ['Zeus', 'Aion', 'Bia', 'Chronos', 'Dionysus', 'Eos', 'Gaia', 'Hera']

// Helper methods
const isTransitYear = year => {
  return (year % YEARS_PER_TRANSIT) === 0
}

// Time class
class AdaliaTime {
  constructor(m) {
    this.millis = m;
  }

  /**
   * Converts Earth time to Adalia time
   * @param earthTime An ISO date string or daysjs object
   */
  static parseEarthTime = earthTime => {
    const et = dayjs(earthTime)
    // Earth time millis
    let m = et.valueOf()
    // Subtract the TIME_ZERO millis
    m -= TIME_ZERO.valueOf()
    // Multiply by time dilation
    m *= TIME_DILATION
  
    return new AdaliaTime(m)
  }

  /**
   * Converts Adalia time to Earth time
   * @returns A dayjs instance of the related Adalia time
   */
  toEarthTime() {
    let m = this.millis
    // Divide by time dilation
    m /= TIME_DILATION
    // Add the T  IME_ZERO millis
    m += TIME_ZERO.valueOf()

    return dayjs(m)
  }

  /**
   * Convert the milliseconds to an object with each element zero indexed.
   */
  toJSON() {
    // Time
    const milliseconds = this.millis % 1000
    const second = Math.floor(this.millis % MILLIS_PER_SECOND / 1000)
    const minute = Math.floor(this.millis % MILLIS_PER_MINUTE / MILLIS_PER_SECOND)
    const hour = Math.floor(this.millis % MILLIS_PER_HOUR / MILLIS_PER_MINUTE)

    // Year and Transit
    let days = Math.floor(this.millis / MILLIS_PER_DAY)
    let year = 0
    let transit = 0
    while (days >= DAYS_PER_TRANSIT_LEAP_YEAR) {
      if (isTransitYear(year)) {
        // This year is a transit year
        if (transit % TRANSITS_PER_LEAP === 0) {
          // This transit is a leap transit
          if (days < DAYS_PER_TRANSIT_LEAP_YEAR) {
            // We are still in this year
            break
          } else {
            days -= DAYS_PER_TRANSIT_LEAP_YEAR
          }
        } else {
          // Normal transit
          if (days < DAYS_PER_TRANSIT_YEAR) {
            // We are still in this year
            break
          } else {
            days -= DAYS_PER_TRANSIT_YEAR
          }
        }
        transit++
      } else {
        // Normal non transit year
        days -= DAYS_PER_YEAR
      }
      year++
    }
    if (days < 0) {
      //FIXME If this is ever hit the above calculation is fucked
      throw new Error('Incorrect year calculation. Back to the drawing board')
    }

    // Date
    const day = Math.floor(days % DAYS_PER_WEEK)
    const month = Math.floor(days / DAYS_PER_MONTH)
    const week = (days - (month * DAYS_PER_MONTH)) / DAYS_PER_WEEK

    return {
      milliseconds,
      second,
      minute,
      hour,
      day,
      week,
      month,
      year,
      transit,
    }
  }

  //TODO From JSON

  formatDateShort() {
    const { transit, year, month, week, day } = this.toJSON();
    return [transit, year, month, week, day].join(':')
  }

  formatDateLong() {
    const { transit, year, month, week, day } = this.toJSON();
    let m = month
    if (isTransitYear(year)) {
      // In a transit year the first month is Zeus
      m--
      if (m < 0){
        m = MONTHS.length - 1
      }
    }
    return `${WEEKS[week]} ${DAYS[day]} of ${MONTHS[m]}, ${YEARS[year % YEARS.length]}, Transit ${transit}`
  }

  formatTimeShort() {
    const { hour, minute, second } = this.toJSON();
    return [hour, minute, second].join(':')
  }

  formatShort() {
    return `${this.formatDateShort()}-${this.formatTimeShort()}`
  }

  formatLong() {
    return `${this.formatTimeShort()}, ${this.formatDateLong()}`
  }
}


module.exports = {
  TIME_DILATION,
  TIME_ZERO,
  AdaliaTime,
}