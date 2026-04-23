function parseFrontMatter(text) {
  const lines = text.split(/\r?\n/);
  if (lines[0] !== "---") return { frontMatter: {}, body: text };
  const fm = {};
  let i = 1;
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (line === "---") {
      i++;
      break;
    }
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    fm[key] = value;
  }
  return { frontMatter: fm, body: lines.slice(i).join("\n") };
}

const imageAssets = require.context("../images", true, /\.(png|jpe?g|gif|svg)$/);

function resolveImage(src) {
  if (!src) return "";
  const normalized = src.replace(/^\.?\//, "");
  const key = normalized.startsWith("images/")
    ? normalized.slice("images/".length)
    : normalized;
  try {
    const mod = imageAssets(`./${key}`);
    if (typeof mod === "string") return mod;
    if (mod && typeof mod.default === "string") return mod.default;
    return mod;
  } catch {
    return src;
  }
}

function splitBlocks(body) {
  const lines = body.split(/\r?\n/);
  const blocks = [];
  let current = [];
  for (const line of lines) {
    if (line.trim() === "" && current.length) {
      blocks.push(current.join("\n").trim());
      current = [];
      continue;
    }
    current.push(line);
  }
  if (current.length) blocks.push(current.join("\n").trim());
  return blocks;
}

function parseKeyValueBlock(block) {
  const obj = {};
  const lines = block.split(/\r?\n/);
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    obj[key] = value;
  }
  return obj;
}

function parseContentMarkdown(text) {
  const { frontMatter, body } = parseFrontMatter(text);
  const blocks = splitBlocks(body);

  const state = {
    frontMatter,
    one: { greeting: "", intro: "" },
    two: { title: "", subtitle: "", items: [] },
    three: { title: "", items: [] },
    four: { title: "", items: [], more_title: "", more: [] }
  };

  let currentSection = null;
  let pendingText = [];

  function flushPendingText() {
    const value = pendingText.join("\n").trim();
    pendingText = [];
    return value;
  }

  for (const block of blocks) {
    if (block === "# One") {
      currentSection = "one";
      continue;
    }
    if (block === "# Two") {
      currentSection = "two";
      continue;
    }
    if (block === "# Three") {
      currentSection = "three";
      continue;
    }
    if (block === "# Four") {
      currentSection = "four";
      continue;
    }

    if (!currentSection) continue;

    if (currentSection === "one") {
      const kv = parseKeyValueBlock(block);
      if (kv.greeting) state.one.greeting = kv.greeting;
      if (kv.greeting) {
        const restLines = block
          .split(/\r?\n/)
          .slice(1)
          .join("\n")
          .trim();
        if (restLines) state.one.intro = restLines;
      } else {
        state.one.intro = block;
      }
      continue;
    }

    if (currentSection === "two" || currentSection === "three" || currentSection === "four") {
      if (block.startsWith("title:")) {
        const kv = parseKeyValueBlock(block);
        state[currentSection].title = kv.title || state[currentSection].title;
        if (kv.subtitle && currentSection === "two") state.two.subtitle = kv.subtitle;
        continue;
      }

      if (currentSection === "four" && block.startsWith("more_title:")) {
        const kv = parseKeyValueBlock(block);
        state.four.more_title = kv.more_title || "";
        continue;
      }

      if (block.startsWith("## Item")) {
        const desc = flushPendingText();
        if (desc && state[currentSection].items.length) {
          state[currentSection].items[state[currentSection].items.length - 1].desc = desc;
        }
        const lines = block.split(/\r?\n/);
        state[currentSection].items.push({ name: "", url: "", image: "", desc: "" });
        const meta = parseKeyValueBlock(lines.slice(1).join("\n"));
        const item = state[currentSection].items[state[currentSection].items.length - 1];
        if (meta.name) item.name = meta.name;
        if (meta.url) item.url = meta.url;
        if (meta.image) item.image = meta.image;
        continue;
      }

      if (block.startsWith("- ") && currentSection === "four") {
        const lines = block.split(/\r?\n/);
        for (const l of lines) {
          const line = l.replace(/^\-\s*/, "");
          const parts = line.split("|").map(s => s.trim());
          if (parts.length >= 3) {
            state.four.more.push({ date: parts[0], title: parts[1], url: parts.slice(2).join(" | ") });
          }
        }
        continue;
      }

      const kv = parseKeyValueBlock(block);
      const hasMeta = kv.name || kv.url || kv.image;
      if (hasMeta && state[currentSection].items.length) {
        const item = state[currentSection].items[state[currentSection].items.length - 1];
        if (kv.name) item.name = kv.name;
        if (kv.url) item.url = kv.url;
        if (kv.image) item.image = kv.image;

        const rest = block
          .split(/\r?\n/)
          .filter(line => line.indexOf(":") === -1)
          .join("\n")
          .trim();
        if (rest) pendingText.push(rest);
        continue;
      }

      pendingText.push(block);
      continue;
    }
  }

  const tail = flushPendingText();
  if (tail) {
    const sec = currentSection;
    if (sec && state[sec] && state[sec].items && state[sec].items.length) {
      state[sec].items[state[sec].items.length - 1].desc = tail;
    }
  }

  for (const sec of ["two", "three", "four"]) {
    for (const item of state[sec].items) {
      item.name = item.name || "";
      item.url = item.url || "";
      item.image = item.image || "";
      item.desc = (item.desc || "").trim();
    }
  }

  return state;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value || "";
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = html || "";
}

function setLink(id, href) {
  const el = document.getElementById(id);
  if (!el) return;
  if (href) {
    el.setAttribute("href", href);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  } else {
    el.removeAttribute("href");
  }
}

function createInlineContent(text) {
  const frag = document.createDocumentFragment();
  const parts = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push({ type: "text", value: text.slice(last, m.index) });
    parts.push({ type: "link", label: m[1], href: m[2] });
    last = re.lastIndex;
  }
  if (last < text.length) parts.push({ type: "text", value: text.slice(last) });

  for (const p of parts) {
    if (p.type === "text") {
      frag.appendChild(document.createTextNode(p.value));
    } else {
      const a = document.createElement("a");
      a.textContent = p.label;
      a.href = p.href;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      frag.appendChild(a);
    }
  }
  return frag;
}

function setParagraph(el, text) {
  el.textContent = "";
  const lines = (text || "").split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    el.appendChild(createInlineContent(lines[i]));
    if (i < lines.length - 1) el.appendChild(document.createElement("br"));
  }
}

function renderNav(navString) {
  const ul = document.getElementById("content-nav");
  if (!ul) return;
  ul.textContent = "";
  const items = (navString || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => {
      const [label, id] = s.split("|").map(x => x.trim());
      return { label, id };
    })
    .filter(x => x.label && x.id);

  for (const item of items) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = `#${item.id}`;
    a.textContent = item.label;
    li.appendChild(a);
    ul.appendChild(li);
  }
}

function createWorkItem({ name, url, image, desc }, opts = {}) {
  const article = document.createElement("article");
  article.className = opts.className || "col-12 col-12-xsmall work-item";

  const a = document.createElement("a");
  a.className = opts.linkClassName || "image fit thumb";
  if (url) {
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }

  const img = document.createElement("img");
  img.alt = name || "";
  if (image) img.src = resolveImage(image);
  a.appendChild(img);
  if (url && (name || "").trim()) a.setAttribute("aria-label", name.trim());

  const h3 = document.createElement("h3");
  h3.textContent = name || "";

  const p = document.createElement("p");
  setParagraph(p, desc || "");

  article.appendChild(a);
  article.appendChild(h3);
  if ((desc || "").trim()) article.appendChild(p);

  return article;
}

function renderSectionItems(containerId, items, getOpts) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.textContent = "";
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const opts = typeof getOpts === "function" ? getOpts(item, i) : getOpts;
    container.appendChild(createWorkItem(item, opts));
  }
}

function renderMoreTable(tableId, more) {
  const table = document.getElementById(tableId);
  if (!table) return;
  table.textContent = "";
  for (const row of more) {
    const tr = document.createElement("tr");
    const tdDate = document.createElement("td");
    tdDate.className = "date";
    tdDate.textContent = row.date || "";
    const tdWork = document.createElement("td");
    tdWork.className = "work";
    const a = document.createElement("a");
    a.href = row.url || "#";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = row.title || "";
    tdWork.appendChild(a);
    tr.appendChild(tdDate);
    tr.appendChild(tdWork);
    table.appendChild(tr);
  }
}

export function applyContentToPage(data) {
  const fm = data.frontMatter || {};

  setText("content-title", fm.title);
  setText("content-name", fm.name);
  setText("content-role", fm.role);
  renderNav(fm.nav);

  const avatar = document.getElementById("content-avatar");
  if (avatar && fm.avatar) avatar.src = resolveImage(fm.avatar);

  setText("one-greeting", data.one.greeting);
  const intro = document.getElementById("one-intro");
  if (intro) setParagraph(intro, data.one.intro);

  setLink("one-resume", fm.resume_url);

  setText("two-title", data.two.title);
  const twoSubtitle = document.getElementById("two-subtitle");
  if (twoSubtitle) setParagraph(twoSubtitle, data.two.subtitle);
  renderSectionItems("two-items", data.two.items, (_item, index) => ({
    className:
      index < 2 ? "col-12 col-12-xsmall work-item" : "col-6 col-12-xsmall work-item"
  }));

  setText("three-title", data.three.title);
  renderSectionItems("three-items", data.three.items, () => ({
    className: "col-12 col-12-xsmall work-item"
  }));

  setText("four-title", data.four.title);
  renderSectionItems("four-items", data.four.items, () => ({
    className: "col-12 col-12-xsmall work-item"
  }));
  setText("four-more-title", data.four.more_title);
  renderMoreTable("four-more-table", data.four.more);

  setLink("social-github", fm.github_url);
  setLink("social-pinterest", fm.pinterest_url);

  const wechatImg = document.getElementById("wechat-image");
  if (wechatImg && fm.wechat_image) wechatImg.src = resolveImage(fm.wechat_image);
}

export function loadAndApplyContent(contentUrl) {
  return fetch(contentUrl, { cache: "no-store" })
    .then(res => res.text())
    .then(text => {
      const data = parseContentMarkdown(text);
      applyContentToPage(data);
      return data;
    });
}
