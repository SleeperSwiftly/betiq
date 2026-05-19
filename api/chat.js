const SYSTEM_PROMPT = `You are BetIQ, an elite sports and esports betting analyst with access to real-time odds, weather, news, esports data, NBA stats, and MLB pitcher stats. Always incorporate any provided data into your analysis.

YOUR EXPERTISE:
Traditional Sports: NFL, NBA, MLB, NHL, NCAAF, NCAAB, MMA/Boxing, Soccer, Tennis, Golf, NASCAR
Esports: Valorant, CS2, League of Legends, Dota 2, Overwatch, Rocket League, Call of Duty
Bet types: Spreads, moneylines, totals, props, futures, parlays, teasers, live betting
Odds formats: American (+150/-110), decimal (2.50), fractional (3/2)

CORE KNOWLEDGE:
- Expected Value (EV): calculate and explain, find +EV spots
- Kelly Criterion and bankroll management
- Line shopping and closing line value (CLV)
- Sharp vs square money, line movement, steam moves
- Key numbers: NFL (3, 7, 10, 14), NBA (4, 5, 6)
- Public betting %s, fading the public
- Situational betting: lookahead spots, letdown spots, schedule fatigue
- Hedging, middling, arbitrage
- Esports: patch meta, map veto, LAN vs online, roster changes

MLB BETTING EXPERTISE:
- Starting pitcher ERA, WHIP, K/9, BB/9 and how they impact totals
- Park factors and how stadiums affect scoring
- Weather: wind direction and speed are the #1 environmental factor in MLB totals
- First 5 innings bets isolate starting pitcher quality
- Platoon advantages and lineup splits vs LHP/RHP

WEATHER IMPACT ON BETTING:
- Wind 15+ mph blowing OUT = lean over (adds 0.5-1.5 runs in MLB)
- Wind 15+ mph blowing IN = lean under (removes 0.5-1.5 runs in MLB)
- Cold weather (under 45°F) = lean under in baseball
- Dome stadiums = weather irrelevant
- NFL: wind over 15mph hurts passing games and totals

WHEN REAL-TIME DATA IS PROVIDED:
- Always reference actual current odds, stats, weather, and match data
- For MLB: use real pitcher stats AND weather conditions together
- For NBA: use player averages and last 5 game logs for prop evaluation
- For esports: use actual team records and recent results
- Calculate EV based on real odds when available
- Flag injury news that could affect lines

CONFIDENCE RATING:
At the end of every betting analysis or pick, always include on its own line:
**Confidence: X/10** — [one sentence explaining the key reason for that rating]
Use: 1-3 = avoid this bet, 4-5 = marginal, 6-7 = decent spot, 8-9 = strong play, 10 = rare maximum conviction

SESSION SUMMARY:
When asked to summarize the session or give a daily recap, highlight: best bets discussed, key stats used, and any patterns noticed in the user's betting approach.

RESPONSIBLE GAMBLING:
If a user seems distressed, chasing losses, or betting money they can't afford: 1-800-522-4700 (National Problem Gambling Helpline) or ncpgambling.org.`;

// ─── MLB Stadium Coordinates ─────────────────────────
const MLB_STADIUMS = {
  'yankees': { lat: 40.8296, lon: -73.9262, name: 'Yankee Stadium', dome: false },
  'mets': { lat: 40.7571, lon: -73.8458, name: 'Citi Field', dome: false },
  'dodgers': { lat: 34.0739, lon: -118.2400, name: 'Dodger Stadium', dome: false },
  'cubs': { lat: 41.9484, lon: -87.6553, name: 'Wrigley Field', dome: false },
  'red sox': { lat: 42.3467, lon: -71.0972, name: 'Fenway Park', dome: false },
  'giants': { lat: 37.7786, lon: -122.3893, name: 'Oracle Park', dome: false },
  'astros': { lat: 29.7573, lon: -95.3555, name: 'Minute Maid Park', dome: true },
  'braves': { lat: 33.8907, lon: -84.4677, name: 'Truist Park', dome: false },
  'phillies': { lat: 39.9061, lon: -75.1665, name: 'Citizens Bank Park', dome: false },
  'cardinals': { lat: 38.6226, lon: -90.1928, name: 'Busch Stadium', dome: false },
  'padres': { lat: 32.7073, lon: -117.1566, name: 'Petco Park', dome: false },
  'brewers': { lat: 43.0280, lon: -87.9712, name: 'American Family Field', dome: true },
  'diamondbacks': { lat: 33.4453, lon: -112.0667, name: 'Chase Field', dome: true },
  'guardians': { lat: 41.4962, lon: -81.6852, name: 'Progressive Field', dome: false },
  'twins': { lat: 44.9817, lon: -93.2778, name: 'Target Field', dome: false },
  'mariners': { lat: 47.5914, lon: -122.3325, name: 'T-Mobile Park', dome: true },
  'angels': { lat: 33.8003, lon: -117.8827, name: 'Angel Stadium', dome: false },
  'athletics': { lat: 37.7516, lon: -122.2005, name: 'Oakland Coliseum', dome: false },
  'rangers': { lat: 32.7473, lon: -97.0824, name: 'Globe Life Field', dome: true },
  'orioles': { lat: 39.2838, lon: -76.6218, name: 'Camden Yards', dome: false },
  'rays': { lat: 27.7682, lon: -82.6534, name: 'Tropicana Field', dome: true },
  'blue jays': { lat: 43.6414, lon: -79.3894, name: 'Rogers Centre', dome: true },
  'white sox': { lat: 41.8299, lon: -87.6338, name: 'Guaranteed Rate Field', dome: false },
  'tigers': { lat: 42.3390, lon: -83.0485, name: 'Comerica Park', dome: false },
  'royals': { lat: 39.0517, lon: -94.4803, name: 'Kauffman Stadium', dome: false },
  'pirates': { lat: 40.4469, lon: -80.0057, name: 'PNC Park', dome: false },
  'reds': { lat: 39.0979, lon: -84.5082, name: 'Great American Ball Park', dome: false },
  'rockies': { lat: 39.7559, lon: -104.9942, name: 'Coors Field', dome: false },
  'marlins': { lat: 25.7781, lon: -80.2197, name: 'loanDepot park', dome: true },
  'nationals': { lat: 38.8730, lon: -77.0074, name: 'Nationals Park', dome: false },
};

// ─── Weather API ─────────────────────────────────────
async function fetchWeather(query, apiKey) {
  try {
    const q = query.toLowerCase();
    const mlbTerms = ['mlb','baseball',...Object.keys(MLB_STADIUMS)];
    if (!mlbTerms.some(t => q.includes(t))) return null;

    let stadium = null;
    for (const [team, data] of Object.entries(MLB_STADIUMS)) {
      if (q.includes(team)) { stadium = { ...data }; break; }
    }
    if (!stadium) return null;

    if (stadium.dome) return `${stadium.name}: Indoor/retractable roof — weather not a factor for totals`;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${stadium.lat}&lon=${stadium.lon}&appid=${apiKey}&units=imperial`
    );
    if (!res.ok) return null;
    const data = await res.json();

    const temp = Math.round(data.main?.temp);
    const windSpeed = Math.round(data.wind?.speed);
    const windDeg = data.wind?.deg || 0;
    const conditions = data.weather?.[0]?.description;
    const humidity = data.main?.humidity;

    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    const windDir = dirs[Math.round(windDeg / 22.5) % 16];

    let bettingImpact = '';
    if (windSpeed >= 15) {
      const blowingOut = ['S','SSW','SW','WSW','W','WNW','NW','NNW'].includes(windDir);
      const blowingIn = ['N','NNE','NE','ENE','E','ESE','SE','SSE'].includes(windDir);
      if (blowingOut) bettingImpact = ' ⚠️ WIND BLOWING OUT — lean OVER on total';
      else if (blowingIn) bettingImpact = ' ⚠️ WIND BLOWING IN — lean UNDER on total';
      else bettingImpact = ' — strong crosswind, moderate impact';
    } else if (windSpeed >= 10) {
      bettingImpact = ' — moderate wind, minor impact';
    }

    if (temp < 45) bettingImpact += ' | 🥶 Cold weather — lean UNDER';

    return `${stadium.name} weather: ${temp}°F | Wind: ${windSpeed}mph ${windDir}${bettingImpact} | ${conditions} | Humidity: ${humidity}%`;
  } catch(e) { return null; }
}

// ─── Odds API ────────────────────────────────────────
async function fetchOdds(query, apiKey) {
  try {
    const sportKeys = {
      'nfl': 'americanfootball_nfl', 'nba': 'basketball_nba',
      'mlb': 'baseball_mlb', 'nhl': 'icehockey_nhl',
      'soccer': 'soccer_epl', 'epl': 'soccer_epl',
      'mma': 'mma_mixed_martial_arts', 'ufc': 'mma_mixed_martial_arts',
      'ncaaf': 'americanfootball_ncaaf', 'ncaab': 'basketball_ncaab'
    };
    const esportsTerms = ['valorant','cs2','lol','dota','esport','league of legends','counter-strike','overwatch'];
    const q = query.toLowerCase();
    if (esportsTerms.some(t => q.includes(t))) return null;

    let sportKey = 'basketball_nba';
    for (const [keyword, key] of Object.entries(sportKeys)) {
      if (q.includes(keyword)) { sportKey = key; break; }
    }

    const res = await fetch(
      `https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?apiKey=${apiKey}&regions=us&markets=h2h,spreads,totals&oddsFormat=american&dateFormat=iso`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.length === 0) return null;

    let games = data.slice(0, 5);
    const words = q.split(' ').filter(w => w.length > 3);
    const matched = data.filter(game =>
      words.some(w => game.home_team.toLowerCase().includes(w) || game.away_team.toLowerCase().includes(w))
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
  } catch(e) { return null; }
}

// ─── News + Injury API ───────────────────────────────
async function fetchNews(query, apiKey) {
  try {
    const injuryQ = query + ' injury OUT questionable DNP lineup';
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(injuryQ)}&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.articles || data.articles.length === 0) return null;
    return data.articles.map(a => `- ${a.title} (${new Date(a.publishedAt).toLocaleDateString()})`).join('\n');
  } catch(e) { return null; }
}

// ─── PandaScore (Esports) ────────────────────────────
async function fetchEsports(query, apiKey) {
  try {
    const q = query.toLowerCase();
    const esportsTerms = ['valorant','cs2','lol','dota','esport','league of legends','counter-strike','overwatch','rocket league','cod'];
    if (!esportsTerms.some(t => q.includes(t))) return null;

    const gameMap = {
      'valorant': 'valorant', 'cs2': 'csgo', 'counter-strike': 'csgo',
      'lol': 'league-of-legends', 'league of legends': 'league-of-legends',
      'dota': 'dota-2', 'overwatch': 'overwatch',
      'rocket league': 'rocket-league', 'cod': 'call-of-duty'
    };

    let videogame = 'valorant';
    for (const [keyword, game] of Object.entries(gameMap)) {
      if (q.includes(keyword)) { videogame = game; break; }
    }

    const [matchRes, resultsRes] = await Promise.all([
      fetch(`https://api.pandascore.co/matches/upcoming?filter[videogame]=${videogame}&page[size]=5&sort=begin_at`,
        { headers: { 'Authorization': `Bearer ${apiKey}` } }),
      fetch(`https://api.pandascore.co/matches/past?filter[videogame]=${videogame}&page[size]=5&sort=-begin_at`,
        { headers: { 'Authorization': `Bearer ${apiKey}` } })
    ]);

    if (!matchRes.ok) return null;
    const matches = await matchRes.json();
    if (!matches || matches.length === 0) return null;

    const words = q.split(' ').filter(w => w.length > 3);
    let relevant = matches.filter(m =>
      words.some(w => m.opponents?.some(o => o.opponent?.name?.toLowerCase().includes(w)))
    );
    if (relevant.length === 0) relevant = matches.slice(0, 3);

    const matchData = relevant.map(m => {
      const teams = m.opponents?.map(o => o.opponent?.name).join(' vs ') || 'TBD';
      const date = m.begin_at ? new Date(m.begin_at).toLocaleDateString() : 'TBD';
      const tournament = m.tournament?.name || m.league?.name || 'Unknown Tournament';
      const format = m.number_of_games ? `Best of ${m.number_of_games}` : '';
      return `${teams} — ${tournament} ${format} (${date})`;
    }).join('\n');

    let recentResults = '';
    if (resultsRes.ok) {
      const results = await resultsRes.json();
      if (results?.length > 0) {
        recentResults = '\nRecent results:\n' + results.slice(0, 5).map(m => {
          const winner = m.winner?.name || 'TBD';
          const teams = m.opponents?.map(o => o.opponent?.name).join(' vs ') || 'TBD';
          return `${teams} → Winner: ${winner}`;
        }).join('\n');
      }
    }

    return `Upcoming ${videogame} matches:\n${matchData}${recentResults}`;
  } catch(e) { return null; }
}

// ─── BallDontLie (NBA) ───────────────────────────────
async function fetchNBA(query, apiKey) {
  try {
    const q = query.toLowerCase();
    const nbaTerms = ['nba','basketball','lakers','celtics','warriors','nets','bulls','heat',
      'bucks','suns','nuggets','mavs','mavericks','clippers','76ers','sixers','knicks',
      'raptors','hawks','hornets','pistons','pacers','cavaliers','magic','wizards',
      'spurs','rockets','grizzlies','pelicans','thunder','blazers','jazz','timberwolves','kings'];
    if (!nbaTerms.some(t => q.includes(t))) return null;

    const words = q.split(' ').filter(w => w.length > 3);
    let playerStats = '';

    for (const word of words.slice(0, 3)) {
      const searchRes = await fetch(
        `https://api.balldontlie.io/v1/players?search=${encodeURIComponent(word)}&per_page=3`,
        { headers: { 'Authorization': apiKey } }
      );
      if (!searchRes.ok) continue;
      const searchData = await searchRes.json();
      if (!searchData.data?.length) continue;

      const player = searchData.data[0];
      const [avgRes, gamesRes] = await Promise.all([
        fetch(`https://api.balldontlie.io/v1/season_averages?season=2024&player_ids[]=${player.id}`,
          { headers: { 'Authorization': apiKey } }),
        fetch(`https://api.balldontlie.io/v1/stats?player_ids[]=${player.id}&seasons[]=2024&per_page=5&sort=date&direction=desc`,
          { headers: { 'Authorization': apiKey } })
      ]);

      if (avgRes.ok) {
        const avgData = await avgRes.json();
        if (avgData.data?.length) {
          const s = avgData.data[0];
          playerStats += `\n${player.first_name} ${player.last_name} (${player.team?.full_name}) 2024-25: ` +
            `${s.pts} PPG | ${s.reb} RPG | ${s.ast} APG | ${s.min} MIN | FG: ${(s.fg_pct*100).toFixed(1)}% | 3PT: ${(s.fg3_pct*100).toFixed(1)}%`;
        }
      }
      if (gamesRes.ok) {
        const gamesData = await gamesRes.json();
        if (gamesData.data?.length) {
          const last5 = gamesData.data.slice(0,5).map(g => `${g.pts}pts/${g.reb}reb/${g.ast}ast`).join(', ');
          playerStats += ` | Last 5: ${last5}`;
        }
      }
    }
    if (!playerStats) return null;
    return `NBA Player Stats:${playerStats}`;
  } catch(e) { return null; }
}

// ─── MLB Stats API (free) ────────────────────────────
async function fetchMLB(query) {
  try {
    const q = query.toLowerCase();
    const mlbTerms = ['mlb','baseball',...Object.keys(MLB_STADIUMS),'yankees','red sox','dodgers'];
    if (!mlbTerms.some(t => q.includes(t))) return null;

    const today = new Date().toISOString().split('T')[0];
    const schedRes = await fetch(
      `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${today}&hydrate=probablePitcher(stats),team,linescore`
    );
    if (!schedRes.ok) return null;
    const schedData = await schedRes.json();
    const games = schedData.dates?.[0]?.games || [];
    if (games.length === 0) return null;

    const words = q.split(' ').filter(w => w.length > 3);
    let relevant = games.filter(g =>
      words.some(w =>
        g.teams?.away?.team?.name?.toLowerCase().includes(w) ||
        g.teams?.home?.team?.name?.toLowerCase().includes(w)
      )
    );
    if (relevant.length === 0) relevant = games.slice(0, 3);

    const gameData = relevant.map(g => {
      const away = g.teams?.away?.team?.name || 'TBD';
      const home = g.teams?.home?.team?.name || 'TBD';
      const awayPitcher = g.teams?.away?.probablePitcher;
      const homePitcher = g.teams?.home?.probablePitcher;
      const gameTime = g.gameDate ? new Date(g.gameDate).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : 'TBD';

      let pitcherInfo = '';
      if (awayPitcher) {
        const s = awayPitcher.stats?.[0]?.stats;
        pitcherInfo += `\n  ${away} SP: ${awayPitcher.fullName}`;
        if (s) pitcherInfo += ` — ERA: ${s.era} | WHIP: ${s.whip} | K/9: ${s.strikeoutsPer9Inn} | IP: ${s.inningsPitched}`;
      }
      if (homePitcher) {
        const s = homePitcher.stats?.[0]?.stats;
        pitcherInfo += `\n  ${home} SP: ${homePitcher.fullName}`;
        if (s) pitcherInfo += ` — ERA: ${s.era} | WHIP: ${s.whip} | K/9: ${s.strikeoutsPer9Inn} | IP: ${s.inningsPitched}`;
      }
      return `${away} @ ${home} (${gameTime}):${pitcherInfo}`;
    }).join('\n\n');

    return `Today's MLB Games with Starting Pitchers:\n${gameData}`;
  } catch(e) { return null; }
}

// ─── Main Handler ─────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0)
      return res.status(400).json({ error: 'Invalid messages format' });

    const groqKey = process.env.GROQ_API_KEY;
    const oddsKey = process.env.ODDS_API_KEY;
    const newsKey = process.env.NEWS_API_KEY;
    const pandaKey = process.env.PANDASCORE_API_KEY;
    const bdlKey = process.env.BALLDONTLIE_API_KEY;
    const weatherKey = process.env.WEATHER_API_KEY;

    if (!groqKey) return res.status(500).json({ error: 'GROQ_API_KEY not configured.' });

    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';

    const [oddsData, newsData, esportsData, nbaData, mlbData, weatherData] = await Promise.all([
      oddsKey ? fetchOdds(lastUserMsg, oddsKey) : null,
      newsKey ? fetchNews(lastUserMsg, newsKey) : null,
      pandaKey ? fetchEsports(lastUserMsg, pandaKey) : null,
      bdlKey ? fetchNBA(lastUserMsg, bdlKey) : null,
      fetchMLB(lastUserMsg),
      weatherKey ? fetchWeather(lastUserMsg, weatherKey) : null
    ]);

    let contextBlock = '';
    if (weatherData) contextBlock += `\n\n=== LIVE WEATHER AT STADIUM ===\n${weatherData}`;
    if (oddsData) contextBlock += `\n\n=== LIVE ODDS ===\n${oddsData}`;
    if (esportsData) contextBlock += `\n\n=== LIVE ESPORTS DATA ===\n${esportsData}`;
    if (nbaData) contextBlock += `\n\n=== NBA PLAYER STATS ===\n${nbaData}`;
    if (mlbData) contextBlock += `\n\n=== MLB TODAY (Starting Pitchers) ===\n${mlbData}`;
    if (newsData) contextBlock += `\n\n=== LATEST INJURY & NEWS ===\n${newsData}`;

    const enrichedMessages = messages.map((m, i) => {
      if (i === messages.length - 1 && m.role === 'user' && contextBlock)
        return { ...m, content: m.content + contextBlock };
      return m;
    });

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...enrichedMessages],
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
      sources: { weather: !!weatherData, liveOdds: !!oddsData, esports: !!esportsData, nba: !!nbaData, mlb: !!mlbData, news: !!newsData }
    });

  } catch (err) {
    console.error('BetIQ API error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
