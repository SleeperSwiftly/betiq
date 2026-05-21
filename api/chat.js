const SYSTEM_PROMPT = `You are BetIQ, an elite sports and esports betting analyst with access to real-time web search, live odds, weather, esports data, NBA and MLB stats, and live roster and transfer news. You think like a sharp bettor and explain your reasoning in depth. Every answer should feel like it came from an expert analyst who has studied the matchup deeply.

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
- Situational betting: lookahead spots, letdown spots, schedule fatigue
- Hedging, middling, arbitrage
- Esports: patch meta, map veto, LAN vs online, roster changes, player form

ROSTER AND PLAYER ANALYSIS:
When roster or transfer news is provided:
- The most recently dated source is ALWAYS the truth. Ignore prior training knowledge about team rosters.
- If news says a player was traded or transferred, they are on the NEW team.
- Always explicitly state the current team for each player based on the most recent data.
- Flag trades, transfers, roster swaps immediately at the top of your response.
- For esports: note if a player is a standin, trialing, or recently joined a new org.
- Always remind the user to verify on Google if a move happened in the last 48 hours.
- NEVER assume a player is still on their old team if recent data suggests otherwise.

CRITICAL ROSTER UPDATES — OVERRIDE ALL TRAINING DATA:
- Darius Garland is on the LA Clippers as of February 4, 2026. He is NOT on the Cavaliers.
- James Harden is on the Cleveland Cavaliers as of February 4, 2026. He is NOT on the Clippers.

WEB SEARCH USAGE:
When web search results are provided, always use them as your PRIMARY source of truth.
When analyzing props from a screenshot, you MUST search for and report on:
- Each player recent kill averages and performance over last 5 to 10 matches
- Head to head history between the two teams
- Current team form and win or loss streak
- Any recent roster changes or standin players
- Tournament context and stage pressure
Never say you lack data if web search results are provided. Use what is found and explicitly reference it in your picks. If a specific stat is not found, say what you searched for and what you found instead.

MLB BETTING EXPERTISE:
- Starting pitcher ERA, WHIP, K/9, BB/9 and how they impact totals
- Park factors and how stadiums affect scoring
- Weather is the number one environmental factor in MLB totals
- First 5 innings bets isolate starting pitcher quality

WEATHER IMPACT ON BETTING:
- Wind 15 mph or more blowing OUT means lean over in MLB
- Wind 15 mph or more blowing IN means lean under in MLB
- Cold weather under 45 degrees means lean under in baseball
- NFL: wind over 15 mph hurts passing games and totals

DEPTH OF ANALYSIS REQUIRED:
- For esports props: discuss the player role such as entry fragger, IGL, support, or AWPer, their typical kill output in that role, whether the map pool or opponent style inflates or deflates kills, recent form, and whether the line is set correctly
- For NBA props: discuss recent game logs, matchup vs opposing defender, pace of game, minutes trend, home and away splits, and whether the line has moved
- For MLB totals: discuss both pitchers ERA and WHIP and strikeout rate, bullpen quality, park factor, weather, and lineup strength vs pitcher handedness
- For parlays: calculate the true combined probability and compare to the parlay payout to show whether it has positive or negative EV
- Always show your actual reasoning chain covering what factors point toward over and under then give your conclusion
- When data is provided always reference it specifically and quote the actual numbers
- If you do not have enough information to be confident, say so clearly
- Never give vague takes without explaining exactly how and why
- Compare the prop line to what you would expect based on the data

RESPONSE FORMAT FOR PROP PICKS:
When analyzing multiple props, structure each pick like this:
1. State your pick which is over or under and the line
2. Give 2 to 3 specific reasons backed by data or logic
3. Flag any risks or uncertainties
4. State your confidence rating with a specific reason

RESPONSE LENGTH:
Short questions get concise answers. Complex prop analysis with multiple players should be detailed. Quality over brevity when stakes are involved.

CONFIDENCE RATING:
At the end of every individual pick include: Confidence: X/10 and one sentence explaining the key reason.
1 to 3 means avoid, 4 to 5 means marginal, 6 to 7 means decent, 8 to 9 means strong, 10 means maximum conviction.

RESPONSIBLE GAMBLING:
If a user seems distressed or betting money they cannot afford: 1-800-522-4700 or ncpgambling.org.`;

// ─── MLB Stadium Coordinates ─────────────────────────
const MLB_STADIUMS = {
  'yankees':{lat:40.8296,lon:-73.9262,name:'Yankee Stadium',dome:false},
  'mets':{lat:40.7571,lon:-73.8458,name:'Citi Field',dome:false},
  'dodgers':{lat:34.0739,lon:-118.2400,name:'Dodger Stadium',dome:false},
  'cubs':{lat:41.9484,lon:-87.6553,name:'Wrigley Field',dome:false},
  'red sox':{lat:42.3467,lon:-71.0972,name:'Fenway Park',dome:false},
  'giants':{lat:37.7786,lon:-122.3893,name:'Oracle Park',dome:false},
  'astros':{lat:29.7573,lon:-95.3555,name:'Minute Maid Park',dome:true},
  'braves':{lat:33.8907,lon:-84.4677,name:'Truist Park',dome:false},
  'phillies':{lat:39.9061,lon:-75.1665,name:'Citizens Bank Park',dome:false},
  'cardinals':{lat:38.6226,lon:-90.1928,name:'Busch Stadium',dome:false},
  'padres':{lat:32.7073,lon:-117.1566,name:'Petco Park',dome:false},
  'brewers':{lat:43.0280,lon:-87.9712,name:'American Family Field',dome:true},
  'diamondbacks':{lat:33.4453,lon:-112.0667,name:'Chase Field',dome:true},
  'guardians':{lat:41.4962,lon:-81.6852,name:'Progressive Field',dome:false},
  'twins':{lat:44.9817,lon:-93.2778,name:'Target Field',dome:false},
  'mariners':{lat:47.5914,lon:-122.3325,name:'T-Mobile Park',dome:true},
  'angels':{lat:33.8003,lon:-117.8827,name:'Angel Stadium',dome:false},
  'rangers':{lat:32.7473,lon:-97.0824,name:'Globe Life Field',dome:true},
  'orioles':{lat:39.2838,lon:-76.6218,name:'Camden Yards',dome:false},
  'rays':{lat:27.7682,lon:-82.6534,name:'Tropicana Field',dome:true},
  'blue jays':{lat:43.6414,lon:-79.3894,name:'Rogers Centre',dome:true},
  'white sox':{lat:41.8299,lon:-87.6338,name:'Guaranteed Rate Field',dome:false},
  'tigers':{lat:42.3390,lon:-83.0485,name:'Comerica Park',dome:false},
  'royals':{lat:39.0517,lon:-94.4803,name:'Kauffman Stadium',dome:false},
  'pirates':{lat:40.4469,lon:-80.0057,name:'PNC Park',dome:false},
  'reds':{lat:39.0979,lon:-84.5082,name:'Great American Ball Park',dome:false},
  'rockies':{lat:39.7559,lon:-104.9942,name:'Coors Field',dome:false},
  'marlins':{lat:25.7781,lon:-80.2197,name:'loanDepot park',dome:true},
  'nationals':{lat:38.8730,lon:-77.0074,name:'Nationals Park',dome:false},
};

// ─── Extract player names ─────────────────────────────
function extractPlayerNames(query) {
  const matches = [];
  const propPattern = /([A-Za-z][A-Za-z0-9._\-]{1,20})\s+\d+\.?\d*\s*(?:kills?|points?|assists?|rebounds?|maps?|rounds?|acs|kd|adr|goals?|saves?|deaths?)?/gi;
  let m;
  while ((m = propPattern.exec(query)) !== null) {
    const name = m[1].toLowerCase();
    const skip = ['today','tonight','game','match','map','over','under','total','spread','line','pick','bet','give','want','tell','for','the','and','but','with','this','that','from','maps','kills','points','rounds','goals','now','will','they','them','plays','give'];
    if (!skip.includes(name) && name.length > 2) matches.push(m[1]);
  }
  return [...new Set(matches)].slice(0, 12);
}

// ─── Brave Web Search ─────────────────────────────────
async function fetchWebSearch(query, apiKey, hasImage) {
  if (!apiKey) return null;
  try {
    const searches = [];
    const q = query.toLowerCase();
    const isEsports = ['valorant','cs2','lol','dota','overwatch','counter-strike','league of legends','wild rift'].some(t => q.includes(t));
    const isNBA = ['nba','basketball'].some(t => q.includes(t));
    const isMLB = ['mlb','baseball'].some(t => q.includes(t));
    const isNFL = ['nfl','football'].some(t => q.includes(t));

    if (hasImage) {
      if (isEsports || (!isNBA && !isMLB && !isNFL)) {
        searches.push(query.slice(0, 150) + ' player stats recent performance kills 2026');
        searches.push(query.slice(0, 150) + ' h2h history match results 2026');
        searches.push(query.slice(0, 150) + ' recent form last 5 matches 2026');
      }
      if (isNBA) {
        searches.push(query.slice(0, 150) + ' player stats recent games props 2026');
        searches.push(query.slice(0, 150) + ' injury report lineup tonight 2026');
      }
      if (isMLB) {
        searches.push(query.slice(0, 150) + ' pitcher stats ERA WHIP lineup today 2026');
      }
      if (!searches.length) {
        searches.push(query.slice(0, 150) + ' player stats recent performance 2026');
        searches.push(query.slice(0, 150) + ' h2h history match results 2026');
      }
    } else {
      searches.push(query.slice(0, 200));
      if (isEsports) searches.push(query.slice(0, 100) + ' recent match results h2h stats 2026');
      if (isNBA) searches.push(query.slice(0, 100) + ' NBA stats injury report 2026');
      if (isMLB) searches.push(query.slice(0, 100) + ' MLB pitcher stats lineup 2026');
      if (isNFL) searches.push(query.slice(0, 100) + ' NFL injury report roster 2026');
    }

    const searchPromises = searches.slice(0, 3).map(searchQuery =>
      fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: searchQuery, num: 5 })
      }).then(r => r.ok ? r.json() : null).catch(() => null)
    );

    const searchResults = await Promise.all(searchPromises);
    const allResults = [];
    for (const result of searchResults) {
      if (!result) continue;
      if (result.organic?.length) {
        for (const item of result.organic.slice(0, 4)) {
          if (item.title && item.snippet) allResults.push(`- ${item.title}: ${item.snippet}`);
        }
      }
      if (result.topStories?.length) {
        for (const item of result.topStories.slice(0, 3)) {
          allResults.push(`- [NEWS] ${item.title} (${item.date||'recent'})`);
        }
      }
    }
    if (!allResults.length) return null;
    const unique = [...new Set(allResults)].slice(0, 10);
    return 'Web search results:\n' + unique.join('\n');
  } catch(e) { return null; }
}

// ─── News-based roster lookup ─────────────────────────
async function fetchRosterNews(playerNames, query, newsApiKey) {
  if (!playerNames.length || !newsApiKey) return null;
  try {
    const q = query.toLowerCase();
    const isEsports = ['valorant','cs2','lol','dota','overwatch','counter-strike','league of legends','rocket league','cod'].some(t => q.includes(t));
    const isNBA = ['nba','basketball'].some(t => q.includes(t));
    const isNFL = ['nfl','football'].some(t => q.includes(t));
    const isNHL = ['nhl','hockey'].some(t => q.includes(t));
    const isMLB = ['mlb','baseball'].some(t => q.includes(t));
    const isSoccer = ['soccer','epl','premier league','mls','champions league','la liga'].some(t => q.includes(t));

    const year = new Date().getFullYear();
    const prevYear = year - 1;

    let sportSuffix = `trade transfer team roster ${year}`;
    if (isEsports) sportSuffix = `roster transfer signed joined team esports ${year} ${prevYear}`;
    else if (isNBA) sportSuffix = `trade signed team NBA ${year} ${prevYear}`;
    else if (isNFL) sportSuffix = `trade signed team NFL ${year} ${prevYear}`;
    else if (isNHL) sportSuffix = `trade signed team NHL ${year} ${prevYear}`;
    else if (isMLB) sportSuffix = `trade signed team MLB ${year} ${prevYear}`;
    else if (isSoccer) sportSuffix = `transfer signed club team ${year} ${prevYear}`;

    const results = [];
    for (const name of playerNames.slice(0, 5)) {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(name + ' ' + sportSuffix)}&sortBy=publishedAt&pageSize=2&apiKey=${newsApiKey}`
        );
        if (!res.ok) continue;
        const data = await res.json();
        if (!data.articles?.length) continue;
        const article = data.articles[0];
        const date = new Date(article.publishedAt).toLocaleDateString();
        results.push(`${name}: "${article.title}" (${date})`);
      } catch(e) { continue; }
    }

    if (!results.length) return null;
    return `Latest roster and transfer news:\n${results.join('\n')}\nAlways verify very recent moves on Google before betting.`;
  } catch(e) { return null; }
}

// ─── Weather API ─────────────────────────────────────
async function fetchWeather(query, apiKey) {
  try {
    const q = query.toLowerCase();
    let stadium = null;
    for (const [team, data] of Object.entries(MLB_STADIUMS)) {
      if (q.includes(team)) { stadium = { ...data }; break; }
    }
    if (!stadium) return null;
    if (stadium.dome) return `${stadium.name}: Indoor or retractable roof, weather not a factor`;
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
    const windDir = dirs[Math.round(windDeg/22.5)%16];
    let impact = '';
    if (windSpeed >= 15) {
      const out = ['S','SSW','SW','WSW','W','WNW','NW','NNW'].includes(windDir);
      impact = out ? ' WIND BLOWING OUT lean OVER' : ' WIND BLOWING IN lean UNDER';
    } else if (windSpeed >= 10) impact = ' moderate wind minor impact';
    if (temp < 45) impact += ' Cold weather lean UNDER';
    return `${stadium.name}: ${temp}F | Wind: ${windSpeed}mph ${windDir}${impact} | ${conditions} | Humidity: ${humidity}%`;
  } catch(e) { return null; }
}

// ─── Odds API ────────────────────────────────────────
async function fetchOdds(query, apiKey) {
  try {
    const sportKeys = {
      'nfl':'americanfootball_nfl','nba':'basketball_nba','mlb':'baseball_mlb',
      'nhl':'icehockey_nhl','soccer':'soccer_epl','epl':'soccer_epl',
      'mma':'mma_mixed_martial_arts','ufc':'mma_mixed_martial_arts',
      'ncaaf':'americanfootball_ncaaf','ncaab':'basketball_ncaab'
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
    if (!data?.length) return null;
    let games = data.slice(0,5);
    const words = q.split(' ').filter(w => w.length > 3);
    const matched = data.filter(g => words.some(w => g.home_team.toLowerCase().includes(w)||g.away_team.toLowerCase().includes(w)));
    if (matched.length > 0) games = matched.slice(0,3);
    return games.map(game => {
      const oddsStr = game.bookmakers?.slice(0,4).map(book => {
        const h2h = book.markets?.find(m => m.key==='h2h');
        const spread = book.markets?.find(m => m.key==='spreads');
        const total = book.markets?.find(m => m.key==='totals');
        let lines = `${book.title}: `;
        if (h2h) lines += `ML(${h2h.outcomes?.map(o=>`${o.name} ${o.price>0?'+':''}${o.price}`).join('/')}) `;
        if (spread) lines += `Spread(${spread.outcomes?.map(o=>`${o.name} ${o.point>0?'+':''}${o.point} @ ${o.price>0?'+':''}${o.price}`).join('/')}) `;
        if (total) lines += `Total(${total.outcomes?.map(o=>`${o.name} ${o.point} @ ${o.price>0?'+':''}${o.price}`).join('/')})`;
        return lines;
      }).join('\n')||'No bookmakers';
      return `${game.away_team} @ ${game.home_team} (${new Date(game.commence_time).toLocaleDateString()}):\n${oddsStr}`;
    }).join('\n\n');
  } catch(e) { return null; }
}

// ─── News and Injury feed ────────────────────────────
async function fetchNews(query, apiKey) {
  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query+' injury OUT questionable lineup')}&sortBy=publishedAt&pageSize=4&apiKey=${apiKey}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.articles?.length) return null;
    return data.articles.map(a=>`- ${a.title} (${new Date(a.publishedAt).toLocaleDateString()})`).join('\n');
  } catch(e) { return null; }
}

// ─── PandaScore Esports ───────────────────────────────
async function fetchEsportsMatches(query, apiKey) {
  try {
    const q = query.toLowerCase();
    const esportsTerms = ['valorant','cs2','lol','dota','esport','league of legends','counter-strike','overwatch','rocket league','cod'];
    if (!esportsTerms.some(t => q.includes(t))) return null;
    const gameMap = {
      'valorant':'valorant','cs2':'csgo','counter-strike':'csgo',
      'lol':'league-of-legends','league of legends':'league-of-legends',
      'dota':'dota-2','overwatch':'overwatch',
      'rocket league':'rocket-league','cod':'call-of-duty'
    };
    let videogame = 'valorant';
    for (const [keyword, game] of Object.entries(gameMap)) {
      if (q.includes(keyword)) { videogame = game; break; }
    }
    const [matchRes, resultsRes] = await Promise.all([
      fetch(`https://api.pandascore.co/matches/upcoming?filter[videogame]=${videogame}&page[size]=5&sort=begin_at`,{headers:{'Authorization':`Bearer ${apiKey}`}}),
      fetch(`https://api.pandascore.co/matches/past?filter[videogame]=${videogame}&page[size]=5&sort=-begin_at`,{headers:{'Authorization':`Bearer ${apiKey}`}})
    ]);
    if (!matchRes.ok) return null;
    const matches = await matchRes.json();
    if (!matches?.length) return null;
    const words = q.split(' ').filter(w=>w.length>3);
    let relevant = matches.filter(m=>words.some(w=>m.opponents?.some(o=>o.opponent?.name?.toLowerCase().includes(w))));
    if (!relevant.length) relevant = matches.slice(0,3);
    const matchData = relevant.map(m=>{
      const teams = m.opponents?.map(o=>o.opponent?.name).join(' vs ')||'TBD';
      const date = m.begin_at?new Date(m.begin_at).toLocaleDateString():'TBD';
      const tournament = m.tournament?.name||m.league?.name||'Unknown';
      const format = m.number_of_games?`Best of ${m.number_of_games}`:'';
      return `${teams} — ${tournament} ${format} (${date})`;
    }).join('\n');
    let recentResults = '';
    if (resultsRes.ok) {
      const results = await resultsRes.json();
      if (results?.length) recentResults = '\nRecent results:\n'+results.slice(0,5).map(m=>{
        const winner = m.winner?.name||'TBD';
        const teams = m.opponents?.map(o=>o.opponent?.name).join(' vs ')||'TBD';
        return `${teams} > Winner: ${winner}`;
      }).join('\n');
    }
    return `Upcoming ${videogame} matches:\n${matchData}${recentResults}`;
  } catch(e) { return null; }
}

// ─── BallDontLie NBA stats ────────────────────────────
async function fetchNBAStats(query, apiKey) {
  try {
    const q = query.toLowerCase();
    const nbaTerms = ['nba','basketball','lakers','celtics','warriors','nets','bulls','heat','bucks','suns','nuggets','mavs','clippers','76ers','knicks','raptors','hawks','spurs','rockets','grizzlies','pelicans','thunder','blazers','jazz','timberwolves','kings','cavaliers','cavs','pistons','pacers','hornets','magic','wizards'];
    if (!nbaTerms.some(t=>q.includes(t))) return null;
    const words = q.split(' ').filter(w=>w.length>3).slice(0,4);
    let playerStats = '';
    for (const word of words) {
      try {
        const searchRes = await fetch(`https://api.balldontlie.io/v1/players?search=${encodeURIComponent(word)}&per_page=3`,{headers:{'Authorization':apiKey}});
        if (!searchRes.ok) continue;
        const searchData = await searchRes.json();
        if (!searchData.data?.length) continue;
        const player = searchData.data[0];
        const [avgRes,gamesRes] = await Promise.all([
          fetch(`https://api.balldontlie.io/v1/season_averages?season=2024&player_ids[]=${player.id}`,{headers:{'Authorization':apiKey}}),
          fetch(`https://api.balldontlie.io/v1/stats?player_ids[]=${player.id}&seasons[]=2024&per_page=5&sort=date&direction=desc`,{headers:{'Authorization':apiKey}})
        ]);
        if (avgRes.ok) {
          const avgData = await avgRes.json();
          if (avgData.data?.length) {
            const s = avgData.data[0];
            playerStats += `\n${player.first_name} ${player.last_name} 2024-25: ${s.pts} PPG | ${s.reb} RPG | ${s.ast} APG | ${s.min} MIN | FG: ${(s.fg_pct*100).toFixed(1)}% | 3PT: ${(s.fg3_pct*100).toFixed(1)}%`;
          }
        }
        if (gamesRes.ok) {
          const gamesData = await gamesRes.json();
          if (gamesData.data?.length) {
            const last5 = gamesData.data.slice(0,5).map(g=>`${g.pts}pts/${g.reb}reb/${g.ast}ast`).join(', ');
            playerStats += ` | Last 5: ${last5}`;
          }
        }
      } catch(e) { continue; }
    }
    if (!playerStats) return null;
    return `NBA Player Stats:${playerStats}`;
  } catch(e) { return null; }
}

// ─── MLB Stats API ────────────────────────────────────
async function fetchMLB(query) {
  try {
    const q = query.toLowerCase();
    const mlbTerms = ['mlb','baseball',...Object.keys(MLB_STADIUMS),'yankees','red sox','dodgers'];
    if (!mlbTerms.some(t=>q.includes(t))) return null;
    const today = new Date().toISOString().split('T')[0];
    const schedRes = await fetch(`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${today}&hydrate=probablePitcher(stats),team,linescore`);
    if (!schedRes.ok) return null;
    const schedData = await schedRes.json();
    const games = schedData.dates?.[0]?.games||[];
    if (!games.length) return null;
    const words = q.split(' ').filter(w=>w.length>3);
    let relevant = games.filter(g=>words.some(w=>g.teams?.away?.team?.name?.toLowerCase().includes(w)||g.teams?.home?.team?.name?.toLowerCase().includes(w)));
    if (!relevant.length) relevant = games.slice(0,3);
    return "Today MLB Games:\n"+relevant.map(g=>{
      const away = g.teams?.away?.team?.name||'TBD';
      const home = g.teams?.home?.team?.name||'TBD';
      const ap = g.teams?.away?.probablePitcher;
      const hp = g.teams?.home?.probablePitcher;
      const t = g.gameDate?new Date(g.gameDate).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):'TBD';
      let info = '';
      if (ap){const s=ap.stats?.[0]?.stats;info+=`\n  ${away} SP: ${ap.fullName}`;if(s)info+=` ERA:${s.era} WHIP:${s.whip} K/9:${s.strikeoutsPer9Inn}`;}
      if (hp){const s=hp.stats?.[0]?.stats;info+=`\n  ${home} SP: ${hp.fullName}`;if(s)info+=` ERA:${s.era} WHIP:${s.whip} K/9:${s.strikeoutsPer9Inn}`;}
      return `${away} @ ${home} (${t}):${info}`;
    }).join('\n\n');
  } catch(e) { return null; }
}

// ─── Main Handler ─────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method==='OPTIONS') return res.status(200).end();
  if (req.method!=='POST') return res.status(405).json({error:'Method not allowed'});

  try {
    const { messages } = req.body;
    if (!messages||!Array.isArray(messages)||!messages.length)
      return res.status(400).json({error:'Invalid messages format'});

    const groqKey = process.env.GROQ_API_KEY;
    const oddsKey = process.env.ODDS_API_KEY;
    const newsKey = process.env.NEWS_API_KEY;
    const pandaKey = process.env.PANDASCORE_API_KEY;
    const bdlKey = process.env.BALLDONTLIE_API_KEY;
    const weatherKey = process.env.WEATHER_API_KEY;
    const braveKey = process.env.SERPER_API_KEY;

    if (!groqKey) return res.status(500).json({error:'GROQ_API_KEY not configured.'});

    const { image } = req.body; // optional image { base64, mimeType }
    
    // Validate image size - base64 should be under 4MB
    if (image && image.base64 && image.base64.length > 5000000) {
      return res.status(400).json({ error: 'Image is too large. Please use a smaller screenshot.' });
    }
    const lastUserMsg = [...messages].reverse().find(m=>m.role==='user')?.content||'';
    const playerNames = extractPlayerNames(lastUserMsg);

    // Fetch all data sources in parallel
    const [oddsData, newsData, esportsData, nbaData, mlbData, weatherData, rosterNewsData, webSearchData] = await Promise.all([
      oddsKey ? fetchOdds(lastUserMsg, oddsKey) : null,
      newsKey ? fetchNews(lastUserMsg, newsKey) : null,
      pandaKey ? fetchEsportsMatches(lastUserMsg, pandaKey) : null,
      bdlKey ? fetchNBAStats(lastUserMsg, bdlKey) : null,
      fetchMLB(lastUserMsg),
      weatherKey ? fetchWeather(lastUserMsg, weatherKey) : null,
      (newsKey && playerNames.length) ? fetchRosterNews(playerNames, lastUserMsg, newsKey) : null,
      braveKey ? fetchWebSearch(lastUserMsg, braveKey, !!req.body.image) : null
    ]);

    // Build context block — web search and rosters first
    let contextBlock = '';
    if (webSearchData) contextBlock += `\n\n=== LIVE WEB SEARCH RESULTS ===\n${webSearchData}`;
    if (rosterNewsData) contextBlock += `\n\n=== LATEST ROSTER AND TRANSFER NEWS ===\n${rosterNewsData}`;
    if (weatherData) contextBlock += `\n\n=== LIVE WEATHER ===\n${weatherData}`;
    if (oddsData) contextBlock += `\n\n=== LIVE ODDS ===\n${oddsData}`;
    if (esportsData) contextBlock += `\n\n=== LIVE ESPORTS MATCHES ===\n${esportsData}`;
    if (nbaData) contextBlock += `\n\n=== NBA PLAYER STATS ===\n${nbaData}`;
    if (mlbData) contextBlock += `\n\n=== MLB TODAY ===\n${mlbData}`;
    if (newsData) contextBlock += `\n\n=== LATEST INJURY AND NEWS ===\n${newsData}`;

    const enrichedMessages = messages.map((m,i) => {
      if (i===messages.length-1 && m.role==='user' && contextBlock)
        return {...m, content: m.content+contextBlock};
      return m;
    });

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${groqKey}`},
      body: JSON.stringify({
        model:'meta-llama/llama-4-scout-17b-16e-instruct',
        messages:[
          {role:'system',content:SYSTEM_PROMPT},
          ...enrichedMessages.map((m,i) => {
            // Attach image to last user message if provided
            if (image && i === enrichedMessages.length - 1 && m.role === 'user') {
              return {
                role: 'user',
                content: [
                  {
                    type: 'image_url',
                    image_url: { url: 'data:' + image.mimeType + ';base64,' + image.base64 }
                  },
                  { type: 'text', text: m.content }
                ]
              };
            }
            return m;
          })
        ],
        max_tokens:2000,
        temperature:0.7
      })
    });

    if (!groqRes.ok) {
      const errData = await groqRes.json().catch(()=>({}));
      return res.status(502).json({error:errData.error?.message||`Groq error ${groqRes.status}`});
    }

    const data = await groqRes.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(502).json({error:'Empty response from Groq'});

    return res.status(200).json({
      response: text,
      sources:{
        webSearch:!!webSearchData,
        rosterNews:!!rosterNewsData,
        weather:!!weatherData,
        liveOdds:!!oddsData,
        esports:!!esportsData,
        nba:!!nbaData,
        mlb:!!mlbData,
        news:!!newsData
      }
    });

  } catch(err) {
    console.error('BetIQ API error:',err);
    return res.status(500).json({error:err.message||'Internal server error'});
  }
}
