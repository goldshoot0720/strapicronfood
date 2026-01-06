import fs from 'fs';
import fetch from 'node-fetch';

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_URL || !STRAPI_TOKEN) {
  throw new Error("STRAPI_URL or STRAPI_TOKEN is not set");
}

async function fetchFood() {
  const res = await fetch(`${STRAPI_URL}/foods`, {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`
    }
  });

  const data = await res.json();

  const simplified = data.map(item => ({
    name: item.name,
    amount: item.amount,
    price: item.price,
    shop: item.shop,
    todate: item.todate,
    photo: item.photo,
    photoHash: item.photoHash
  }));

  fs.writeFileSync('food.json', JSON.stringify(simplified, null, 2));
  console.log('food.json generated');
}

fetchFood().catch(console.error);
