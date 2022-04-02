/**
 * @public
 * @param {string} frameStamp
 */
export const getMillisecondsFromFrameStamp = frameStamp => {
  const timestamp = Date.parse(`2019-01-01T${frameStamp}Z`);
  return (
    new Date(timestamp).getMinutes() * 60 * 1000 +
    new Date(timestamp).getSeconds() * 1000 +
    new Date(timestamp).getMilliseconds()
  );
};

export const millisecondsToTime = milliseconds => {
  const ms = milliseconds % 1000;
  milliseconds = (milliseconds - ms) / 1000;
  const secs = milliseconds % 60;
  milliseconds = (milliseconds - secs) / 60;
  const mins = milliseconds % 60;
  const hrs = (milliseconds - mins) / 60;
  const string =
    (mins < 10 ? '0' : '') +
    mins +
    ':' +
    (secs < 10 ? '0' : '') +
    secs +
    '.' +
    (ms < 10 ? '0' : '') +
    `${ms}`.substring(0, 2);
  if (hrs <= 0) return string;
  return (hrs < 10 ? '0' : '') + hrs + ':' + string;
};
