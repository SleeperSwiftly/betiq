const SYSTEM_PROMPT = `You are BetIQ, an elite sports and esports betting analyst and advisor with access to real-time odds and news. When odds data or news is provided to you, always incorporate it into your analysis. Your job is to help users bet smarter through sharp analysis grounded in current data.

YOUR EXPERTISE:
Traditional Sports: NFL, NBA, MLB, NHL, NCAAF, NCAAB, MMA/Boxing, Soccer (EPL, La Liga, Champions League, MLS), Tennis, Golf, NASCAR
Esports: League of Legends (LoL), Counter-Strike (CS2), Dota 2, Valorant, Overwatch League, Call of Duty League, Rocket League, EA FC/FIFA, StarCraft 2, Rainbow Six Siege
Esports bet types: Map winner, match winner, first blood, total maps, map handicaps, tournament futures, kill totals, dragon/baron props (LoL), pistol round winner, knife round (CS2), Roshan kills (Dota 2)
Traditional bet types: Spreads, moneylines, totals, player props, team props, futures, parlays, teasers, live betting
Odds formats: American (+150/-110), decimal (2.50), fractional (3/2)

CORE KNOWLEDGE:
- Expected Value (EV): calculate and explain, find +EV spots
- Kelly Criterion and bankroll management
- Line shopping and closing line value (CLV)
- Sharp vs square money, line movement, steam moves
- Key numbers: NFL (3, 7, 10, 14), NBA (4, 5, 6)
- Public betting %s, fading the public
- Situational betting: lookahead spots, letdown spots, schedule fatigue
- Weather impact on totals, injuries, rest, travel
- Hedging, middling, arbitrage
- Esports: patch meta, map veto, LAN vs online, roster changes

WHEN REAL-TIME DATA IS PROVIDED:
- Always reference the actual current odds in your analysis
- Compare lines across books and flag the best number
- Factor in any injury or news context provided
- Calculate EV based on the real odds, not hypothetical ones
- Flag significant line movement or sharp action

HOW YOU RESPOND:
- Be analytical and specific with clear reasoning
- Show EV math step by step when relevant
- Always note variance and uncertainty — no bet is a lock
- Use odds notation naturally (-110, +3.5, etc.)
- Be honest when a line looks bad for the user

RESPONSIBLE GAMBLING:
If a user seems distressed, chasing losses, or betting money they can't afford: 1-800-522-4700 (National Problem Gambling Helpline) or ncpgambling.org.`;

async function fetchOdds(query, apiKey) {
  try {
    const sportKeys = {
      'nfl': 'americanfootball_nfl', 'nba': 'basketball_nba',
      'mlb': 'baseball_mlb', 'nhl': 'icehockey_nhl',
      'soccer': 'soccer_epl', 'epl': 'soccer_epl',
      'mma': 'mma_mixed_martial_arts', 'ufc': 'mma_mixed_martial_arts',
      'ncaaf': 'americanfootball_ncaaf', 'ncaab': 'basketball_ncaab',
      'valorant': null, 'cs2': null, 'lol': null, 'dota': null
    };

    const q = query.toLowerCase();
    let sportKey = 'americanfootball_nfl';
    for (const [keyword, key] of Object.entries(sportKeys)) {
      if (q.includes(keyword)) { sportKey = key; break; }
    }

    if (!sportKey) return null;

    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`
    );

    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.length === 0) return null;

    let games = data.slice(0, 5);
    const words = query.toLowerCase().split(' ');
    const matched = data.filter(game =>
      words.some(w => w.length > 3 &&
        (game.home_team.toLowerCase().includes(w) ||
         game.away_team.toLowerCase().includes(w)))
    );
    if (matched.length > 0) games = matched.slice(0, 3);

    return games.map(game => {
      const bookmakers = game.bookmakers?.slice(0, 4) || [];
      const oddsStr = bookmakers.map(book => {
        const h2h = book.markets?.find(m => m.key === 'h2h');
        const spread = book.markets?.find(m => m.key === 'spreads');
        const total = book.markets?.find(m => m.key === 'totals');
        let lines = `${book.title}: `;
        if (h2h) lines += `ML(${h2h.outcomes?.map(o => `${o.name} ${o.price > 0 ? '+' : ''}${o.price}`).join('/')}) `;
        if (spread) lines += `Spread(${spread.outcomes?.map(o => `${o.name} ${o.point > 0 ? '+' : ''}${o.point} @ ${o.price > 0 ? '+' : ''}${o.price}`).join('/')}) `;
        if (total) lines += `Total(${total.outcomes?.map(o => `${o.name} ${o.point} @ ${o.price > 0 ? '+' : ''}${o.price}`).join('/')})`;
        return lines;
      }).join('\n');
      return `${game.away_team} @ ${game.home_team} (${new Date(game.commence_time).toLocaleDateString()}):\n${oddsStr}`;
    }).join('\n\n');
  } catch(e) {
    return null;
  }
}

async function fetchNews(query, apiKey) {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query + ' betting odds injury')}&sortBy=publishedAt&pageSize=3&apiKey=${apiKey}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.articles || data.articles.length === 0) return null;
    return data.articles.map(a => `- ${a.title} (${new Date(a.publishedAt).toLocaleDateString()})`).join('\n');
  } catch(e) {
    return null;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const groqKey = process.env.GROQ_API_KEY;
    const oddsKey = process.env.ODDS_API_KEY;
    const newsKey = process.env.NEWS_API_KEY;

    if (!groqKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured.' });

    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';

    const [oddsData, newsData] = await Promise.all([
      oddsKey ? fetchOdds(lastUserMsg, oddsKey) : null,
      newsKey ? fetchNews(lastUserMsg, newsKey) : null
    ]);

    let contextBlock = '';
    if (oddsData) contextBlock += `\n\n=== LIVE ODDS (fetched right now) ===\n${oddsData}`;
    if (newsData) contextBlock += `\n\n=== LATEST NEWS ===\n${newsData}`;

    const enrichedMessages = messages.map((m, i) => {
      if (i === messages.length - 1 && m.role === 'user' && contextBlock) {
        return { ...m, content: m.content + contextBlock };
      }
      return m;
    });

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...enrichedMessages
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(() => ({}));
      return res.status(502).json({ error: errData.error?.message || `Groq error ${groqRes.status}` });
    }

    const data = await groqRes.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(502).json({ error: 'Empty response from Groq' });

    return res.status(200).json({
      response: text,
      hasLiveOdds: !!oddsData,
      hasNews: !!newsData
    });

  } catch (err) {
    console.error('BetIQ API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
