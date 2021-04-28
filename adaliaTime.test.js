const time = require('./adaliaTime');
const { AdaliaTime } = time;

const TIME_ZERO_ISO = '2021-04-17T10:00:00+00:00'

test('correct zero day', () => {
  const zero = AdaliaTime.parseEarthTime(TIME_ZERO_ISO);
  expect(zero.millis).toBe(0);
  expect(zero.formatDateShort()).toBe("0:0:0:0:0");
  expect(zero.formatTimeShort()).toBe("0:0:0");
  expect(zero.toEarthTime().diff(time.TIME_ZERO)).toBe(0);

  expect(zero.formatDateLong()).toBe("1st Monday of Zeus, Zeus, Transit 0");
});

//TODO A ton more tests