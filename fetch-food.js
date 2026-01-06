import fs from 'fs';

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

async function fetchFood() {
  const res = await fetch(
    `${STRAPI_URL}/api/foods?populate=photo&pagination[pageSize]=100`,
    {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status}`);
  }

  const json = await res.json();

  const foods = json.data.map(item => {
    const { id, attributes } = item;

    return {
      id,
      name: attributes.name,
      amount: attributes.amount,
      price: attributes.price,
      shop: attributes.shop,
      todate: attributes.todate,
      photoHash: attributes.photoHash,
      photo: (attributes.photo?.data || []).map(p => ({
        url: p.attributes.url,
        formats: p.attributes.formats,
        hash: p.attributes.hash,
      })),
    };
  });

  fs.writeFileSync(
    'food.json',
    JSON.stringify(foods, null, 2),
    'utf-8'
  );

  console.log(`✅ food.json generated, count=${foods.length}`);
}

fetchFood().catch(err => {
  console.error(err);
  process.exit(1);
});
