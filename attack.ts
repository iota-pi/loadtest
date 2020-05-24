import axios from 'axios';

export const attack = async (url: string, requests: number, duration: number) => {
  console.log(
    `Attack will send ${requests} requests to ${url} over ${Math.floor(duration / 1000)} seconds`
  );
  const start = new Date().getTime();
  console.log(`Attack starting at: ${new Date()}`);
  console.log('----------------------------------------');

  const requestDelay = duration / Math.max(requests - 1, 1);
  let errors = 0;
  const responses: Promise<any>[] = [];
  for (let i = 0; i < requests; ++i) {
    const req = axios.get(url).catch(() => { errors++ });
    console.log('Sent request');
    responses.push(req);

    if (i < requests - 1) {
      await sleep(requestDelay);
    }
  }

  console.log(`${requests} requests sent`);
  await Promise.all(responses);
  console.log(`Attack completed at: ${new Date()}`);
  console.log(`Attack duration: ${(new Date().getTime() - start) / 1000}`);
  console.log(`Error responses received: ${errors}`);
}

function sleep (ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

if (process.argv.length < 2 + 3) {
  console.error('Requires 3 arguments: url requests duration')
  console.error('(where duration is in seconds)')
}
let [url, requests, duration] = process.argv.slice(2, 5);
const ms = +duration * 1000;
attack(url, +requests, ms);
