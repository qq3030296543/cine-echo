// src/App.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, CheckCircle2 } from "lucide-react";
import { mockMovies } from "./mockData";

const OMDB_BASE = "https://www.omdbapi.com/";
const OMDB_KEY = import.meta.env.VITE_OMDB_API_KEY;

/**
 * 16 型观影人格 + MBTI 参考
 */
const PERSONAS = [
  {
    id: "NEON_DRIFTER",
    name: "霓虹浪游者",
    code: "ND-T",
    mbtiTypes: ["ENTP", "ESTP"],
    primaryGenres: ["Crime", "Thriller", "Sci-Fi"],
    moodKeywords: ["neon", "noir", "night", "city", "synth", "cyberpunk"],
    pacePreference: "any",
    eraPreference: "modern",
    avatarImage: "/personas/A.jpg",
    accentFrom: "from-fuchsia-500",
    accentTo: "to-sky-400",
    traits: ["夜行人", "都市霓虹控", "反英雄爱好者", "情绪先行"],
    tagline: "在夜色与霓虹之间，寻找只属于自己的那条高架路。",
    description:
      "你偏爱发生在夜色与都市边缘的故事。霓虹、雨夜、公路和模糊的道德边界，会让你瞬间进入“电影状态”。你不介意故事慢一点，但必须氛围够浓。",
  },
  {
    id: "MELANCHOLIC_DREAMER",
    name: "失重梦行者",
    code: "MD-N",
    mbtiTypes: ["INFP", "ISFP"],
    primaryGenres: ["Romance", "Drama"],
    moodKeywords: [
      "melancholy",
      "slow-burn",
      "intimate",
      "memory",
      "nostalgia",
    ],
    pacePreference: "slow",
    eraPreference: "any",
    avatarImage: "/personas/B.jpg",
    accentFrom: "from-rose-400",
    accentTo: "to-amber-300",
    traits: ["感性脑", "台词收藏家", "深夜emo达人", "小细节控"],
    tagline: "你喜欢电影把心事说到一半，剩下一半留给沉默。",
    description:
      "你被那些不吵不闹、情绪浓度却很高的电影吸引。暧昧的关系、克制的台词、被压抑的情感，对你来说比任何“狗血大戏”都更动人。",
  },
  {
    id: "CHAOS_JESTER",
    name: "混沌喜剧人",
    code: "CJ-E",
    mbtiTypes: ["ENFP", "ESFP"],
    primaryGenres: ["Comedy", "Action"],
    moodKeywords: ["satire", "chaos", "absurd", "wild", "joke"],
    pacePreference: "fast",
    eraPreference: "modern",
    avatarImage: "/personas/C.jpg",
    accentFrom: "from-yellow-300",
    accentTo: "to-orange-500",
    traits: ["梗王", "嘴不饶人", "自带BGM", "热场担当"],
    tagline: "你在混乱和玩笑的边缘，看清世界的真相。",
    description:
      "你喜欢节奏明快、能同时让你大笑又微妙地刺痛一下现实感的电影。荒诞、黑色幽默、反转和讽刺，是你天然的舒适区。",
  },
  {
    id: "MYTHIC_SWORDSMAN",
    name: "剑走偏锋者",
    code: "MS-I",
    mbtiTypes: ["ISFJ", "ESFJ"],
    primaryGenres: ["Action", "Adventure", "Wuxia", "War"],
    moodKeywords: ["epic", "wuxia", "mythic", "heroic", "color"],
    pacePreference: "any",
    eraPreference: "classic",
    avatarImage: "/personas/D.jpg",
    accentFrom: "from-emerald-400",
    accentTo: "to-amber-500",
    traits: ["重度武侠迷", "配色鉴赏师", "宿命感爱好者", "台词复读机"],
    tagline: "你在江湖的刀光剑影里，寻找一点属于自己的浪漫。",
    description:
      "你对“大场面”确实没有抵抗力，但真正打动你的是那种带着宿命感的侠义和情义。色彩、构图、身段和配乐，对你来说都像一场精心设计的舞蹈。",
  },
  {
    id: "COSMIC_THINKER",
    name: "宇宙思考者",
    code: "CT-N",
    mbtiTypes: ["INTP", "INTJ"],
    primaryGenres: ["Sci-Fi", "Fantasy"],
    moodKeywords: [
      "philosophy",
      "space",
      "future",
      "mind-bend",
      "speculative",
    ],
    pacePreference: "slow",
    eraPreference: "any",
    avatarImage: "/personas/E.jpg",
    accentFrom: "from-indigo-400",
    accentTo: "to-sky-300",
    traits: ["设定控", "世界观工程师", "爱脑洞", "喜欢复盘剧情"],
    tagline: "你用宇宙尺度的问题，审视日常生活的细枝末节。",
    description:
      "你不满足于爽片式的科幻设定，更在意这些设定背后提出的问题：身份、意识、时间与自由意志。电影不只是看完，而是会在你脑子里长出二刷三刷的冲动。",
  },
  {
    id: "COZY_REALIST",
    name: "日常温度计",
    code: "CR-F",
    mbtiTypes: ["ISFJ", "ISFP"],
    primaryGenres: ["Drama", "Family"],
    moodKeywords: ["slice-of-life", "warm", "realist", "gentle"],
    pacePreference: "slow",
    eraPreference: "any",
    avatarImage: "/personas/F.jpg",
    accentFrom: "from-emerald-300",
    accentTo: "to-teal-400",
    traits: ["生活观察员", "泪点很低", "重度共情", "治愈系人类"],
    tagline: "你相信一日三餐、争吵与和解，本身就是最好的剧本。",
    description:
      "你被贴近生活的作品吸引：家庭、朋友、成长、离别，这些题材在别人眼里“平淡”，在你眼里却格外有温度。你会记住那些看似普通却真实得发烫的瞬间。",
  },
  {
    id: "MIDNIGHT_ORACLE",
    name: "午夜偏执者",
    code: "MO-X",
    mbtiTypes: ["INFJ", "INTJ"],
    primaryGenres: ["Horror", "Thriller", "Mystery"],
    moodKeywords: ["dark", "paranoia", "nightmare", "unsettling", "twist"],
    pacePreference: "any",
    eraPreference: "any",
    avatarImage: "/personas/G.jpg",
    accentFrom: "from-slate-500",
    accentTo: "to-rose-500",
    traits: ["爱自找刺激", "细节猎手", "反转预言家", "氛围感至上"],
    tagline: "你喜欢在安全的座位上，体验最不安全的情绪。",
    description:
      "心理惊悚、悬疑、恐怖片对你来说不是“吓唬”，而是一场关于人性和未知的实验。你乐于在细节里拼出真相，更享受那种“越想越毛”的后劲。",
  },
  {
    id: "TAPE_KEEPER",
    name: "录像带守门人",
    code: "TK-R",
    mbtiTypes: ["ISTJ", "INTJ"],
    primaryGenres: ["Drama", "Classic", "Crime"],
    moodKeywords: ["retro", "vhs", "classic", "cinema", "nostalgia"],
    pacePreference: "slow",
    eraPreference: "classic",
    avatarImage: "/personas/H.jpg",
    accentFrom: "from-amber-400",
    accentTo: "to-rose-400",
    traits: ["老片信徒", "胶片情结", "台词考古专家", "不爱剧透"],
    tagline: "你把每一部喜欢的老电影，都当成一盘需要倒带的小宇宙。",
    description:
      "七八十年代、九十年代的电影，在你心里有特殊地位。你欣赏旧时代的叙事节奏和调度方式，某些经典镜头在你脑海里已经被倒放了很多遍。",
  },
  {
    id: "FESTIVAL_WANDERER",
    name: "影展候鸟",
    code: "FW-N",
    mbtiTypes: ["INFP", "ENFP"],
    primaryGenres: ["Drama", "Art-House", "Foreign"],
    moodKeywords: ["festival", "arthouse", "poetic", "auteur"],
    pacePreference: "slow",
    eraPreference: "any",
    avatarImage: "/personas/I.jpg",
    accentFrom: "from-purple-400",
    accentTo: "to-sky-300",
    traits: ["冷门片猎人", "海报收藏癖", "片尾不走人", "长评选手"],
    tagline: "你总是在找那部“只有少数人懂”的电影。",
    description:
      "你容易被影展片、作者电影吸引。情节可以很淡，但形式感、摄影、剪辑和声音设计必须有意思。对你来说，电影是一封写给少数观众的长信。",
  },
  {
    id: "ANIME_REALM_TRAVELER",
    name: "二维宇宙旅人",
    code: "AR-F",
    mbtiTypes: ["ENFP", "INFP"],
    primaryGenres: ["Animation", "Fantasy", "Adventure"],
    moodKeywords: ["anime", "magic", "whimsical", "coming-of-age"],
    pacePreference: "any",
    eraPreference: "any",
    avatarImage: "/personas/J.jpg",
    accentFrom: "from-teal-300",
    accentTo: "to-indigo-400",
    traits: ["重度二次元", "设定脑补王", "OST循环玩家", "画风至上"],
    tagline: "你相信，手绘线条和CG光点里藏着真正的魔法。",
    description:
      "你愿意为一部动画电影走进影院多次。无论是热血、治愈还是奇幻，只要世界观自洽、情绪真诚，你都能心甘情愿在片尾等完最后一帧。",
  },
  {
    id: "BLOCKBUSTER_STRATEGIST",
    name: "爆米花战术家",
    code: "BS-E",
    mbtiTypes: ["ESTP", "ESFP"],
    primaryGenres: ["Action", "Adventure", "Sci-Fi"],
    moodKeywords: ["blockbuster", "spectacle", "hero", "franchise"],
    pacePreference: "fast",
    eraPreference: "modern",
    avatarImage: "/personas/K.jpg",
    accentFrom: "from-red-400",
    accentTo: "to-yellow-400",
    traits: ["爽片在行", "爱大银幕", "爆米花不掉", "彩蛋必看完"],
    tagline: "你享受在大银幕上，被声光电统治的两个小时。",
    description:
      "你对商业大片并不排斥，甚至颇为专业：节奏、动作场面、特效完成度，都是你心里的评分项。你会认真区分“好看的爽片”和“只有噪音的爽片”。",
  },
  {
    id: "SOCIAL_PULSE",
    name: "社会心跳监听者",
    code: "SP-F",
    mbtiTypes: ["INFJ", "ENFJ"],
    primaryGenres: ["Documentary", "Drama"],
    moodKeywords: ["social", "realism", "issue", "humanity"],
    pacePreference: "slow",
    eraPreference: "any",
    avatarImage: "/personas/L.jpg",
    accentFrom: "from-sky-400",
    accentTo: "to-emerald-400",
    traits: ["现实题材爱好者", "共情力爆棚", "关注社会议题", "爱聊三观"],
    tagline: "你习惯先看世界怎么痛，再想自己能做什么。",
    description:
      "你会被纪录片、社会现实题材、群像戏强烈吸引。你关心的不只是角色的命运，更是“这件事在现实中意味着什么”。电影对你来说，是理解世界的一种方式。",
  },
  {
    id: "MUSIC_VIBEWEAVER",
    name: "配乐气氛组",
    code: "MV-E",
    mbtiTypes: ["ENFP", "ISFP"],
    primaryGenres: ["Music", "Drama", "Romance"],
    moodKeywords: ["music", "rhythm", "band", "dance"],
    pacePreference: "any",
    eraPreference: "any",
    avatarImage: "/personas/M.jpg",
    accentFrom: "from-pink-400",
    accentTo: "to-violet-400",
    traits: ["OST控", "循环BGM人", "即兴舞者", "节奏强迫症"],
    tagline: "在你心里，每一段人生都该有配乐。",
    description:
      "你很容易被配乐、歌曲和节奏带进电影。无论是乐队、舞蹈、音乐剧还是节奏感很强的剪辑，只要音乐一响，你就已经半只脚踏进电影世界。",
  },
  {
    id: "PUZZLE_ARCHITECT",
    name: "叙事拼图师",
    code: "PA-T",
    mbtiTypes: ["INTP", "INTJ"],
    primaryGenres: ["Mystery", "Sci-Fi", "Thriller"],
    moodKeywords: ["nonlinear", "puzzle", "twist", "meta"],
    pacePreference: "any",
    eraPreference: "any",
    avatarImage: "/personas/N.jpg",
    accentFrom: "from-cyan-400",
    accentTo: "to-indigo-500",
    traits: ["故事结构控", "反转爱好者", "喜欢画时间线", "不怕烧脑"],
    tagline: "你享受的是“看懂”的瞬间，而不只是看完。",
    description:
      "非线性叙事、多重时间线、第四面墙，这些在别人眼里“太绕”的东西，对你来说恰好有趣。你会在脑中自动搭建时间轴，用一块块碎片拼回完整故事。",
  },
  {
    id: "LIGHTHEARTED_HEALER",
    name: "糖分补给站",
    code: "LH-F",
    mbtiTypes: ["ESFJ", "ENFP"],
    primaryGenres: ["Romance", "Comedy"],
    moodKeywords: ["warm", "cute", "healing", "feel-good"],
    pacePreference: "fast",
    eraPreference: "any",
    avatarImage: "/personas/O.jpg",
    accentFrom: "from-amber-300",
    accentTo: "to-pink-400",
    traits: ["小甜片爱好者", "cp嗑学家", "朋友圈快乐源泉", "拒绝糟糕结局"],
    tagline: "你相信世界已经够辛苦了，电影可以多给点糖。",
    description:
      "你偏爱轻松、明快、氛围温柔的电影。你可以接受套路，但不能接受坏结局——你希望电影是一个可以暂时放下防备、认真快乐两小时的小房间。",
  },
  {
    id: "MINIMALIST_MONK",
    name: "极简镜头僧",
    code: "MM-I",
    mbtiTypes: ["ISTP", "INTJ"],
    primaryGenres: ["Art-House", "Drama"],
    moodKeywords: ["minimal", "silence", "static", "auteur"],
    pacePreference: "slow",
    eraPreference: "any",
    avatarImage: "/personas/P.jpg",
    accentFrom: "from-slate-400",
    accentTo: "to-emerald-300",
    traits: ["长镜头爱好者", "极简主义", "喜欢“什么都没发生”", "耐心MAX"],
    tagline: "镜头不动，但情绪一直在走。",
    description:
      "你对极简、冷淡、节制的表达方式有天然好感。长镜头、固定机位、极少对白，在别人眼里是“无聊”，在你眼里却是一种诚实而不讨好的美学。",
  },
];

// ------------------------
// 中文片名映射
// ------------------------
const chineseTitleMap = {
  "无间道": "Infernal Affairs",
  "無間道": "Infernal Affairs",
  "无间道1": "Infernal Affairs",
  "無間道1": "Infernal Affairs",
  "让子弹飞": "Let the Bullets Fly",
  "讓子彈飛": "Let the Bullets Fly",
  "霸王别姬": "Farewell My Concubine",
  "霸王別姬": "Farewell My Concubine",
  "卧虎藏龙": "Crouching Tiger, Hidden Dragon",
  "臥虎藏龍": "Crouching Tiger, Hidden Dragon",
  "英雄": "Hero",
  "重庆森林": "Chungking Express",
  "重慶森林": "Chungking Express",
  "花样年华": "In the Mood for Love",
  "花樣年華": "In the Mood for Love",
  "一一": "Yi Yi",
  "东邪西毒": "Ashes of Time",
  "東邪西毒": "Ashes of Time",
  "春光乍泄": "Happy Together",
  "大话西游": "A Chinese Odyssey Part Two: Cinderella",
  "大話西遊": "A Chinese Odyssey Part Two: Cinderella",
  "大话西游之大圣娶亲": "A Chinese Odyssey Part Two: Cinderella",
  "大話西遊之大聖娶親": "A Chinese Odyssey Part Two: Cinderella",
};

function hasChinese(str) {
  return /[\u4e00-\u9fff]/.test(str);
}

function mapChineseTitle(input) {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (Object.prototype.hasOwnProperty.call(chineseTitleMap, trimmed)) {
    return chineseTitleMap[trimmed];
  }
  for (const key of Object.keys(chineseTitleMap)) {
    if (trimmed.includes(key) || key.includes(trimmed)) {
      return chineseTitleMap[key];
    }
  }
  return null;
}

// 从 OMDb 详情中提取标签
function deriveTags(detail) {
  const tags = [];
  if (detail.Genre) {
    detail.Genre.split(",")
      .map((g) => g.trim())
      .filter(Boolean)
      .slice(0, 3)
      .forEach((g) => tags.push(g));
  }
  if (detail.Runtime) {
    const mins = parseInt(detail.Runtime, 10);
    if (!Number.isNaN(mins)) {
      tags.push(mins >= 120 ? "Slow-Burn" : "Tight Pace");
    }
  }
  if (detail.Country) {
    if (detail.Country.includes("Japan")) tags.push("Japanese");
    if (detail.Country.includes("France")) tags.push("Art-House");
    if (
      detail.Country.includes("Hong Kong") ||
      detail.Country.includes("China")
    ) {
      tags.push("Chinese Cinema");
    }
  }
  return Array.from(new Set(tags)).slice(0, 6);
}

// 搜索结果 ➜ Movie 结构
function mapSearchItemToMovie(item) {
  const poster =
    item.Poster && item.Poster !== "N/A" ? item.Poster : null;
  return {
    id: item.imdbID,
    title: item.Title,
    year: item.Year,
    poster,
    link: `https://www.imdb.com/title/${item.imdbID}`,
    tags: [],
  };
}

// 按 ID 获取详情
async function fetchMovieDetailById(id) {
  if (!OMDB_KEY) {
    const fallback = mockMovies.find((m) => m.id === id);
    return fallback || null;
  }
  const params = new URLSearchParams({
    apikey: OMDB_KEY,
    i: id,
    plot: "short",
  });
  const res = await fetch(`${OMDB_BASE}?${params.toString()}`);
  const data = await res.json();
  if (data.Response === "False") {
    throw new Error(data.Error || "未找到电影详情");
  }
  let poster =
    data.Poster && data.Poster !== "N/A" ? data.Poster : null;
  if (!poster) {
    const fallback = mockMovies.find(
      (m) => m.id === data.imdbID || m.title === data.Title
    );
    if (fallback?.poster) poster = fallback.poster;
  }
  return {
    id: data.imdbID,
    title: data.Title,
    year: data.Year,
    plot: data.Plot,
    poster,
    link: `https://www.imdb.com/title/${data.imdbID}`,
    genres: data.Genre ? data.Genre.split(",").map((g) => g.trim()) : [],
    runtimeMinutes: data.Runtime
      ? parseInt(data.Runtime, 10) || null
      : null,
    tags: deriveTags(data),
  };
}

// 搜索候选列表
async function searchMoviesByTitle(rawQuery) {
  const trimmed = rawQuery.trim();
  if (!trimmed) return [];
  const containsChinese = hasChinese(trimmed);

  if (!OMDB_KEY) {
    const lower = trimmed.toLowerCase();
    const filtered = mockMovies.filter((m) =>
      m.title.toLowerCase().includes(lower)
    );
    return (filtered.length ? filtered : mockMovies).slice(0, 8);
  }

  let searchTerm = trimmed;
  if (containsChinese) {
    const mapped = mapChineseTitle(trimmed);
    if (!mapped) {
      const lower = searchTerm.toLowerCase();
      const filtered = mockMovies.filter((m) =>
        m.title.toLowerCase().includes(lower)
      );
      return (filtered.length ? filtered : mockMovies).slice(0, 8);
    }
    searchTerm = mapped;
  }

  const params = new URLSearchParams({
    apikey: OMDB_KEY,
    s: searchTerm,
    type: "movie",
    page: "1",
  });
  const res = await fetch(`${OMDB_BASE}?${params.toString()}`);
  const data = await res.json();
  if (data.Response === "False" || !data.Search) {
    const lower = searchTerm.toLowerCase();
    const filtered = mockMovies.filter((m) =>
      m.title.toLowerCase().includes(lower)
    );
    return (filtered.length ? filtered : mockMovies).slice(0, 8);
  }
  const mapped = data.Search.map(mapSearchItemToMovie);
  const withPoster = mapped.filter((m) => !!m.poster);
  if (withPoster.length >= 4) return withPoster.slice(0, 8);
  return mapped.slice(0, 8);
}

/** 计算三部电影的“特征” */
function computeFeatures(picks) {
  const genresCount = new Map();
  const years = [];
  const runtimes = [];
  const collectedTags = [];

  picks.forEach((m) => {
    if (m.genres) {
      m.genres.forEach((g) => {
        const key = g.trim();
        if (!key) return;
        genresCount.set(key, (genresCount.get(key) || 0) + 1);
        collectedTags.push(key);
      });
    }
    if (m.runtimeMinutes) runtimes.push(m.runtimeMinutes);
    if (m.year) {
      const y = parseInt(m.year, 10);
      if (!Number.isNaN(y)) years.push(y);
    }
    if (m.tags) {
      collectedTags.push(...m.tags);
    }
  });

  const sortedGenres = Array.from(genresCount.entries()).sort(
    (a, b) => b[1] - a[1]
  );
  const topGenres = sortedGenres.slice(0, 3).map(([g]) => g);

  const avgYear =
    years.length > 0
      ? Math.round(years.reduce((a, b) => a + b, 0) / years.length)
      : null;

  const avgRuntime =
    runtimes.length > 0
      ? Math.round(runtimes.reduce((a, b) => a + b, 0) / runtimes.length)
      : null;

  const tagSet = new Set(
    collectedTags.map((t) => t.toLowerCase().trim())
  );

  return { topGenres, avgYear, avgRuntime, tagSet };
}

function scorePersona(persona, features) {
  let score = 0;

  // 类型匹配
  features.topGenres.forEach((g) => {
    const gLower = g.toLowerCase();
    persona.primaryGenres.forEach((pg) => {
      const pLower = pg.toLowerCase();
      if (gLower.includes(pLower) || pLower.includes(gLower)) {
        score += 4;
      }
    });
  });

  // 氛围 / 标签匹配
  features.tagSet.forEach((tag) => {
    persona.moodKeywords.forEach((mk) => {
      if (tag.includes(mk.toLowerCase())) score += 1;
    });
  });

  // 年代偏好
  if (features.avgYear) {
    if (persona.eraPreference === "modern" && features.avgYear >= 2010) {
      score += 2;
    } else if (
      persona.eraPreference === "classic" &&
      features.avgYear <= 2000
    ) {
      score += 2;
    }
  }

  // 节奏偏好
  if (features.avgRuntime) {
    if (persona.pacePreference === "slow" && features.avgRuntime >= 125) {
      score += 2;
    } else if (
      persona.pacePreference === "fast" &&
      features.avgRuntime <= 105
    ) {
      score += 2;
    }
  }

  return score;
}

function pickPersona(features) {
  let best = PERSONAS[0];
  let bestScore = -Infinity;

  PERSONAS.forEach((persona) => {
    const s = scorePersona(persona, features);
    if (s > bestScore) {
      bestScore = s;
      best = persona;
    }
  });

  // 分数太低时的粗暴 fallback
  if (bestScore <= 0 && features.topGenres.length) {
    const g1 = features.topGenres[0].toLowerCase();
    if (/crime|thriller|noir/i.test(g1)) {
      best =
        PERSONAS.find((p) => p.id === "NEON_DRIFTER") || best;
    } else if (/romance|drama|melodrama/i.test(g1)) {
      best =
        PERSONAS.find((p) => p.id === "MELANCHOLIC_DREAMER") ||
        best;
    } else if (/sci-fi|fantasy/i.test(g1)) {
      best =
        PERSONAS.find((p) => p.id === "COSMIC_THINKER") || best;
    } else if (/action|adventure|wuxia|war/i.test(g1)) {
      best =
        PERSONAS.find((p) => p.id === "MYTHIC_SWORDSMAN") || best;
    }
  }

  return best;
}

// 构建观影画像
function buildTasteProfile(picks) {
  const features = computeFeatures(picks);
  const persona = pickPersona(features);

  const genreStr =
    features.topGenres.length > 0
      ? features.topGenres.join(" / ")
      : "多种类型";

  const paragraphs = [];

  paragraphs.push(persona.description);

  paragraphs.push(
    `从你选的三部电影来看，你对「${genreStr}」这条气质线很敏感，比起“看过多少片”，你更在意它们是否在同一个情绪频段上。`
  );

  if (features.avgYear) {
    if (features.avgYear >= 2015) {
      paragraphs.push(
        "整体年份偏新，你的雷达经常对准近十几年的作品，享受当代镜头语言和声音设计带来的质感。"
      );
    } else if (features.avgYear <= 2000) {
      paragraphs.push(
        "你的选片明显向经典靠拢，老片里的质感、胶片感和缓慢节奏，对你来说不是“过时”，而是更高级的沉浸方式。"
      );
    } else {
      paragraphs.push(
        "新片与旧片在你的片单里共存：你一方面愿意回看经典，一方面也关注当代创作者的表达。"
      );
    }
  }

  if (features.avgRuntime) {
    if (features.avgRuntime >= 130) {
      paragraphs.push(
        "从平均片长来看，你挺愿意把时间交给电影本身，长片对你来说不是负担，而是可以慢慢酝酿情绪的容器。"
      );
    } else if (features.avgRuntime <= 105) {
      paragraphs.push(
        "你对拖沓的叙事比较敏感，更偏爱干净利落的节奏，每个转折都要有意义，不能只是“撑时长”。"
      );
    }
  }

  const tagCandidates = new Set();
  persona.moodKeywords.forEach((k) =>
    tagCandidates.add(k.replace(/^\w/, (c) => c.toUpperCase()))
  );
  features.topGenres.forEach((g) => tagCandidates.add(g));
  features.tagSet.forEach((t) => tagCandidates.add(t));

  const tags = Array.from(tagCandidates).slice(0, 10);

  const headline = `${persona.name} · ${persona.code}`;
  const mbtiTypes = persona.mbtiTypes || [];

  return { persona, headline, tags, paragraphs, features, mbtiTypes };
}

// 推荐列表
async function fetchRecommendationsFromPicks(picks) {
  const excludeIds = new Set(picks.map((m) => m.id));
  const combined = [];

  if (!OMDB_KEY) {
    return mockMovies.filter((m) => !excludeIds.has(m.id)).slice(0, 9);
  }

  for (const movie of picks) {
    const params = new URLSearchParams({
      apikey: OMDB_KEY,
      s: movie.title,
      type: "movie",
      page: "1",
    });

    try {
      const res = await fetch(`${OMDB_BASE}?${params.toString()}`);
      const data = await res.json();
      if (data.Response === "False" || !data.Search) continue;

      data.Search.forEach((item) => {
        if (excludeIds.has(item.imdbID)) return;
        const mapped = mapSearchItemToMovie(item);
        excludeIds.add(mapped.id);
        combined.push(mapped);
      });
    } catch (e) {
      console.error(e);
    }
  }

  let result = combined;
  const withPoster = combined.filter((m) => !!m.poster);
  if (withPoster.length >= 6) result = withPoster;

  if (result.length < 6) {
    const extra = mockMovies.filter((m) => !excludeIds.has(m.id));
    result = [...result, ...extra];
  }

  return result.slice(0, 9);
}

// ====================== React 组件主体 ======================
function App() {
  const [view, setView] = useState("home"); // "home" | "test"

  const [query, setQuery] = useState("");
  const [uiState, setUiState] = useState("idle"); // idle | searching | choosing | profiling | ready
  const [step, setStep] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [picks, setPicks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [currentInputLabel, setCurrentInputLabel] = useState("");

  const remaining = Math.max(0, 3 - step);

  async function handleSearch(e) {
    e?.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setError("");
    setUiState("searching");
    setCurrentInputLabel(trimmed);

    try {
      const results = await searchMoviesByTitle(trimmed);
      setSearchResults(results);
      setUiState("choosing");
    } catch (err) {
      console.error(err);
      setError("搜索时出了点问题，已切换到离线模式。");
      setSearchResults(mockMovies.slice(0, 8));
      setUiState("choosing");
    }
  }

  async function handlePick(movie) {
    try {
      setUiState("profiling");
      const detailed = await fetchMovieDetailById(movie.id);
      const usedMovie = detailed || movie;

      const newPicks = [...picks, usedMovie];
      setPicks(newPicks);

      const nextStep = step + 1;
      setStep(nextStep);
      setSearchResults([]);
      setQuery("");

      if (nextStep >= 3) {
        const builtProfile = buildTasteProfile(newPicks);
        setProfile(builtProfile);
        const recs = await fetchRecommendationsFromPicks(newPicks);
        setRecommendations(recs);
        setUiState("ready");
      } else {
        setUiState("idle");
      }
    } catch (err) {
      console.error(err);
      setError("获取电影详情时出现问题，已使用基础信息。");

      const newPicks = [...picks, movie];
      setPicks(newPicks);

      const nextStep = step + 1;
      setStep(nextStep);
      setSearchResults([]);
      setQuery("");

      if (nextStep >= 3) {
        const builtProfile = buildTasteProfile(newPicks);
        setProfile(builtProfile);
        const recs = await fetchRecommendationsFromPicks(newPicks);
        setRecommendations(recs);
        setUiState("ready");
      } else {
        setUiState("idle");
      }
    }
  }

  function handleReset() {
    setQuery("");
    setUiState("idle");
    setStep(0);
    setSearchResults([]);
    setPicks([]);
    setProfile(null);
    setRecommendations([]);
    setError("");
    setCurrentInputLabel("");
  }

  const personaPreview = PERSONAS;

  function goTest() {
    setView("test");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goHome() {
    setView("home");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      {/* 背景 */}
      <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 -z-40 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[length:100px_100px]" />
      <div className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute -top-28 left-[-10%] h-80 w-80 rounded-full bg-fuchsia-500/25 blur-[120px]" />
        <div className="absolute top-16 right-[-10%] h-72 w-72 rounded-full bg-sky-400/25 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-1/3 h-80 w-80 rounded-full bg-emerald-400/20 blur-[120px]" />
      </div>

      {/* 顶部导航 */}
      <header className="flex items-center justify-between px-5 md:px-10 py-4 md:py-6">
        <div className="flex items-center gap-2">
          <span className="h-7 w-7 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 via-sky-400 to-emerald-300 text-xs shadow-lg shadow-fuchsia-500/40">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-serif tracking-[0.28em] uppercase text-xs md:text-sm">
            CineEcho
          </span>
        </div>

        <div className="flex items-center gap-3 text-[0.7rem] md:text-xs text-slate-400">
          {view === "test" && (
            <button
              onClick={goHome}
              className="rounded-full border border-white/20 bg-slate-900/70 px-3 py-1.5 tracking-[0.2em] uppercase hover:border-emerald-300 hover:text-emerald-200 transition"
            >
              人格图鉴
            </button>
          )}
          <button
            onClick={goTest}
            className="rounded-full bg-gradient-to-r from-fuchsia-500 via-sky-400 to-emerald-400 text-slate-950 px-4 py-1.5 tracking-[0.2em] uppercase shadow-lg shadow-fuchsia-500/40 hover:brightness-110 transition"
          >
            测试我的人格
          </button>
          <button
            onClick={handleReset}
            className="rounded-full border border-white/15 bg-slate-900/70 px-3 py-1.5 tracking-[0.2em] uppercase hover:border-fuchsia-400/80 hover:text-fuchsia-200 transition"
          >
            Reset
          </button>
        </div>
      </header>

      <main className="px-4 md:px-10 pb-14">
        {/* ===================== 首页：人格图鉴 ===================== */}
        {view === "home" && (
          <>
            {/* 首页 hero */}
            <section className="max-w-4xl mx-auto pt-8 md:pt-12 text-center">
              <p className="text-[0.7rem] md:text-xs uppercase tracking-[0.3em] text-slate-400">
                CineEcho · 16 型观影人格图鉴
              </p>
              <h1 className="mt-3 md:mt-4 text-3xl md:text-5xl font-serif tracking-wide">
                找到最像你的{" "}
                <span className="bg-gradient-to-r from-emerald-300 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
                  观影人格
                </span>
              </h1>
              <p className="mt-4 text-sm md:text-base text-slate-300 max-w-xl mx-auto">
                每一种观影人格都是一张“电影世界的门票”。先逛一圈 16
                型人格海报，看看哪几张最戳中你，然后点击
                <span className="font-semibold">「测试我的人格」</span>
                ，用三部电影给自己做一份专属报告。
              </p>
              <button
                onClick={goTest}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 via-sky-400 to-emerald-300 px-6 py-2.5 text-xs md:text-sm tracking-[0.24em] uppercase text-slate-950 shadow-xl shadow-fuchsia-500/40 hover:brightness-110 transition"
              >
                立即开始测试
              </button>
            </section>

            {/* 人格图鉴 */}
            <section className="max-w-6xl mx-auto mt-10">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-sm md:text-base tracking-[0.22em] uppercase text-slate-300">
                  全部 16 型观影人格海报
                </h2>
                <p className="text-[0.7rem] text-slate-400 max-w-xs text-right">
                  这些是预设的人格模板，你的测试结果会从中选出最贴近的一种，并生成详细报告。
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                {personaPreview.map((persona) => (
                  <div
                    key={persona.id}
                    className="relative overflow-hidden rounded-3xl bg-slate-50/95 text-slate-900 border border-emerald-200/60 shadow-[0_14px_40px_rgba(15,23,42,0.35)]"
                  >
                    {/* 顶部标题区 */}
                    <div className="px-3.5 pt-3.5">
                      <p className="text-[0.7rem] font-semibold tracking-[0.24em] text-emerald-700">
                        CINEECHO 观影人格
                      </p>
                      <div className="flex items-baseline justify-between mt-1">
                        <span className="text-xs text-emerald-800 font-medium">
                          {persona.name}
                        </span>
                        <span className="text-sm font-extrabold text-emerald-700">
                          {persona.code}
                        </span>
                      </div>
                      {persona.mbtiTypes && (
                        <p className="mt-1 text-[0.65rem] text-emerald-600">
                          MBTI：{persona.mbtiTypes.join(" / ")}
                        </p>
                      )}
                    </div>

                    {/* 海报人物 */}
                    <div className="mt-3 px-3.5">
                      <div className="relative rounded-2xl bg-emerald-50 overflow-hidden border border-emerald-100 h-40">
                        <img
                          src={persona.avatarImage}
                          alt={persona.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-200/60 via-emerald-100/10 to-transparent mix-blend-multiply pointer-events-none" />
                      </div>
                    </div>

                    {/* 关键词 */}
                    <div className="px-3.5 pb-3.5 pt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {persona.traits?.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[0.7rem] text-emerald-700"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <p className="mt-3 text-[0.7rem] leading-relaxed text-emerald-800 line-clamp-3">
                        {persona.tagline}
                      </p>
                      <p className="mt-2 text-[0.6rem] text-emerald-500 text-right">
                        * 详细说明将在测试结果中展开。
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ===================== 测试视图：选电影 + 结果 ===================== */}
        {view === "test" && (
          <>
            {/* 测试 hero + 搜索 */}
            <section className="max-w-4xl mx-auto pt-6 md:pt-10 text-center">
              <p className="text-[0.7rem] md:text-xs uppercase tracking-[0.3em] text-slate-400">
                Step {Math.min(step + 1, 3)} of 3 · 选出 3 部代表你气质的电影
              </p>
              <h1 className="mt-3 md:mt-4 text-3xl md:text-5xl font-serif tracking-wide">
                用{" "}
                <span className="bg-gradient-to-r from-fuchsia-400 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                  三部电影
                </span>{" "}
                定义你的观影人格
              </h1>
              <p className="mt-4 text-sm md:text-base text-slate-300 max-w-xl mx-auto">
                输入任意一部你最近喜欢的电影（支持中文片名），我们会给你候选列表；
                三次选择完成后，CineEcho 会为你生成一份观影人格报告，并配上一张虚拟形象海报和 MBTI 参考。
              </p>

              {/* 进度条 */}
              <div className="mt-5 flex items-center justify-center gap-3">
                {[0, 1, 2].map((i) => {
                  const active = i <= step - 1;
                  const current = i === step;
                  return (
                    <div
                      key={i}
                      className={`relative flex items-center gap-2 ${
                        i < 2 ? "w-24" : "w-6"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                          active
                            ? "border-emerald-300 bg-emerald-300/20"
                            : current
                            ? "border-fuchsia-300 bg-fuchsia-300/10"
                            : "border-slate-700 bg-slate-900/80"
                        }`}
                      >
                        {active ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                        ) : (
                          <span className="text-[0.65rem] text-slate-300">
                            {i + 1}
                          </span>
                        )}
                      </div>
                      {i < 2 && (
                        <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-700 via-slate-500/60 to-slate-700" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 搜索输入 */}
              <motion.form
                onSubmit={handleSearch}
                className="group relative mx-auto mt-7 max-w-2xl"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 blur-3xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 bg-gradient-to-r from-fuchsia-500/30 via-sky-400/30 to-emerald-400/30 -z-10" />
                <div className="relative flex items-center gap-3 rounded-full bg-slate-900/80 border border-white/10 shadow-2xl shadow-black/70 px-4 md:px-6 py-3 md:py-4 backdrop-blur-xl">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-amber-300 text-slate-950 shadow-lg shadow-fuchsia-500/50 flex-shrink-0">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      remaining === 3
                        ? "第一部：最“像你”的电影（中文 / 英文都可以）..."
                        : remaining === 2
                        ? "第二部：最近反复想起的一部电影..."
                        : "最后一部：补上一块你口味版图中还缺的那块..."
                    }
                    className="w-full bg-transparent text-sm md:text-base placeholder:text-slate-400 text-center md:text-left focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="inline-flex text-[0.7rem] tracking-[0.22em] uppercase rounded-full bg-gradient-to-r from-fuchsia-500 via-sky-400 to-emerald-400 text-slate-950 px-4 py-2 shadow-lg shadow-fuchsia-500/30 hover:brightness-110 transition"
                  >
                    查找候选
                  </button>
                </div>
                <p className="mt-3 text-[0.7rem] tracking-[0.18em] uppercase text-slate-400">
                  还需要选择 {remaining} 部 · 可试试 “无间道”、“霸王别姬”、“让子弹飞”、“重庆森林”、“Her”、“Drive”…
                </p>
              </motion.form>

              {/* 状态提示 */}
              <section className="max-w-4xl mx-auto mt-4">
                <AnimatePresence mode="wait">
                  {uiState === "searching" && (
                    <motion.div
                      key="searching"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center justify-centergap-3 text-xs md:text-sm text-slate-300"
                    >
                      <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-ping" />
                      <span className="tracking-[0.18em] uppercase">
                        正在为「{currentInputLabel}」寻找匹配的影片气泡...
                      </span>
                    </motion.div>
                  )}

                  {uiState === "idle" && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-center text-xs md:text-sm text-slate-400"
                    >
                      提交后我们会先给出一批候选电影，你只需要点选<strong>最接近你心里的那一部</strong>。
                    </motion.div>
                  )}

                  {uiState === "ready" && profile && (
                    <motion.div
                      key="ready"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="text-center text-xs md:text-sm text-emerald-300"
                    >
                      已根据你的三次选择生成观影人格，并为你定制了一份播放清单。
                    </motion.div>
                  )}

                  {error && uiState !== "searching" && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-1 text-center text-xs md:text-sm text-rose-300"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>
            </section>

            {/* 已选择电影预览 */}
            <section className="max-w-6xl mx-auto mt-8 md:mt-10">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="text-sm md:text-base tracking-[0.22em] uppercase text-slate-300">
                  你的 Vibe 板
                </h2>
                <span className="text-[0.7rem] text-slate-400">
                  已选 {picks.length}/3
                </span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {picks.map((movie) => (
                  <div
                    key={movie.id}
                    className="relative flex-shrink-0 w-40 md:w-48 rounded-2xl bg-slate-900/80 border border-emerald-300/40 shadow-lg shadow-emerald-500/30 overflow-hidden"
                  >
                    <div className="relative h-52 overflow-hidden">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-fuchsia-500/40 via-sky-400/40 to-emerald-400/40" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent" />
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs text-slate-400 uppercase tracking-[0.18em]">
                        Selected
                      </p>
                      <h3 className="mt-1 text-sm font-serif">
                        {movie.title}
                      </h3>
                      {movie.year && (
                        <p className="text-[0.7rem] text-slate-500">
                          {movie.year}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {picks.length < 3 && (
                  <div className="flex-shrink-0 w-40 md:w-48 rounded-2xl border border-dashed border-slate-500/70 bg-slate-900/40 flex flex-col items-center justify-center text-center px-4">
                    <p className="text-xs text-slate-400 mb-1">
                      还差 {3 - picks.length} 部
                    </p>
                    <p className="text-[0.7rem] text-slate-500">
                      想象一下：如果把你的人生剪成电影，这部会出现在片头还是结尾？
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 候选列表 */}
            {uiState === "choosing" && searchResults.length > 0 && (
              <section className="max-w-6xl mx-auto mt-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm md:text-base tracking-[0.22em] uppercase text-slate-300">
                    为「{currentInputLabel}」找到的候选
                  </h2>
                  <p className="text-[0.7rem] text-slate-400">
                    点击<strong>最接近你心中那一部</strong> · 当前是第{" "}
                    {step + 1}/3 次选择
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
                  <AnimatePresence>
                    {searchResults.map((movie, index) => (
                      <motion.button
                        type="button"
                        key={movie.id}
                        onClick={() => handlePick(movie)}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -18 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative text-left overflow-hidden rounded-2xl bg-slate-900/80 border border-white/10 shadow-2xl shadow-black/70 hover:border-fuchsia-400/70 hover:shadow-fuchsia-500/30 transition-transform duration-300 hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/70"
                      >
                        <div className="relative h-64 overflow-hidden">
                          {movie.poster ? (
                            <img
                              src={movie.poster}
                              alt={movie.title}
                              className="h-full w-full object-cover transform group-hover:scale-[1.04] transition-transform duration-500"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-fuchsia-500/40 via-sky-400/40 to-emerald-400/40" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent opacity-80" />
                          <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-slate-200">
                            <span className="h-2 w-2 rounded-full bg-gradient-to-br from-fuchsia-400 to-emerald-400" />
                            Pick this
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-base md:text-lg font-serif">
                              {movie.title}
                            </h3>
                            {movie.year && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                {movie.year}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="p-3.5 md:p-4">
                          <p className="text-[0.7rem] text-slate-300">
                            点击后，这部电影会被加入你的 Vibe 板，用来分析你的观影口味。
                          </p>
                          {movie.link && (
                            <p className="mt-2 text-[0.7rem] text-slate-500">
                              IMDb:
                              <span className="underline underline-offset-2 decoration-dotted ml-1">
                                {movie.link}
                              </span>
                            </p>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* 结果：人格 + 推荐 + 分享卡片 */}
            {uiState === "ready" && profile && (
              <>
                {/* 人格卡片 + 推荐列表 */}
                <section className="max-w-6xl mx-auto mt-12 space-y-8 md:space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
                    {/* 人格卡片 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="lg:col-span-1 rounded-3xl bg-slate-900/90 border border-emerald-300/40 shadow-xl shadow-emerald-500/30 overflow-hidden flex flex-col"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={profile.persona.avatarImage}
                          alt={profile.persona.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                          <p className="text-[0.65rem] uppercase tracking-[0.26em] text-emerald-300">
                            CineEcho Persona
                          </p>
                          <h2 className="text-xl md:text-2xl font-serif">
                            {profile.persona.name}
                          </h2>
                          <p className="text-xs text-slate-300 mt-1">
                            {profile.persona.code}
                          </p>
                          {profile.mbtiTypes && profile.mbtiTypes.length > 0 && (
                            <p className="text-xs text-emerald-200 mt-1">
                              可能接近的 MBTI：
                              {profile.mbtiTypes.join(" / ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[0.7rem] uppercase tracking-[0.26em] text-emerald-300">
                            Taste Profile
                          </p>
                          <h3 className="mt-2 text-sm md:text-base text-slate-200">
                            {profile.persona.tagline}
                          </h3>
                          {profile.persona.traits && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {profile.persona.traits.map((t) => (
                                <span
                                  key={t}
                                  className="px-2.5 py-1 rounded-full bg-slate-900/90 text-[0.65rem] text-emerald-200 border border-emerald-300/50"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-4 space-y-3 text-sm text-slate-200">
                            {profile.paragraphs.map((p, idx) => (
                              <p key={idx}>{p}</p>
                            ))}
                          </div>
                        </div>
                        {profile.tags && profile.tags.length > 0 && (
                          <div className="mt-5 flex flex-wrap gap-2">
                            {profile.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[0.65rem] uppercase tracking-[0.18em] px-3 py-1 rounded-full bg-slate-950/90 border border-emerald-300/60 text-emerald-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* 推荐列表 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="lg:col-span-2 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl shadow-black/60 p-5 md:p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm md:text-base tracking-[0.22em] uppercase text-slate-300">
                          为你精选的播放清单
                        </h2>
                        <span className="text-[0.7rem] text-slate-400">
                          根据你的 3 部心头好自动生成 · 海报与链接来自 IMDb / OMDb
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {recommendations.map((movie, index) => (
                          <motion.article
                            key={movie.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative overflow-hidden rounded-2xl bg-slate-950/70 border border-white/10 shadow-xl shadow-black/70 hover:border-sky-400/70 hover:shadow-sky-500/40 transition-transform duration-300 hover:-translate-y-2"
                          >
                            <div className="relative h-56 overflow-hidden">
                              {movie.poster ? (
                                <img
                                  src={movie.poster}
                                  alt={movie.title}
                                  className="h-full w-full object-cover transform group-hover:scale-[1.04] transition-transform duration-500"
                                />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-br from-fuchsia-500/40 via-sky-400/40 to-emerald-400/40" />
                              )}
                              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-transparent" />
                              <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-slate-950/70 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-slate-200">
                                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                                Vibe Match
                              </div>
                            </div>
                            <div className="p-3.5 md:p-4">
                              <h3 className="font-serif tracking-wide text-base md:text-lg">
                                {movie.title}
                              </h3>
                              {movie.year && (
                                <p className="mt-1 text-xs text-slate-400">
                                  {movie.year}
                                </p>
                              )}
                              <div className="mt-3 flex flex-wrap gap-2">
                                {(movie.tags && movie.tags.length
                                  ? movie.tags
                                  : ["Curated", "Mood-Adjacent", "Cinematic"]
                                ).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[0.65rem] uppercase tracking-[0.18em] px-2.5 py-1 rounded-full bg-slate-900/70 border border-white/10 text-slate-200"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              {movie.link && (
                                <a
                                  href={movie.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="mt-3 inline-flex text-[0.7rem] tracking-[0.18em] uppercase text-sky-300 hover:text-fuchsia-300"
                                >
                                  Open on IMDb →
                                </a>
                              )}
                            </div>
                          </motion.article>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </section>

                {/* 分享卡片：适合截图发给朋友 */}
                <section className="max-w-3xl mx-auto mt-10">
                  <motion.div
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="relative overflow-hidden rounded-[2rem] bg-slate-50 text-slate-900 px-6 py-6 md:px-8 md:py-8 shadow-[0_18px_60px_rgba(15,23,42,0.7)]"
                  >
                    <div
                      className={`pointer-events-none absolute -top-8 -right-10 h-40 w-40 rounded-full bg-gradient-to-br ${
                        profile.persona.accentFrom || "from-emerald-400"
                      } ${profile.persona.accentTo || "to-sky-400"} opacity-70 blur-3xl`}
                    />
                    <div className="pointer-events-none absolute -bottom-10 left-[-10%] h-40 w-40 rounded-full bg-gradient-to-br from-sky-300 to-emerald-300 opacity-50 blur-3xl" />

                    <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
                      {/* 左侧：人格信息 */}
                      <div className="md:col-span-3 flex flex-col justify-between">
                        <div>
                          <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                            CineEcho · Vibe Persona
                          </p>
                          <h2 className="mt-2 text-2xl md:text-3xl font-serif">
                            {profile.persona.name}
                          </h2>
                          <p className="mt-1 text-sm text-slate-600">
                            观影人格代码：{profile.persona.code}
                          </p>
                          {profile.mbtiTypes && profile.mbtiTypes.length > 0 && (
                            <p className="mt-1 text-sm text-emerald-700">
                              可能接近的 MBTI：
                              {profile.mbtiTypes.join(" / ")}
                            </p>
                          )}

                          {profile.persona.traits && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {profile.persona.traits.map((t) => (
                                <span
                                  key={t}
                                  className="px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-[0.75rem]"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="mt-4 text-sm leading-relaxed text-slate-700">
                            {profile.persona.tagline}
                          </p>
                        </div>

                        <p className="mt-6 text-[0.7rem] text-slate-500">
                          * 截图这张卡片，发给朋友看看 TA 眼中的你是否也是这种观影人格。
                        </p>
                      </div>

                      {/* 右侧：三部电影 */}
                      <div className="md:col-span-2">
                        <div className="rounded-2xl bg-white/85 border border-slate-200/80 px-3.5 py-3.5 md:px-4 md:py-4">
                          <p className="text-[0.7rem] uppercase tracking-[0.26em] text-slate-500">
                            三部定义我的电影
                          </p>
                          <div className="mt-3 space-y-3">
                            {picks.slice(0, 3).map((movie) => (
                              <div
                                key={movie.id}
                                className="flex items-center gap-3"
                              >
                                <div className="h-14 w-10 rounded-md overflow-hidden bg-slate-200 flex-shrink-0">
                                  {movie.poster ? (
                                    <img
                                      src={movie.poster}
                                      alt={movie.title}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-gradient-to-br from-sky-300 to-emerald-300" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs font-medium line-clamp-2">
                                    {movie.title}
                                  </p>
                                  {movie.year && (
                                    <p className="text-[0.7rem] text-slate-500">
                                      {movie.year}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <p className="mt-4 text-[0.7rem] text-slate-500">
                            来自{" "}
                            <span className="font-semibold tracking-[0.16em] uppercase">
                              CineEcho
                            </span>{" "}
                            · 三部电影看透你的观影气质。
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </section>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
