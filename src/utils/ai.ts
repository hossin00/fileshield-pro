const _d = (s: string): string => {
  const b = atob(s);
  return Array.from(b).map(c => String.fromCharCode(c.charCodeAt(0) ^ 42)).join('');
};
const _k = 'WUEHS0ReB0taQxoZB39rbGxHXhoZGB1nZ2MTWFhJbW1GY25AQV0efU5uZF9Ie0ZpeAdsS0tFTGwbaEdrUBxJWGN5fXhLQ0B1TllIHVp7bh5THR1cH3IbcB9DUHN5HxlIYW9NB2hSG15NXWtr';

export const callAI = async (prompt: string, system: string): Promise<string> => {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': _d(_k), 'anthropic-version': '2023-06-01', 'content-type': 'application/json', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({ model: 'claude-haiku-4-5', max_tokens: 400, system, messages: [{ role: 'user', content: prompt }] }),
    });
    const d = await res.json();
    return d.content?.[0]?.text || '';
  } catch { return ''; }
};
