export const translate = async (searchString: string): Promise<string> => {
  try {
    const res = await fetch(getUrl(searchString), { method: 'POST' });
    const { translations } = await res.json();
    return translations?.[0]?.text || searchString;
  } catch (e) {
    console.error('Translating failed.', e);
    return searchString;
  }
};

const getUrl = (searchString: string) =>
  `https://api-free.deepl.com/v2/translate?auth_key=${
    process.env.DEEPL_AUTH_KEY
  }&target_lang=EN&text=${encodeURIComponent(searchString)}`;
