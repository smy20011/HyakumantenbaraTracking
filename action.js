#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios');
const path = require('path');
const process = require('process');

// for you to change easily
const dataFolder = '/data';
const now = new Date();
const pathToData = path.join(__dirname, dataFolder, fileString(now)) + '.json';

// scrape data, possibly using prior data
async function getData() {
	let result = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCgIfLpQvelloDi8I0Ycbwpg&fields=items/statistics/subscriberCount&key=${process.env.API_KEY}`);
	return {
		"sub_count": result.data.items[0].statistics.subscriberCount,
		"time": new Date().toUTCString(),
	};
}

// execute and persist data
getData() // no top level await... yet
  .then(data => {
    console.log(data);
    // persist data
    fs.appendFileSync(path.resolve(pathToData), JSON.stringify(data) + "\n");
  });

/**
 *
 * utils
 *
 */
function fileString(ts) {
  const year = ts.getUTCFullYear();
  const month = (ts.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = ts
    .getUTCDate()
    .toString()
    .toString()
    .padStart(2, '0');
  const name = `${year}-${month}-${day}`;
  return name;
}
