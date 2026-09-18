/**
 * Ikora App Review panel — Xtream-compatible.
 * Legal public test / Creative Commons open-movie samples only.
 * v4: Google gtv bucket is 403 from many hosts — use Archive/W3C/Mux/Apple instead.
 */
const http = require('http');
const https = require('https');
const { URL } = require('url');

const USER = process.env.REVIEW_USER || 'apple';
const PASS = process.env.REVIEW_PASS || 'ReviewIkora2026';
const PORT = Number(process.env.PORT || 8787);

// Stable posters (verified 200)
const POSTER = {
  bbb: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg',
  elephants: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Elephants_Dream_s5_both.jpg',
  sintel: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Sintel_poster.jpg',
  peach: 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg',
  splash: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
  orange: 'https://orange.blender.org/wp-content/themes/orange/images/media/gallery/s5_both.jpg',
};

const STREAMS = {};

function addMovie(id, name, url, icon, category_id, progressive) {
  STREAMS[id] = { name, kind: 'movie', url, icon, category_id, progressive };
}

function addLive(id, name, url, icon, progressive) {
  STREAMS[id] = { name, kind: 'live', url, icon, category_id: '10', progressive };
}

// --- Open movies / progressive MP4 (Archive.org, W3C, sample hosts) ---
addMovie(1001, 'Big Buck Bunny', 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4', POSTER.bbb, '1', true);
addMovie(1002, 'Elephants Dream', 'https://archive.org/download/ElephantsDream/ed_hd.mp4', POSTER.elephants, '1', true);
addMovie(1003, 'Elephants Dream (512kb)', 'https://archive.org/download/ElephantsDream/ed_1024_512kb.mp4', POSTER.orange, '1', true);
addMovie(1004, 'Sintel Trailer HD', 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', POSTER.sintel, '1', true);
addMovie(1005, 'Sintel Trailer', 'https://media.w3.org/2010/05/sintel/trailer.mp4', POSTER.sintel, '1', true);
addMovie(1006, 'W3C Movie 300', 'https://media.w3.org/2010/05/video/movie_300.mp4', POSTER.peach, '1', true);
addMovie(1007, 'FileSamples Clip', 'https://filesamples.com/samples/video/mp4/sample_640x360.mp4', POSTER.splash, '1', true);
addMovie(1008, 'SampleLib 5s', 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4', POSTER.peach, '1', true);
addMovie(1009, 'Learning Container Sample', 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4', POSTER.splash, '1', true);

// --- HLS vendor test streams ---
addMovie(1101, 'Mux BBB HLS', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', POSTER.bbb, '2', false);
addMovie(1102, 'Mux Test 001', 'https://test-streams.mux.dev/test_001/stream.m3u8', POSTER.peach, '2', false);
addMovie(1103, 'Mux PTS Shift', 'https://test-streams.mux.dev/pts_shift/master.m3u8', POSTER.splash, '2', false);
addMovie(1104, 'Apple BipBop fMP4', 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8', POSTER.sintel, '2', false);
addMovie(1105, 'Apple BipBop 16x9', 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8', POSTER.elephants, '2', false);
addMovie(1106, 'Apple BipBop 4x3', 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_4x3/bipbop_4x3_variant.m3u8', POSTER.orange, '2', false);
addMovie(1107, 'Apple ADV DV Atmos', 'https://devstreaming-cdn.apple.com/videos/streaming/examples/adv_dv_atmos/main.m3u8', POSTER.peach, '2', false);
addMovie(1108, 'Unified Tears of Steel HLS', 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8', POSTER.peach, '2', false);

// --- Live tests (real HLS live + progressive stand-ins labeled live) ---
addLive(2001, 'Akamai Test Live', 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8', POSTER.peach, false);
addLive(2002, 'Mux BBB (as live)', 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8', POSTER.bbb, false);
addLive(2003, 'Apple BipBop Live-style', 'https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_16x9/bipbop_16x9_variant.m3u8', POSTER.sintel, false);
addLive(2004, 'BBB Progressive Live', 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4', POSTER.bbb, true);
addLive(2005, 'Elephants Progressive Live', 'https://archive.org/download/ElephantsDream/ed_hd.mp4', POSTER.elephants, true);
addLive(2006, 'Sintel Progressive Live', 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4', POSTER.sintel, true);

const SERIES = {
  3001: {
    name: 'Blender Open Movies',
    cover: POSTER.bbb,
    category_id: '20',
    plot: 'Creative Commons open movies (Archive.org / W3C). Not a TV pack.',
    episodes: {
      '1': [
        { id: 4001, episode_num: 1, title: 'Big Buck Bunny', container_extension: 'mp4', info: { movie_image: POSTER.bbb }, direct_source: 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4' },
        { id: 4002, episode_num: 2, title: 'Elephants Dream', container_extension: 'mp4', info: { movie_image: POSTER.elephants }, direct_source: 'https://archive.org/download/ElephantsDream/ed_hd.mp4' },
        { id: 4003, episode_num: 3, title: 'Sintel Trailer HD', container_extension: 'mp4', info: { movie_image: POSTER.sintel }, direct_source: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4' },
        { id: 4004, episode_num: 4, title: 'W3C Movie 300', container_extension: 'mp4', info: { movie_image: POSTER.peach }, direct_source: 'https://media.w3.org/2010/05/video/movie_300.mp4' },
      ],
    },
  },
  3002: {
    name: 'Vendor HLS Samples',
    cover: POSTER.splash,
    category_id: '20',
    plot: 'Mux / Apple / Unified Streaming public test HLS for playback QA.',
    episodes: {
      '1': [
        { id: 4101, episode_num: 1, title: 'Mux BBB', container_extension: 'm3u8', info: { movie_image: POSTER.bbb }, direct_source: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
        { id: 4102, episode_num: 2, title: 'Apple BipBop fMP4', container_extension: 'm3u8', info: { movie_image: POSTER.sintel }, direct_source: 'https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8' },
        { id: 4103, episode_num: 3, title: 'Unified Tears of Steel', container_extension: 'm3u8', info: { movie_image: POSTER.peach }, direct_source: 'https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8' },
        { id: 4104, episode_num: 4, title: 'Mux Test 001', container_extension: 'm3u8', info: { movie_image: POSTER.splash }, direct_source: 'https://test-streams.mux.dev/test_001/stream.m3u8' },
      ],
    },
  },
};

function authOk(u, p) { return u === USER && p === PASS; }

function json(res, code, body) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(body));
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { headers: { 'User-Agent': 'IkoraReviewPanel/4.0', Accept: '*/*' } }, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) {
        const next = new URL(r.headers.location, url).href;
        r.resume();
        return fetchText(next).then(resolve, reject);
      }
      if (r.statusCode && r.statusCode >= 400) {
        r.resume();
        return reject(new Error(`HTTP ${r.statusCode}`));
      }
      const chunks = [];
      r.on('data', (c) => chunks.push(c));
      r.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('timeout')));
  });
}

function absolutizeM3u8(text, masterUrl) {
  return text.split(/\r?\n/).map((line) => {
    const trimmed = line.trim();
    if (!trimmed) return line;
    if (trimmed.startsWith('#')) {
      return line.replace(/URI="([^"]+)"/g, (_, u) => {
        try { return `URI="${new URL(u, masterUrl).href}"`; } catch { return `URI="${u}"`; }
      });
    }
    try { return new URL(trimmed, masterUrl).href; } catch { return line; }
  }).join('\n');
}

async function serveMedia(res, stream) {
  if (stream.progressive || /\.mp4(\?|$)/i.test(stream.url)) {
    res.writeHead(302, { Location: stream.url, 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store' });
    return res.end();
  }
  try {
    const body = absolutizeM3u8(await fetchText(stream.url), stream.url);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.apple.mpegurl',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch (e) {
    json(res, 502, { error: String(e.message || e) });
  }
}

function accountPayload(username) {
  const exp = Math.floor(Date.now() / 1000) + 365 * 24 * 3600;
  return {
    user_info: {
      username, password: PASS,
      message: 'Ikora App Review panel — legal CC/open + vendor test samples only',
      auth: 1, status: 'Active', exp_date: String(exp), is_trial: '0',
      active_cons: '0', created_at: String(Math.floor(Date.now() / 1000) - 86400),
      max_connections: '3', allowed_output_formats: ['m3u8', 'ts', 'mp4'],
    },
    server_info: {
      url: 'review.local', port: String(PORT), https_port: String(PORT),
      server_protocol: 'http', rtmp_port: '0', timezone: 'UTC',
      timestamp_now: Math.floor(Date.now() / 1000),
      time_now: new Date().toISOString().replace('T', ' ').slice(0, 19),
    },
  };
}

function handlePlayerApi(req, res, url) {
  const u = url.searchParams.get('username') || '';
  const p = url.searchParams.get('password') || '';
  if (!authOk(u, p)) return json(res, 200, { user_info: { auth: 0, status: 'Disabled', message: 'Invalid credentials' } });
  const action = url.searchParams.get('action') || '';
  if (!action) return json(res, 200, accountPayload(u));
  if (action === 'get_vod_categories') {
    return json(res, 200, [
      { category_id: '1', category_name: 'Open Movies (MP4)', parent_id: 0 },
      { category_id: '2', category_name: 'HLS Test Streams', parent_id: 0 },
    ]);
  }
  if (action === 'get_live_categories') {
    return json(res, 200, [{ category_id: '10', category_name: 'Sample Live Tests', parent_id: 0 }]);
  }
  if (action === 'get_series_categories') {
    return json(res, 200, [{ category_id: '20', category_name: 'Sample Shows', parent_id: 0 }]);
  }
  if (action === 'get_vod_streams') {
    const cat = url.searchParams.get('category_id');
    const rows = Object.entries(STREAMS)
      .filter(([, s]) => s.kind === 'movie')
      .filter(([, s]) => !cat || String(s.category_id) === String(cat))
      .map(([sid, s], i) => ({
        num: i + 1, name: s.name, stream_type: 'movie', stream_id: Number(sid),
        stream_icon: s.icon, rating: '0', rating_5based: 0,
        added: String(Math.floor(Date.now() / 1000) - 86400),
        category_id: s.category_id, container_extension: s.progressive ? 'mp4' : 'm3u8', custom_sid: '',
        direct_source: s.url,
      }));
    return json(res, 200, rows);
  }
  if (action === 'get_live_streams') {
    const rows = Object.entries(STREAMS)
      .filter(([, s]) => s.kind === 'live')
      .map(([sid, s], i) => ({
        num: i + 1, name: s.name, stream_type: 'live', stream_id: Number(sid),
        stream_icon: s.icon, epg_channel_id: '',
        added: String(Math.floor(Date.now() / 1000) - 86400),
        category_id: s.category_id, custom_sid: '', tv_archive: 0,
        direct_source: s.url, tv_archive_duration: 0,
      }));
    return json(res, 200, rows);
  }
  if (action === 'get_series') {
    const rows = Object.entries(SERIES).map(([sid, s], i) => ({
      num: i + 1, name: s.name, series_id: Number(sid), cover: s.cover, plot: s.plot,
      cast: '', director: '', genre: 'Sample', releaseDate: '2024-01-01',
      last_modified: String(Math.floor(Date.now() / 1000)), rating: '0', rating_5based: 0,
      backdrop_path: [], youtube_trailer: '', episode_run_time: '10', category_id: s.category_id,
    }));
    return json(res, 200, rows);
  }
  if (action === 'get_vod_info') {
    const vodId = url.searchParams.get('vod_id');
    const s = STREAMS[vodId];
    if (!s || s.kind !== 'movie') return json(res, 200, {});
    return json(res, 200, {
      info: {
        name: s.name, o_name: s.name, movie_image: s.icon, cover_big: s.icon,
        plot: 'Legal Creative Commons / vendor test sample for App Review. Not a TV channel pack.',
        description: 'Open or vendor-hosted test media only.', genre: 'Sample', duration: '00:10:00',
      },
      movie_data: {
        stream_id: Number(vodId), name: s.name,
        container_extension: s.progressive ? 'mp4' : 'm3u8',
        direct_source: s.url,
      },
    });
  }
  if (action === 'get_series_info') {
    const seriesId = url.searchParams.get('series_id');
    const s = SERIES[seriesId];
    if (!s) return json(res, 200, { info: {}, episodes: {} });
    return json(res, 200, {
      seasons: [{ season_number: 1, name: 'Season 1', cover: s.cover }],
      info: { name: s.name, cover: s.cover, plot: s.plot, genre: 'Sample', releaseDate: '2024-01-01', rating: '0' },
      episodes: s.episodes,
    });
  }
  if (action === 'get_short_epg' || action === 'get_simple_data_table') return json(res, 200, []);
  return json(res, 200, []);
}

function handleStreamPath(req, res, pathname) {
  const m = pathname.match(/^\/(live|movie|series)\/([^/]+)\/([^/]+)\/(\d+)\.(\w+)$/);
  if (!m) return false;
  const [, kind, user, pass, sid] = m;
  if (!authOk(decodeURIComponent(user), decodeURIComponent(pass))) {
    json(res, 403, { error: 'Forbidden' });
    return true;
  }
  if (kind === 'series') {
    for (const series of Object.values(SERIES)) {
      for (const eps of Object.values(series.episodes)) {
        const hit = eps.find((e) => String(e.id) === String(sid));
        if (hit?.direct_source) {
          const progressive = /\.mp4(\?|$)/i.test(hit.direct_source);
          serveMedia(res, { url: hit.direct_source, progressive });
          return true;
        }
      }
    }
    json(res, 404, { error: 'Not found' });
    return true;
  }
  const s = STREAMS[sid];
  if (!s) { json(res, 404, { error: 'Not found' }); return true; }
  if ((kind === 'live' && s.kind !== 'live') || (kind === 'movie' && s.kind !== 'movie')) {
    json(res, 404, { error: 'Wrong kind' }); return true;
  }
  serveMedia(res, s);
  return true;
}

const server = http.createServer((req, res) => {
  try {
    const host = req.headers.host || `127.0.0.1:${PORT}`;
    const url = new URL(req.url || '/', `http://${host}`);
    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS', 'Access-Control-Allow-Headers': '*' });
      return res.end();
    }
    if (url.pathname === '/' || url.pathname === '/health') {
      const movies = Object.values(STREAMS).filter((s) => s.kind === 'movie').length;
      const live = Object.values(STREAMS).filter((s) => s.kind === 'live').length;
      return json(res, 200, {
        ok: true, name: 'Ikora App Review panel', version: 4,
        counts: { movies, live, series: Object.keys(SERIES).length },
        note: 'Legal CC/open (Archive/W3C) + Mux/Apple/Unified/Akamai vendor tests only. Not a TV channel service.',
      });
    }
    if (url.pathname === '/player_api.php' || url.pathname.endsWith('/player_api.php')) {
      return handlePlayerApi(req, res, url);
    }
    if (handleStreamPath(req, res, url.pathname)) return;
    json(res, 404, { error: 'Not found' });
  } catch (e) {
    json(res, 500, { error: String(e && e.message ? e.message : e) });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Ikora review panel v4 on :${PORT} user=${USER}`);
});


process.on("uncaughtException", (err) => {
  console.error("uncaughtException", err);
});
process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection", err);
});
