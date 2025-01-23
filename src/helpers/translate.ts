'use server';

export const translate = async (text: string): Promise<string> => {
  try {
    const res = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_AUTH_KEY}`,
      },
      body: JSON.stringify({ text: [text], target_lang: 'EN' }),
    });
    const { translations } = await res.json();

    return translations?.[0]?.text || text;
  } catch (e) {
    console.error('Translating failed.', e);
    return text;
  }
};
