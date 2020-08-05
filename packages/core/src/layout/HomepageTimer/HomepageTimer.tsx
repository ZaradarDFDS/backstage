/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC } from 'react';
import { HeaderLabel } from '../HeaderLabel';

const timeFormat = { hour: '2-digit', minute: '2-digit' };
const utcOptions = { timeZone: 'UTC', ...timeFormat };
const cphOptions = { timeZone: 'Europe/Copenhagen', ...timeFormat };
const istOptions = { timeZone: 'Europe/Istanbul', ...timeFormat };
const gmsOptions = { timeZone: 'Europe/London', ...timeFormat };

const defaultTimes = {
  timeNY: '',
  timeUTC: '',
  timeTYO: '',
  timeSTO: '',
  timeCPH: '',
  timeIST: '',
  timeGMS: '',
};

function getTimes() {
  const d = new Date();
  const lang = window.navigator.language;

  // Using the browser native toLocaleTimeString instead of huge moment-tz
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleTimeString
  const timeUTC = d.toLocaleTimeString(lang, utcOptions);
  const timeCPH = d.toLocaleTimeString(lang, cphOptions);
  const timeIST = d.toLocaleTimeString(lang, istOptions);
  const timeGMS = d.toLocaleTimeString(lang, gmsOptions);

  return { timeUTC, timeCPH, timeIST, timeGMS };
}

export const HomepageTimer: FC<{}> = () => {
  const [{ timeUTC, timeCPH, timeIST, timeGMS }, setTimes] = React.useState(
    defaultTimes,
  );

  React.useEffect(() => {
    setTimes(getTimes());

    const intervalId = setInterval(() => {
      setTimes(getTimes());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <HeaderLabel label="UTC" value={timeUTC} />
      <HeaderLabel label="GMS" value={timeGMS} />
      <HeaderLabel label="CPH" value={timeCPH} />
      <HeaderLabel label="IST" value={timeIST} />
    </>
  );
};
