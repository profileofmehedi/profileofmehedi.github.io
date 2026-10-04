(function () {
  const data = window.FAMILY;
  if (!data) return;

  const meta = data.meta;
  const people = data.people;
  const byId = new Map(people.map((p) => [p.id, p]));
  const childMap = new Map();
  people.forEach((p) => {
    const key = p.parentId || "";
    if (!childMap.has(key)) childMap.set(key, []);
    childMap.get(key).push(p);
  });

  const root = people.find((p) => !p.parentId);
  const home = byId.get(meta.homeId) || root;
  const genCache = new Map();

  const personView = document.getElementById("personView");
  const treeView = document.getElementById("treeView");
  const panel = document.getElementById("panel");
  const tree = document.getElementById("tree");
  const canvas = document.getElementById("canvas");
  const scaler = document.getElementById("scaler");
  const results = document.getElementById("results");
  const query = document.getElementById("q");

  let selectedId = byId.has(location.hash.slice(1)) ? location.hash.slice(1) : home.id;
  let view = window.matchMedia("(min-width: 900px)").matches ? "tree" : "person";
  let scale = 1;
  let hashing = false;

  const expanded = new Set(ancestors(home.id).map((p) => p.id));
  ancestors(selectedId).forEach((p) => expanded.add(p.id));

  document.getElementById("title").textContent = meta.title;
  document.getElementById("credit").textContent = statLine();

  document.getElementById("viewPerson").addEventListener("click", () => setView("person"));
  document.getElementById("viewTree").addEventListener("click", () => setView("tree"));
  document.getElementById("zoomIn").addEventListener("click", () => setScale(scale * 1.15));
  document.getElementById("zoomOut").addEventListener("click", () => setScale(scale / 1.15));
  document.getElementById("zoomFit").addEventListener("click", () => {
    fitWidth("all");
    requestAnimationFrame(centerOnSelected);
  });
  document.getElementById("showLine").addEventListener("click", showLine);
  document.getElementById("showAll").addEventListener("click", showAll);
  document.getElementById("saveBranch").addEventListener("click", downloadBranch);
  query.addEventListener("input", () => renderSearch(query.value));
  query.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSearch();
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search")) closeSearch();
  });
  canvas.addEventListener("wheel", (e) => {
    if (!e.ctrlKey) return;
    e.preventDefault();
    setScale(scale * (e.deltaY < 0 ? 1.08 : 0.92), { x: e.clientX, y: e.clientY });
  }, { passive: false });
  bindTouchZoom();
  window.addEventListener("popstate", () => {
    const id = location.hash.slice(1);
    if (!byId.has(id)) return;
    hashing = true;
    onPick(id, "go");
    hashing = false;
  });
  window.addEventListener("resize", () => {
    layout();
    if (view === "tree" && !panel.hidden) renderPanel();
  });

  boot();

  function kids(id) {
    return childMap.get(id) || [];
  }

  function generation(id) {
    if (genCache.has(id)) return genCache.get(id);
    const person = byId.get(id);
    const g = person.parentId ? generation(person.parentId) + 1 : 1;
    genCache.set(id, g);
    return g;
  }

  function ancestors(id) {
    const chain = [];
    let cur = byId.get(id);
    const seen = new Set();
    while (cur && cur.parentId && !seen.has(cur.id)) {
      seen.add(cur.id);
      cur = byId.get(cur.parentId);
      if (cur) chain.push(cur);
    }
    return chain.reverse();
  }

  function maxGeneration() {
    return people.reduce((max, p) => Math.max(max, generation(p.id)), 1);
  }

  function bn(n) {
    return String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
  }

  function statLine() {
    const groups = people.filter((p) => p.kind === "group").length;
    return `${bn(maxGeneration())} প্রজন্ম · ${bn(people.length - groups)} জন · ${meta.source}`;
  }

  function asciiPhone(value) {
    return value.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d)).replace(/\s/g, "");
  }

  function boot() {
    if (!hashing) setHash(selectedId, true);
    layout();
    if (view === "tree") {
      renderTree(false);
      requestAnimationFrame(() => {
        fitWidth("readable");
        centerOnSelected();
      });
    } else {
      renderPerson();
    }
    document.title = `${byId.get(selectedId).name} · ${meta.title}`;
  }

  function setView(next) {
    view = next;
    layout();
    if (next === "tree") {
      renderTree(false);
      requestAnimationFrame(() => {
        fitWidth("readable");
        centerOnSelected();
      });
      if (!panel.hidden) renderPanel();
    } else {
      renderPerson();
    }
  }

  function layout() {
    const wide = window.innerWidth >= 900;
    personView.hidden = view !== "person";
    treeView.hidden = view !== "tree";
    panel.hidden = !(view === "tree" && wide);
    document.getElementById("viewPerson").setAttribute("aria-pressed", String(view === "person"));
    document.getElementById("viewTree").setAttribute("aria-pressed", String(view === "tree"));
  }

  function onPick(id, mode) {
    if (!byId.has(id)) return;
    selectedId = id;
    document.title = `${byId.get(id).name} · ${meta.title}`;
    if (!hashing) setHash(id, mode === "init");
    ancestors(id).forEach((p) => expanded.add(p.id));
    const small = window.innerWidth < 900;
    if (small && view === "tree") view = "person";
    layout();
    if (view === "person") renderPerson();
    if (view === "tree") {
      renderTree(mode !== "go");
      if (!panel.hidden) renderPanel();
      if (mode === "go") requestAnimationFrame(centerOnSelected);
    }
    closeSearch();
    query.value = "";
  }

  function setHash(id, replace) {
    const next = "#" + id;
    if (location.hash === next) return;
    if (replace) history.replaceState(null, "", next);
    else history.pushState(null, "", next);
  }

  function showLine() {
    expanded.clear();
    ancestors(home.id).forEach((p) => expanded.add(p.id));
    selectedId = home.id;
    document.title = `${home.name} · ${meta.title}`;
    setHash(home.id, false);
    view = "tree";
    layout();
    renderTree(false);
    if (!panel.hidden) renderPanel();
    requestAnimationFrame(() => {
      fitWidth("readable");
      centerOnSelected();
    });
  }

  function showAll() {
    people.forEach((p) => {
      if (kids(p.id).length) expanded.add(p.id);
    });
    view = "tree";
    layout();
    renderTree(false);
    if (!panel.hidden) renderPanel();
    requestAnimationFrame(() => {
      fitWidth("all");
      centerOnSelected();
    });
  }

  function setScale(next, origin) {
    const prev = Math.max(scale, 0.01);
    const clamped = Math.min(2.8, Math.max(0.18, next));
    const rect = canvas.getBoundingClientRect();
    const localX = origin ? origin.x - rect.left : canvas.clientWidth / 2;
    const localY = origin ? origin.y - rect.top : canvas.clientHeight / 2;
    const contentX = (canvas.scrollLeft + localX) / prev;
    const contentY = (canvas.scrollTop + localY) / prev;
    scale = clamped;
    applyScale();
    canvas.scrollLeft = contentX * scale - localX;
    canvas.scrollTop = contentY * scale - localY;
  }

  function bindTouchZoom() {
    let gesture = null;
    let suppressClick = false;
    const dist = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.hypot(dx, dy) || 1;
    };
    const mid = (touches) => ({
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    });
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length >= 2) {
        gesture = { type: "pinch", dist: dist(e.touches), scale, moved: 0 };
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        gesture = { type: "pan", x: t.clientX, y: t.clientY, left: canvas.scrollLeft, top: canvas.scrollTop, moved: 0 };
      }
    }, { passive: true });
    canvas.addEventListener("touchmove", (e) => {
      if (!gesture) return;
      if (e.touches.length >= 2 && gesture.type === "pinch") {
        e.preventDefault();
        const spread = dist(e.touches);
        gesture.moved = Math.max(gesture.moved, Math.abs(spread - gesture.dist));
        setScale(gesture.scale * (spread / gesture.dist), mid(e.touches));
      } else if (e.touches.length === 1 && gesture.type === "pan") {
        const t = e.touches[0];
        const dx = t.clientX - gesture.x;
        const dy = t.clientY - gesture.y;
        gesture.moved = Math.max(gesture.moved, Math.hypot(dx, dy));
        if (gesture.moved > 4) {
          e.preventDefault();
          canvas.scrollLeft = gesture.left - dx;
          canvas.scrollTop = gesture.top - dy;
        }
      }
    }, { passive: false });
    const endTouch = (e) => {
      if (gesture && gesture.moved > 8) suppressClick = true;
      if (e.touches.length >= 2) {
        gesture = { type: "pinch", dist: dist(e.touches), scale, moved: 0 };
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        gesture = { type: "pan", x: t.clientX, y: t.clientY, left: canvas.scrollLeft, top: canvas.scrollTop, moved: 0 };
      } else {
        gesture = null;
      }
    };
    canvas.addEventListener("touchend", endTouch);
    canvas.addEventListener("touchcancel", () => { gesture = null; });
    canvas.addEventListener("click", (e) => {
      if (!suppressClick) return;
      suppressClick = false;
      e.preventDefault();
      e.stopPropagation();
    }, true);
  }

  function renderTree(keepScroll) {
    const left = canvas.scrollLeft;
    const top = canvas.scrollTop;
    tree.replaceChildren(branch(root.id));
    applyScale();
    if (keepScroll) {
      canvas.scrollLeft = left;
      canvas.scrollTop = top;
    }
  }

  function applyScale() {
    tree.style.transform = "none";
    const w = tree.scrollWidth;
    const h = tree.scrollHeight;
    tree.style.transform = `scale(${scale})`;
    scaler.style.width = Math.ceil(w * scale) + "px";
    scaler.style.height = Math.ceil(h * scale) + "px";
    document.getElementById("zoomLabel").textContent = bn(Math.round(scale * 100)) + "%";
    return { w, h };
  }

  function fitWidth(mode) {
    tree.style.transform = "none";
    const w = Math.max(tree.scrollWidth, 1);
    const avail = Math.max(canvas.clientWidth - 64, 240);
    const raw = avail / w;
    scale = mode === "all" ? Math.min(1, Math.max(0.16, raw)) : 1;
    applyScale();
  }

  function centerOnSelected() {
    const el = tree.querySelector(`[data-id="${selectedId}"]`);
    if (!el) return;
    const cRect = canvas.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    canvas.scrollLeft += eRect.left - cRect.left - (cRect.width - eRect.width) / 2;
    canvas.scrollTop += eRect.top - cRect.top - (cRect.height - eRect.height) / 2;
  }

  function branch(id) {
    const person = byId.get(id);
    const wrap = el("div", "branch");
    wrap.append(card(person));
    const ch = kids(id);
    if (!ch.length) return wrap;
    wrap.append(twig(person, ch.length));
    if (expanded.has(id)) {
      const row = el("div", "kids");
      ch.forEach((child) => row.append(branch(child.id)));
      wrap.append(row);
    }
    return wrap;
  }

  function card(person) {
    const onPath = ancestors(selectedId).some((p) => p.id === person.id) || person.id === selectedId;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "card";
    btn.dataset.id = person.id;
    if (person.id === selectedId) btn.classList.add("is-selected");
    else if (onPath) btn.classList.add("on-path");
    if (person.kind === "group") btn.classList.add("is-group");
    btn.title = ancestors(person.id).concat(person).map((p) => p.name).join(" › ");
    if (person.photo) btn.append(photo(person, "avatar"));
    else btn.append(mark(person, ""));
    const name = el("span", "card-name");
    name.textContent = person.name;
    btn.append(name);
    btn.addEventListener("click", () => onPick(person.id, "stay"));
    btn.addEventListener("dblclick", (e) => {
      e.preventDefault();
      toggle(person.id);
    });
    return btn;
  }

  function twig(person, count) {
    const open = expanded.has(person.id);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "twig";
    btn.setAttribute("aria-expanded", String(open));
    btn.title = open ? "শাখা বন্ধ করুন" : "শাখা খুলুন";
    btn.setAttribute("aria-label", open ? "শাখা বন্ধ করুন" : `${person.name}-এর শাখা খুলুন`);
    btn.textContent = open ? "▴" : bn(count);
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggle(person.id);
    });
    return btn;
  }

  function toggle(id) {
    if (!kids(id).length) return;
    if (expanded.has(id)) expanded.delete(id);
    else expanded.add(id);
    if (view === "tree") renderTree(true);
  }

  function renderPerson() {
    const person = byId.get(selectedId);
    const father = person.parentId ? byId.get(person.parentId) : null;
    const sibs = father ? kids(father.id).filter((s) => s.id !== person.id) : [];
    personView.replaceChildren();
    const sheet = el("div", "sheet");
    sheet.append(breadcrumb(person));
    const up = el("div", "up");
    up.append(el("span", "kicker", father ? "বাবা" : "বংশের শুরু"));
    if (father) up.append(plainButton(father.name, "pill", () => onPick(father.id, "go")));
    sheet.append(up);
    if (father) sheet.append(el("div", "drop-line"));
    sheet.append(focusCard(person, father));
    sheet.append(saveButton("এই শাখার ছবি"));
    sheet.append(block("ভাইবোন", sibs, "chips", "এই স্তরে আর কেউ নেই।"));
    sheet.append(block("সন্তান", kids(person.id), "rows", "নিচে আর কেউ লেখা নেই।"));
    sheet.append(missingForm(person));
    sheet.append(colophon());
    personView.append(sheet);
    const crumb = sheet.querySelector(".crumb");
    requestAnimationFrame(() => {
      crumb.scrollLeft = crumb.scrollWidth;
    });
  }

  function saveButton(label) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "save-branch";
    btn.dataset.saveBranch = "1";
    btn.dataset.label = label;
    btn.textContent = label;
    btn.addEventListener("click", downloadBranch);
    return btn;
  }

  let saving = false;

  async function downloadBranch() {
    if (saving) return;
    saving = true;
    const buttons = () => document.querySelectorAll("[data-save-branch]");
    buttons().forEach((b) => {
      b.disabled = true;
      b.textContent = "তৈরি হচ্ছে…";
    });
    try {
      const person = byId.get(selectedId);
      const blob = await renderBranchImage(person);
      const filename = `${meta.title}-${person.name}.png`.replace(/[\\/:*?"<>|]/g, "");
      openSaveSheet(blob, filename);
    } catch (err) {
      buttons().forEach((b) => { b.textContent = "আবার চেষ্টা করুন"; });
      setTimeout(resetSaveButtons, 1400);
      saving = false;
      return;
    }
    resetSaveButtons();
    saving = false;
  }

  function openSaveSheet(blob, filename) {
    const url = URL.createObjectURL(blob);
    const previous = document.getElementById("saveSheet");
    if (previous) previous.remove();
    const sheet = el("div", "save-sheet");
    sheet.id = "saveSheet";
    const card = el("div", "save-card");
    const img = document.createElement("img");
    img.src = url;
    img.alt = filename;
    const actions = el("div", "save-actions");
    const save = document.createElement("button");
    save.type = "button";
    save.className = "save-branch";
    save.textContent = "ছবি সেভ করুন";
    save.addEventListener("click", () => storeBlob(blob, filename));
    const close = document.createElement("button");
    close.type = "button";
    close.className = "save-close";
    close.textContent = "বন্ধ";
    const hint = el("p", "save-hint", "ফোনে ছবিটা চেপে ধরে গ্যালারিতে রাখা যায়।");
    actions.append(save, close);
    card.append(img, actions, hint);
    sheet.append(card);
    const dismiss = () => {
      sheet.remove();
      URL.revokeObjectURL(url);
    };
    close.addEventListener("click", dismiss);
    sheet.addEventListener("click", (e) => {
      if (e.target === sheet) dismiss();
    });
    document.body.append(sheet);
  }

  function storeBlob(blob, filename) {
    const file = new File([blob], filename, { type: "image/png" });
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (ios && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: filename }).catch(() => {});
      return;
    }
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 20000);
  }

  function resetSaveButtons() {
    document.querySelectorAll("[data-save-branch]").forEach((b) => {
      b.disabled = false;
      b.textContent = b.dataset.label || "শাখার ছবি";
    });
  }

  async function renderBranchImage(person) {
    await document.fonts.ready;
    try { await document.fonts.load("600 16px 'Noto Sans Bengali'"); } catch (e) { /* fallback font */ }
    const treeBox = measureBranch(person.id);
    const photos = await loadBranchPhotos(person.id);
    const pad = 36;
    const headerH = 108;
    const fullW = treeBox.w + pad * 2;
    const fullH = headerH + treeBox.h + pad;
    const maxEdge = 10000;
    const drawScale = Math.min(1, maxEdge / fullW, maxEdge / fullH);
    const pixel = drawScale < 1 ? 1 : 2;
    const board = document.createElement("canvas");
    board.width = Math.max(1, Math.ceil(fullW * drawScale * pixel));
    board.height = Math.max(1, Math.ceil(fullH * drawScale * pixel));
    const ctx = board.getContext("2d");
    ctx.setTransform(pixel * drawScale, 0, 0, pixel * drawScale, 0, 0);
    ctx.fillStyle = "#f6f1e8";
    ctx.fillRect(0, 0, fullW, fullH);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#1c1916";
    ctx.font = "700 26px 'Noto Serif Bengali', 'Nirmala UI', serif";
    ctx.fillText(meta.title, fullW / 2, 34);
    ctx.fillStyle = "#1e3d34";
    ctx.font = "600 16px 'Noto Sans Bengali', 'Nirmala UI', sans-serif";
    ctx.fillText(branchTitle(person.name), fullW / 2, 64);
    ctx.fillStyle = "#6f675f";
    ctx.font = "400 13px 'Noto Sans Bengali', 'Nirmala UI', sans-serif";
    ctx.fillText(`${bn(countBranch(person.id))} জন · ${meta.source}`, fullW / 2, 88);
    paintBranch(ctx, treeBox, pad, headerH, person.id, photos);
    let blob = await new Promise((resolve) => board.toBlob(resolve, "image/png"));
    if (!blob) {
      const plain = document.createElement("canvas");
      plain.width = board.width;
      plain.height = board.height;
      const plainCtx = plain.getContext("2d");
      plainCtx.setTransform(pixel * drawScale, 0, 0, pixel * drawScale, 0, 0);
      plainCtx.fillStyle = "#f6f1e8";
      plainCtx.fillRect(0, 0, fullW, fullH);
      plainCtx.textAlign = "center";
      plainCtx.textBaseline = "middle";
      plainCtx.fillStyle = "#1c1916";
      plainCtx.font = "700 26px 'Noto Serif Bengali', 'Nirmala UI', serif";
      plainCtx.fillText(meta.title, fullW / 2, 34);
      plainCtx.fillStyle = "#1e3d34";
      plainCtx.font = "600 16px 'Noto Sans Bengali', 'Nirmala UI', sans-serif";
      plainCtx.fillText(branchTitle(person.name), fullW / 2, 64);
      plainCtx.fillStyle = "#6f675f";
      plainCtx.font = "400 13px 'Noto Sans Bengali', 'Nirmala UI', sans-serif";
      plainCtx.fillText(`${bn(countBranch(person.id))} জন · ${meta.source}`, fullW / 2, 88);
      paintBranch(plainCtx, treeBox, pad, headerH, person.id, new Map());
      blob = await new Promise((resolve) => plain.toBlob(resolve, "image/png"));
    }
    if (!blob) throw new Error("blob");
    return blob;
  }

  function branchTitle(name) {
    const last = Array.from(name).pop() || "";
    const hasVowel = "অআইঈউঊঋএঐওঔািীুূৃেৈোৌ".includes(last);
    return hasVowel ? `${name}র শাখা` : `${name}ের শাখা`;
  }

  function countBranch(id) {
    return 1 + kids(id).reduce((sum, child) => sum + countBranch(child.id), 0);
  }

  function measureBranch(id) {
    const cardW = 156;
    const cardH = 96;
    const gapX = 16;
    const gapY = 54;
    const ch = kids(id).map((child) => measureBranch(child.id));
    const inner = ch.reduce((sum, child) => sum + child.w, 0) + Math.max(0, ch.length - 1) * gapX;
    const below = ch.length ? gapY + Math.max(...ch.map((child) => child.h)) : 0;
    return { id, ch, w: Math.max(cardW, inner), h: cardH + below, cardW, cardH, gapX, gapY };
  }

  function loadBranchPhotos(id) {
    const srcs = new Set();
    (function walk(pid) {
      const person = byId.get(pid);
      if (person.photo) srcs.add(person.photo);
      kids(pid).forEach((child) => walk(child.id));
    })(id);
    return Promise.all([...srcs].map((src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve([src, img]);
      img.onerror = () => resolve([src, null]);
      img.src = src;
    }))).then((pairs) => new Map(pairs.filter((pair) => pair[1])));
  }

  function paintBranch(ctx, node, x, y, rootId, photos) {
    const cardX = x + (node.w - node.cardW) / 2;
    drawExportCard(ctx, node.id, cardX, y, node.cardW, node.cardH, node.id === rootId, photos);
    if (!node.ch.length) return;
    const inner = node.ch.reduce((sum, child) => sum + child.w, 0) + (node.ch.length - 1) * node.gapX;
    let cx = x + (node.w - inner) / 2;
    const barY = y + node.cardH + 20;
    const childY = y + node.cardH + node.gapY;
    ctx.strokeStyle = "#c3b6a6";
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(cardX + node.cardW / 2, y + node.cardH);
    ctx.lineTo(cardX + node.cardW / 2, barY);
    ctx.stroke();
    if (node.ch.length > 1) {
      const first = cx + node.ch[0].w / 2;
      const lastNode = node.ch[node.ch.length - 1];
      const last = cx + inner - lastNode.w / 2;
      ctx.beginPath();
      ctx.moveTo(first, barY);
      ctx.lineTo(last, barY);
      ctx.stroke();
    }
    node.ch.forEach((child) => {
      const mid = cx + child.w / 2;
      ctx.beginPath();
      ctx.moveTo(mid, barY);
      ctx.lineTo(mid, childY);
      ctx.stroke();
      paintBranch(ctx, child, cx, childY, rootId, photos);
      cx += child.w + node.gapX;
    });
  }

  function drawExportCard(ctx, id, x, y, w, h, isRoot, photos) {
    const person = byId.get(id);
    const group = person.kind === "group";
    ctx.beginPath();
    traceRoundRect(ctx, x, y, w, h, 16);
    ctx.fillStyle = isRoot ? "#1e3d34" : group ? "#fbf7ef" : "#fffcf8";
    ctx.fill();
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = isRoot ? "#1e3d34" : group ? "#7a5b32" : "#e4dcd2";
    if (group && !isRoot) ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
    const img = person.photo ? photos.get(person.photo) : null;
    if (img) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + w / 2, y + 28, 16, 0, Math.PI * 2);
      ctx.clip();
      const cover = Math.max(32 / img.width, 32 / img.height);
      const dw = img.width * cover;
      const dh = img.height * cover;
      ctx.drawImage(img, x + w / 2 - dw / 2, y + 28 - dh / 2, dw, dh);
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.arc(x + w / 2, y + 24, 4, 0, Math.PI * 2);
      ctx.fillStyle = isRoot ? "#ffffff" : person.gender === "female" ? "#9a4e45" : "#2c5270";
      ctx.fill();
    }
    ctx.fillStyle = isRoot ? "#ffffff" : group ? "#7a5b32" : "#1c1916";
    ctx.font = "600 15px 'Noto Sans Bengali', 'Nirmala UI', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = wrapText(ctx, person.name, w - 18);
    const start = img ? 52 : 46;
    lines.forEach((line, i) => ctx.fillText(line, x + w / 2, y + start + i * 18));
  }

  function traceRoundRect(ctx, x, y, w, h, r) {
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    const radius = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function wrapText(ctx, text, max) {
    const parts = text.split(" ");
    const lines = [];
    let line = "";
    parts.forEach((part) => {
      const next = line ? `${line} ${part}` : part;
      if (line && ctx.measureText(next).width > max) {
        lines.push(line);
        line = part;
      } else {
        line = next;
      }
    });
    if (line) lines.push(line);
    return lines.slice(0, 2);
  }

  function breadcrumb(person) {
    const nav = document.createElement("nav");
    nav.className = "crumb";
    nav.setAttribute("aria-label", "পূর্বপুরুষ");
    ancestors(person.id).forEach((a) => {
      nav.append(plainButton(a.name, "crumb-btn", () => onPick(a.id, "go")));
      nav.append(el("span", "crumb-sep", "›"));
    });
    nav.append(el("span", "crumb-here", person.name));
    return nav;
  }

  function focusCard(person, father) {
    const card = document.createElement("article");
    card.className = "focus" + (person.kind === "group" ? " is-group" : "");
    if (person.photo) card.append(photo(person, "avatar-lg"));
    else card.append(mark(person, "lg"));
    card.append(el("h2", "", person.name));
    const bits = [`প্রজন্ম ${bn(generation(person.id))}`];
    if (father) bits.push(`বাবা ${father.name}`);
    card.append(el("p", "focus-meta", bits.join(" · ")));
    if (person.kind === "group") {
      card.append(el("p", "group-note", "আলাদা নাম লেখা নেই। উৎসে যেমন আছে, তেমন রাখা হয়েছে।"));
    }
    return card;
  }

  function block(title, list, layout, emptyText) {
    const sec = document.createElement("section");
    sec.className = "block";
    const h = document.createElement("h3");
    h.textContent = title;
    if (list.length) h.append(el("span", "count", bn(list.length)));
    sec.append(h);
    if (!list.length) {
      sec.append(el("p", "empty", emptyText));
      return sec;
    }
    const box = el("div", layout);
    list.forEach((person) => box.append(personButton(person, layout === "chips" ? "chip" : "row")));
    sec.append(box);
    return sec;
  }

  function renderPanel() {
    const person = byId.get(selectedId);
    const father = person.parentId ? byId.get(person.parentId) : null;
    const sibs = father ? kids(father.id).filter((s) => s.id !== person.id) : [];
    panel.replaceChildren();
    const head = el("div", "panel-head");
    if (person.photo) head.append(photo(person, "avatar-lg"));
    else head.append(mark(person, "lg"));
    head.append(el("h2", "", person.name));
    const bits = [`প্রজন্ম ${bn(generation(person.id))}`];
    if (father) bits.push(`বাবা ${father.name}`);
    else bits.push("বংশের শুরু");
    head.append(el("p", "focus-meta", bits.join(" · ")));
    if (person.kind === "group") {
      head.append(el("p", "group-note", "আলাদা নাম লেখা নেই। উৎসে যেমন আছে, তেমন রাখা হয়েছে।"));
    }
    panel.append(head);
    panel.append(saveButton("এই শাখার ছবি"));
    if (father) panel.append(linkList("বাবা", [father], ""));
    panel.append(linkList("ভাইবোন", sibs, "এই স্তরে আর কেউ নেই।"));
    panel.append(linkList("সন্তান", kids(person.id), "নিচে আর কেউ লেখা নেই।"));
    panel.append(missingForm(person));
    panel.append(colophon());
  }

  function missingForm(person) {
    const sec = el("section", "missing");
    const open = document.createElement("button");
    open.type = "button";
    open.className = "missing-open";
    open.textContent = "নাম নেই";
    open.setAttribute("aria-expanded", "false");
    const form = document.createElement("form");
    form.className = "missing-form";
    form.hidden = true;
    form.append(el("p", "missing-lead", "যে নাম এখানে নেই, সেটা লিখে পাঠান।"));
    form.append(missingField("যে নাম নেই", "missing", "text"));
    form.append(missingField("সম্পর্ক", "relation", "text", "যেমন: ছেলে, মেয়ে, ভাই"));
    form.append(missingField("আপনার নাম", "from", "text"));
    form.append(missingField("আপনার ফোন", "phone", "tel"));
    const send = document.createElement("button");
    send.type = "submit";
    send.className = "save-branch";
    send.textContent = "হোয়াটসঅ্যাপে পাঠান";
    form.append(send);
    open.addEventListener("click", () => {
      form.hidden = !form.hidden;
      open.setAttribute("aria-expanded", String(!form.hidden));
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const lines = [
        "মোল্লা বংশে একটি নাম নেই।",
        "",
        `যার ঘরে: ${person.name}`,
        `যে নাম নেই: ${String(data.get("missing") || "").trim()}`,
        `সম্পর্ক: ${String(data.get("relation") || "").trim()}`,
        `পাঠিয়েছেন: ${String(data.get("from") || "").trim()}`,
        `ফোন: ${String(data.get("phone") || "").trim()}`,
      ];
      const number = asciiPhone(meta.phone).replace(/^\+/, "");
      const url = `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank", "noopener");
    });
    sec.append(open, form);
    return sec;
  }

  function missingField(label, name, type, placeholder) {
    const wrap = el("label", "missing-field");
    wrap.append(el("span", "", label));
    const input = document.createElement("input");
    input.name = name;
    input.type = type;
    input.required = true;
    input.autocomplete = "off";
    if (type === "tel") input.inputMode = "tel";
    if (placeholder) input.placeholder = placeholder;
    wrap.append(input);
    return wrap;
  }

  function linkList(title, list, emptyText) {
    const sec = document.createElement("section");
    sec.className = "block";
    const h = document.createElement("h3");
    h.textContent = title;
    if (list.length) h.append(el("span", "count", bn(list.length)));
    sec.append(h);
    if (!list.length) {
      sec.append(el("p", "empty", emptyText));
      return sec;
    }
    list.forEach((person) => sec.append(personButton(person, "panel-link")));
    return sec;
  }

  function personButton(person, className) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = className + (person.kind === "group" ? " is-group" : "");
    if (person.photo) btn.append(photo(person, "avatar-sm"));
    else btn.append(mark(person, ""));
    if (className === "chip") {
      btn.append(el("span", "", person.name));
    } else {
      const who = el("span", "who");
      who.append(el("strong", "", person.name));
      const n = kids(person.id).length;
      const sub = n ? `${bn(n)} সন্তান` : person.kind === "group" ? "নাম নেই" : "পরের প্রজন্ম নেই";
      who.append(el("small", "", sub));
      btn.append(who);
    }
    btn.addEventListener("click", () => onPick(person.id, "go"));
    return btn;
  }

  function renderSearch(value) {
    const q = value.trim();
    results.replaceChildren();
    if (!q) {
      results.hidden = true;
      return;
    }
    const hits = people.filter((p) => p.name.includes(q));
    results.hidden = false;
    if (!hits.length) {
      results.append(el("div", "none", "এই নামে কেউ নেই।"));
      return;
    }
    hits.slice(0, 8).forEach((person) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "result";
      btn.append(el("strong", "", person.name));
      const father = person.parentId ? byId.get(person.parentId) : null;
      const where = father ? `বাবা ${father.name} · প্রজন্ম ${bn(generation(person.id))}` : "বংশের শুরু";
      btn.append(el("small", "", where));
      btn.addEventListener("click", () => onPick(person.id, "go"));
      results.append(btn);
    });
    if (hits.length > 8) results.append(el("div", "none", `আরও ${bn(hits.length - 8)} জন। নামটা আরেকটু লিখুন।`));
  }

  function closeSearch() {
    results.hidden = true;
  }

  function colophon() {
    const foot = document.createElement("footer");
    foot.className = "colophon";
    foot.append(el("p", "", `${meta.source} · ${meta.collector}`));
    foot.append(el("p", "", "তালিকাটি বাবার দিকের বংশধারা। মেয়েদের অনেক ঘরে আলাদা নাম নেই।"));
    const phone = document.createElement("a");
    phone.href = "tel:" + asciiPhone(meta.phone);
    phone.textContent = meta.phone;
    foot.append(phone);
    return foot;
  }

  function photo(person, className) {
    const img = document.createElement("img");
    img.className = className;
    img.src = person.photo;
    img.alt = person.name;
    return img;
  }

  function mark(person, extra) {
    const node = el("i", `mark ${person.gender === "female" ? "female" : "male"}${extra ? " " + extra : ""}`);
    node.setAttribute("aria-hidden", "true");
    return node;
  }

  function plainButton(text, className, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = className;
    btn.textContent = text;
    btn.addEventListener("click", onClick);
    return btn;
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
})();
