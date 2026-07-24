const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const BLOG_SRC = __dirname;
const OUT_DIR = path.resolve(__dirname, '..', 'src', 'blog');
const TEMPLATE_GUIDE = 'template-guide.md';

// ─── helpers ───

function slug(name) {
  return name.replace(/\.md$/, '').replace(/[\s]+/g, '-').toLowerCase();
}

// convert **bold** in plain text
function renderInline(html) {
  return html
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

// ─── front matter parser ───

function parseFrontMatter(raw) {
  var m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { meta: {}, body: raw };
  var yaml = m[1];
  var body = raw.slice(m[0].length);
  var meta = {};
  yaml.split('\n').forEach(function (line) {
    var kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) {
      var val = kv[2].trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        meta[kv[1]] = val.slice(1, -1).split(',').map(function (s) { return s.trim().replace(/^['"]|['"]$/g, ''); });
      } else if (val.startsWith('"') && val.endsWith('"')) {
        meta[kv[1]] = val.slice(1, -1);
      } else {
        meta[kv[1]] = val;
      }
    }
  });
  if (meta.tags && typeof meta.tags === 'string') {
    meta.tags = meta.tags.split(',').map(function (s) { return s.trim(); });
  }
  return { meta: meta, body: body };
}

// ─── pre-process custom blocks ───

function preProcess(body) {
  // formula $$ ... $$ -> <div class="formula-box">
  body = body.replace(/\$\$([\s\S]*?)\$\$/g, function (_, expr) {
    return '<div class="formula-box">' + expr.trim() + '</div>';
  });

  // insight / conclusion: render inner markdown inline
  body = body.replace(/>\s*\[!INSIGHT\]\s*\n([\s\S]*?)(?=\n\n|\n(?!#|---)|$)/g, function (_, content) {
    var inner = content.replace(/^>\s*/gm, '').trim();
    inner = renderInline(inner);
    return '<div class="insight">' + inner + '</div>\n\n';
  });
  body = body.replace(/>\s*\[!CONCLUSION\]\s*\n([\s\S]*?)(?=\n\n|\n(?!#|---)|$)/g, function (_, content) {
    var inner = content.replace(/^>\s*/gm, '').trim();
    inner = renderInline(inner);
    return '<div class="conclusion">' + inner + '</div>\n\n';
  });

  // section labels
  body = body.replace(/<!--\s*label:\s*(.+?)\s*-->/g, function (_, label) {
    return '<div class="section-label">' + label.trim() + '</div>\n';
  });

  // project card
  body = body.replace(/<!--\s*project-card\s*\n([\s\S]*?)-->/g, function (_, attrs) {
    var props = {};
    attrs.split('\n').forEach(function (line) {
      var kv = line.match(/^(\w+):\s*(.+)$/);
      if (kv) props[kv[1]] = kv[2].trim();
    });
    return '\n<a class="project-card" href="' + (props.url || '#') + '">\n' +
      (props.label ? '  <div class="pc-label">' + props.label + '</div>\n' : '') +
      '  <div class="pc-title">' + (props.title || '') + '</div>\n' +
      '  <div class="pc-desc">' + (props.description || '') + '</div>\n' +
      '  <span class="pc-arrow">查看项目 →</span>\n' +
      '</a>\n';
  });

  return body;
}

// ─── custom marked renderer ───

function headingId(text) {
  return text
    .replace(/^\d+\s*/, '')        // remove leading "01 "
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

var renderer = {
  heading: function (token) {
    var text = token.text;
    var depth = token.depth;
    var id = headingId(text);
    return '<h' + depth + ' id="' + id + '">' + text + '</h' + depth + '>\n';
  },
  link: function (token) {
    var href = typeof token === 'string' ? token : token.href;
    var text = typeof token === 'string' ? token : token.text;
    var target = href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<a href="' + href + '"' + target + '>' + text + '</a>';
  }
};

marked.use({ renderer: renderer });

// ─── post-process HTML ───

function postProcess(html) {
  // wrap tables with responsive container
  // avoid double-wrapping
  html = html.replace(/<table(?!\s+class="compare-desktop")([^>]*)>/g,
    '<div class="table-wrap visual-wide"><div class="scroll-hint">← 左右滑动 →</div><table class="compare-desktop"$1>');
  html = html.replace(/<\/table>(?!\s*<\/div>)/g, '</table></div>');

  // add newline before h2 for spacing
  html = html.replace(/(<\/div>)\s*(<h2)/g, '$1\n$2');

  return html;
}

// ─── TOC ───

function extractTOC(html) {
  var skip = ['参考与延伸阅读', '相关项目', '相关文章'];
  var toc = [];
  var re = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/g;
  var m;
  while ((m = re.exec(html)) !== null) {
    var text = m[2].replace(/<[^>]+>/g, '');
    if (skip.indexOf(text) === -1) {
      toc.push({ id: m[1], text: text });
    }
  }
  return toc;
}

function renderTOC(toc) {
  if (!toc.length) return '';
  var items = toc.map(function (t) {
    return '      <li><a href="#' + t.id + '">' + t.text + '</a></li>';
  }).join('\n');
  return '  <nav class="toc-sidebar">\n' +
    '    <div class="toc-title">本文目录</div>\n' +
    '    <ul class="toc-list">\n' + items + '\n' +
    '    </ul>\n  </nav>';
}

// ─── HTML template ───

function template(meta, bodyHtml, tocHtml) {
  var title = meta.title || 'Blog';
  var tags = meta.tags || [];
  var tagHtml = tags.map(function (t) {
    return '<span class="tag">' + t + '</span>';
  }).join('\n        ');

  return '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n' +
    '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '<title>' + title + ' · zihao raccoon</title>\n' +
    '<style>\n' + getInlineStyles() + '\n</style>\n</head>\n' +
    '<body>\n\n' +
    '<nav class="nav-bar">\n' +
    '  <a href="../#blog">← 返回 Blog</a>\n' +
    '  <span class="brand-link">zihao raccoon</span>\n' +
    '</nav>\n\n' +
    '<div class="article-wrap">\n' +
    '  <article class="article">\n' +
    '    <header class="title-area">\n' +
    '      <div class="breadcrumb">\n' +
    '        <a href="../">Portfolio</a> / <a href="../#blog">Blog</a>\n' +
    '      </div>\n' +
    '      <div class="tag-row">\n        ' + tagHtml + '\n      </div>\n' +
    '      <h1>' + title + '</h1>\n' +
    (meta.lead ? '      <p class="lead">' + meta.lead + '</p>\n' : '') +
    '      <div class="meta">\n' +
    '        <span class="author">' + (meta.author || 'zihao raccoon') + '</span>\n' +
    '        <time datetime="' + (meta.date || '') + '">' + formatDate(meta.date) + '</time>\n' +
    (meta.updated ? '        <span>最后更新：' + formatDate(meta.updated) + '</span>\n' : '') +
    '        <span>·</span>\n' +
    '        <span>' + (meta.reading_time || '') + '</span>\n' +
    '      </div>\n' +
    '      <div class="meta-divider"></div>\n' +
    '    </header>\n\n' +
    '    <div class="article-body">\n' +
    bodyHtml + '\n' +
    '    </div>\n\n' +
    '    <footer class="article-footer">\n' +
    '      <span class="copyright">© 2026 zihao raccoon</span>\n' +
    '      <span class="copyright" style="font-size:11px;">Opinions are my own.</span>\n' +
    '    </footer>\n' +
    '  </article>\n\n' +
    tocHtml + '\n' +
    '</div>\n\n</body>\n</html>';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  var parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return parts[0] + ' 年 ' + parseInt(parts[1]) + ' 月 ' + parseInt(parts[2]) + ' 日';
}

// ─── inline CSS ───

function getInlineStyles() {
  return fs.readFileSync(path.resolve(__dirname, '_styles.css'), 'utf8');
}

// ─── build ───

function build() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  var entries = fs.readdirSync(BLOG_SRC, { withFileTypes: true });
  var posts = [];

  entries.forEach(function (entry) {
    if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== TEMPLATE_GUIDE) {
      var filePath = path.join(BLOG_SRC, entry.name);
      var raw = fs.readFileSync(filePath, 'utf8');
      var parsed = parseFrontMatter(raw);
      var meta = parsed.meta;

      if (meta.status === 'draft') return;

      var processed = preProcess(parsed.body);
      var bodyHtml = marked.parse(processed);
      bodyHtml = postProcess(bodyHtml);

      var toc = extractTOC(bodyHtml);
      var tocHtml = renderTOC(toc);

      var outFileName = (meta.slug || slug(entry.name)) + '.html';
      var fullHtml = template(meta, bodyHtml, tocHtml);

      fs.writeFileSync(path.join(OUT_DIR, outFileName), fullHtml, 'utf8');
      posts.push({ slug: meta.slug || slug(entry.name), title: meta.title, date: meta.date });
      console.log('  ✓ ' + outFileName);
    }
  });

  posts.sort(function (a, b) { return (a.date || '').localeCompare(b.date || ''); });
  console.log('\n  → ' + posts.length + ' post(s) generated');
}

build();
