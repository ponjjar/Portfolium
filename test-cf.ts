

const cloudflareToken = process.env.AI_CLOUDFLARE_TOKEN;
const accountId = process.env.AI_CLOUDFLARE_ACCOUNT_ID;

const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@google/gemini-3.5-flash-lite`;

async function test() {
  console.log('Testing Cloudflare...', url);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cloudflareToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'Você é um bot.' }] },
        contents: [{ role: 'user', parts: [{ text: 'Oi!' }] }]
      }),
    });
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    const data = await response.text();
    console.log('Data:', data);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
