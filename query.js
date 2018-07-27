import config from './config/local.js';

export const searchSpot = async (type) => {
  try {
    const uri = `${config.server}/spot/search`;
    console.debug(`Requesting to ${uri} ...`);

    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type })
    });
    const spots = await response.json();
    console.debug(JSON.stringify(spots));
    return spots;

  } catch (e) {
    console.error(e.message());
  }
};