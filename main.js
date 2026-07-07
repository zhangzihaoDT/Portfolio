(function () {
  // --- Read data from inline JSON ---
  var data;
  try {
    data = JSON.parse(document.getElementById('page-data').textContent);
  } catch (e) {
    return;
  }

  // --- Narrative role map ---
  var narrativeRoleMap = {
    'design-foundation': {
      label: '\u8bbe\u8ba1\u5e95\u5ea7',
      description: '\u4fe1\u606f\u8868\u8fbe\u548c\u7ed3\u6784\u5316\u80fd\u529b\u6765\u81ea\u8bbe\u8ba1\u8bad\u7ec3\u3002'
    },
    'data-foundation': {
      label: '\u6570\u636e\u80fd\u529b',
      description: '\u7528\u6570\u636e\u5206\u6790\u7406\u89e3\u4e1a\u52a1\u548c\u5e02\u573a\u3002'
    },
    'auto-industry': {
      label: '\u884c\u4e1a\u8bad\u7ec3\u573a',
      description: '\u5bf9\u6c7d\u8f66\u884c\u4e1a\u590d\u6742\u73b0\u5b9e\u7cfb\u7edf\u7684\u7406\u89e3\u3002'
    },
    'ai-tooling': {
      label: 'AI \u5de5\u5177\u5316',
      description: '\u628a\u5206\u6790\u6d41\u7a0b\u53d8\u6210\u53ef\u8fd0\u884c\u7684\u5c0f\u5de5\u5177\u3002'
    },
    'life-product': {
      label: '\u751f\u6d3b\u4ea7\u54c1\u5316',
      description: '\u628a\u540c\u4e00\u5957\u80fd\u529b\u8fc1\u79fb\u5230\u771f\u5b9e\u751f\u6d3b\u573a\u666f\u3002'
    }
  };

  function getRoleHTML(role) {
    if (!role || !narrativeRoleMap[role]) return '';
    var r = narrativeRoleMap[role];
    return '<div class="role-badge">' + r.label + '</div>' +
      '<p class="role-note">' + r.description + '</p>';
  }

  // --- Render design cards ---
  function renderDesignCards(cards) {
    var container = document.getElementById('design-cards');
    if (!container || !cards) return;
    container.innerHTML = cards.map(function (c) {
      var tag = c.link ? 'a' : 'div';
      var hrefAttr = c.link ? ' href="' + c.link + '" target="_blank" rel="noopener"' : '';
      return '<' + tag + ' class="card card-placeholder"' + hrefAttr + '>' +
        '<div class="card-visual"><img src="' + c.image + '" alt="' + c.title + '"></div>' +
        '<div class="card-body">' +
        getRoleHTML(c.narrativeRole) +
        '<h4>' + c.title + '</h4>' +
        '<p>' + c.description + '</p>' +
        '</div>' +
        '</' + tag + '>';
    }).join('');
  }

  // --- Render data cases ---
  function renderDataCases(cases) {
    var container = document.getElementById('data-cases');
    if (!container || !cases) return;
    container.innerHTML = cases.map(function (c) {
      var detailHtml = '';
      for (var key in c.detail) {
        detailHtml += '<div class="case-q"><span class="case-label">' + key + '</span><p>' + c.detail[key] + '</p></div>';
      }
      return '<div class="case-card">' +
        '<div class="case-number">' + c.id + '</div>' +
        getRoleHTML(c.narrativeRole) +
        '<h4>' + c.title + '</h4>' +
        '<div class="case-detail">' + detailHtml + '</div>' +
        '</div>';
    }).join('');
  }

  // --- Render auto chain ---
  function renderAutoChain(chain) {
    var container = document.getElementById('auto-chain');
    if (!container || !chain) return;
    container.innerHTML = '<div class="capability-chain">' +
      chain.map(function (item, i) {
        var arrow = i < chain.length - 1 ? '<span class="chain-arrow">\u2192</span>' : '';
        return '<span>' + item + '</span>' + arrow;
      }).join('') +
      '</div>';
  }

  // --- Render auto matrix ---
  function renderAutoMatrix(matrix) {
    var container = document.getElementById('auto-matrix');
    if (!container || !matrix) return;
    var header = '<div class="matrix-header"><span class="matrix-col-1">\u80fd\u529b</span><span class="matrix-col-2">\u89e3\u51b3\u7684\u95ee\u9898</span></div>';
    var rows = matrix.map(function (r) {
      return '<div class="matrix-row"><span class="matrix-col-1">' + r.capability + '</span><span class="matrix-col-2">' + r.solves + '</span></div>';
    }).join('');
    container.innerHTML = '<div class="matrix">' + header + rows + '</div>' +
      '<p class="matrix-note">' + data.auto.note + '</p>';
  }

  // --- Render AI cards ---
  function renderAiCards(cards) {
    var container = document.getElementById('ai-cards');
    if (!container || !cards) return;
    container.innerHTML = cards.map(function (c) {
      return '<div class="card card-placeholder"><div class="card-body">' +
        getRoleHTML(c.narrativeRole) +
        '<h4>' + c.title + '</h4>' +
        '<p>' + c.description + '</p>' +
        '</div></div>';
    }).join('');
  }

  // --- Render AI capabilities ---
  function renderAiCapabilities(caps) {
    var container = document.getElementById('ai-capabilities');
    if (!container || !caps) return;
    container.innerHTML = '<div class="ai-capability-note">' +
      '<p>\u65b0\u7684\u80fd\u529b\u7ec4\u5408\uff1a</p>' +
      '<div class="ai-tags">' +
      caps.map(function (t) { return '<span>' + t + '</span>'; }).join('') +
      '</div></div>';
  }

  // --- Render hero subtitle ---
  function renderHeroSubtitle(subtitle) {
    var el = document.getElementById('hero-subtitle');
    if (el && subtitle) el.textContent = subtitle;
  }

  // --- Render projects (enhanced with summary + tags) ---
  function renderProjects(projects) {
    var container = document.getElementById('project-list');
    if (!container || !projects) return;
    container.innerHTML = projects.map(function (p) {
      var detailHtml = '';
      for (var key in p.detail) {
        detailHtml += '<div class="project-q"><span class="project-label">' + key + '</span><p>' + p.detail[key] + '</p></div>';
      }
      var tagsHtml = p.tags && p.tags.length
        ? '<div class="project-tags">' + p.tags.map(function (t) { return '<span class="project-tag">' + t + '</span>'; }).join('') + '</div>'
        : '';
      var summaryHtml = p.summary ? '<p class="project-summary">' + p.summary + '</p>' : '';
      return '<div class="project-card">' +
        '<div class="project-number">' + p.id + '</div>' +
        '<div class="project-body">' +
        getRoleHTML(p.narrativeRole) +
        '<h4>' + p.title + '</h4>' +
        summaryHtml +
        '<div class="project-detail">' + detailHtml + '</div>' +
        tagsHtml +
        '</div>' +
        '</div>';
    }).join('');
  }

  // --- Render capability ---
  function renderCapability(caps) {
    var container = document.getElementById('capability-grid');
    if (!container || !caps) return;
    container.innerHTML = caps.map(function (c) {
      return '<div class="capability-block">' +
        '<h4>' + c.title + '</h4>' +
        '<p>' + c.description + '</p>' +
        '</div>';
    }).join('');
  }

  // --- Render capability chain ---
  function renderCapabilityChain(chainData) {
    var container = document.getElementById('chain-steps');
    if (!container || !chainData || !chainData.steps) return;
    var titleHtml = chainData.title ? '<h2 class="section-title">' + chainData.title + '</h2>' : '';
    container.innerHTML = titleHtml +
      '<div class="chain-steps">' +
      chainData.steps.map(function (s, i) {
        var arrow = i < chainData.steps.length - 1 ? '<span class="chain-step-arrow">\u2192</span>' : '';
        return '<div class="chain-step">' +
          '<span class="chain-step-label">' + s.step + '</span>' +
          '<p class="chain-step-desc">' + s.description + '</p>' +
          '</div>' + arrow;
      }).join('') +
      '</div>';
  }

  // --- Render closing ---
  function renderClosing(closing) {
    var container = document.getElementById('closing-content');
    if (!container || !closing) return;
    container.innerHTML =
      '<h2 class="section-title">' + closing.title + '</h2>' +
      '<p class="closing-copy">' + closing.body + '</p>' +
      '<p class="closing-copy">' + closing.body2 + '</p>' +
      '<p class="closing-copy-strong">' + closing.motto + '</p>';
  }

  // --- Execute all renders ---
  renderHeroSubtitle(data.hero && data.hero.subtitle);
  renderDesignCards(data.design && data.design.cards);
  renderDataCases(data.data && data.data.cases);
  renderAutoChain(data.auto && data.auto.chain);
  renderAutoMatrix(data.auto && data.auto.matrix);
  renderAiCards(data.ai && data.ai.cards);
  renderAiCapabilities(data.ai && data.ai.capabilities);
  renderProjects(data.projects);
  renderCapabilityChain(data.capabilityChain);
  renderCapability(data.capability);
  renderClosing(data.closing);

  // --- Nav active highlight ---
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = [];

  navLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      var section = document.querySelector(href);
      if (section) sections.push({ el: section, link: link });
    }
  });

  function updateActive() {
    var scrollY = window.scrollY;
    var headerHeight = 80;
    var currentId = null;

    for (var i = 0; i < sections.length; i++) {
      var s = sections[i].el;
      var top = s.offsetTop - headerHeight;
      var bottom = top + s.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        currentId = '#' + s.getAttribute('id');
      }
    }

    navLinks.forEach(function (link) {
      if (currentId && link.getAttribute('href') === currentId) {
        link.style.color = '#174A7C';
        link.style.fontWeight = '600';
      } else {
        link.style.color = '';
        link.style.fontWeight = '';
      }
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateActive();
        ticking = false;
      });
      ticking = true;
    }
  });
  updateActive();
})();
