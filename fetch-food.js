import fs from 'fs';
import fetch from 'node-fetch';

const STRAPI_API_URL = process.env.STRAPI_API_URL;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

if (!STRAPI_API_URL || !STRAPI_TOKEN) {
  console.error("⚠️ STRAPI_API_URL or STRAPI_TOKEN is missing");
  process.exit(1);
}

async function fetchFood() {
  try {
    const res = await fetch(`${STRAPI_API_URL}/api/foods?populate=photo`, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} - ${res.statusText}`);
    }

    const json = await res.json();
    // 防呆: v5 或 v4 attributes
    const foods = json.data.map(item => {
      const data = item.attributes ?? item;

      return {
        id: item.id,
        name: data.name,
        amount: data.amount,
        price: data.price,
        shop: data.shop,
        todate: data.todate,
        photoHash: data.photoHash,
        photo: (data.photo || []).map(p => ({
          url: p.url,
          hash: p.hash,
          formats: p.formats
        })),
      };
    });

    fs.writeFileSync('food.json', JSON.stringify(foods, null, 2));
    console.log(`✅ food.json saved, ${foods.length} items`);

  } catch (err) {
    console.error("❌ Failed to fetch food:", err);
    process.exit(1);
  }
}

fetchFood();
