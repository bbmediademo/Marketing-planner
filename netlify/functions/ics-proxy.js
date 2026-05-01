exports.handler = async (event) => {
  const { url } = event.queryStringParameters || {};
  if (!url) {
    return { statusCode: 400, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'Missing url parameter' }) };
  }

  // Convert webcal:// to https://
  const cleanUrl = decodeURIComponent(url).replace(/^webcal:\/\//i, 'https://');

  try {
    const response = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CalendarFetcher/1.0)',
        'Accept': 'text/calendar, text/plain, */*',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Outlook gaf status ${response.status} terug. Controleer of de ICS-link correct is en publiek toegankelijk.` }),
      };
    }

    const text = await response.text();

    if (!text.includes('BEGIN:VCALENDAR')) {
      return {
        statusCode: 422,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'De URL geeft geen geldige agenda (ICS) terug. Gebruik de ICS-link, niet de HTML-link.' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: text,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Kon URL niet bereiken: ${err.message}` }),
    };
  }
};
