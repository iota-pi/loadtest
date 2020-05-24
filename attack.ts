import axios from 'axios';

export const attack = async (url: string, requests: number, duration: number) => {
  console.log(
    `Attack will send ${requests} requests to ${url} over ${Math.floor(duration / 1000)} seconds`
  );
  const start = new Date().getTime();
  console.log(`Attack starting at: ${new Date()}`);
  console.log('----------------------------------------');

  const requestDelay = duration / Math.max(requests - 1, 1);
  const responses: Promise<any>[] = [];
  for (let i = 0; i < requests; ++i) {
    const req = requestWithTime(url);
    responses.push(req);

    if (i < requests - 1) {
      await sleep(requestDelay);
    }
  }

  console.log(`${requests} requests sent`);
  const results = await Promise.all(responses);
  const elapsedTime = (new Date().getTime() - start) / 1000;
  const errors = results.reduce((acc, { error }) => acc + error, 0);
  const totalDuration = results.reduce((acc, { duration }) => acc + duration, 0);
  const averageDuration = totalDuration / requests;
  const minDuration = Math.min(...results.map(r => r.duration));
  const maxDuration = Math.max(...results.map(r => r.duration));

  console.log(`Attack completed at: ${new Date()}`);
  console.log(`Attack duration: ${elapsedTime}`);
  console.log(`Error responses received: ${errors}`);
  console.log(`Response time in ms (min/avg/max): ${minDuration}/${averageDuration}/${maxDuration}`);
}

function sleep (ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function requestWithTime (url: string) {
  let error = false;
  const start = new Date().getTime();
  await axios.get(url).catch(() => error = true);
  const duration = new Date().getTime() - start;

  return {
    error,
    duration,
  };
}

if (process.argv.length < 2 + 3) {
  console.error('Requires 3 arguments: url requests duration')
  console.error('(where duration is in seconds)')
}
let [url, requests, duration] = process.argv.slice(2, 5);
const ms = +duration * 1000;
attack(url, +requests, ms);
