const $ = (id) => document.getElementById(id);

function hostnameFromUrl(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.hostname;
  } catch {
    return null;
  }
}

async function resolveIp(hostname) {
  const q = new URL("https://cloudflare-dns.com/dns-query");
  q.searchParams.set("name", hostname);
  q.searchParams.set("type", "A");
  const res = await fetch(q, { headers: { Accept: "application/dns-json" } });
  if (!res.ok) throw new Error("DNS lookup failed");
  const data = await res.json();
  const a = data.Answer?.find((row) => row.type === 1);
  return a?.data ?? null;
}

async function geoForIp(ip) {
  const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`);
  if (!res.ok) throw new Error("Geo lookup failed");
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Geo lookup failed");
  const isp = data.connection?.isp || data.connection?.org || "—";
  const country = data.country || data.country_code || "—";
  const flag = countryFlag(data.country_code);
  return { isp, country, flag, cc: data.country_code };
}

function countryFlag(code) {
  if (!code || !/^[A-Za-z]{2}$/.test(code)) return "🌍";
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

const FLAG_CACHE_PREFIX = "flag:";

async function getFlagDataUrl(cc) {
  const key = FLAG_CACHE_PREFIX + cc.toLowerCase();
  const cached = (await chrome.storage.local.get(key))[key];
  if (cached) return cached;
  const url = `https://flagcdn.com/w40/${cc.toLowerCase()}.png`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Flag download failed");
  const blob = await res.blob();
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Flag read failed"));
    reader.readAsDataURL(blob);
  });
  await chrome.storage.local.set({ [key]: dataUrl });
  return dataUrl;
}

async function setActionFlagIcon(cc) {
  if (!cc || !/^[A-Za-z]{2}$/.test(cc)) return;
  const img = new Image();
  img.crossOrigin = "anonymous"; // required for getImageData on cached data URLs
  img.src = await getFlagDataUrl(cc);
  await img.decode();
  const canvas = new OffscreenCanvas(40, 40);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, 40, 40);
  await chrome.action.setIcon({
    imageData: ctx.getImageData(0, 0, 40, 40),
  });
}

async function loadTimeMs(tabId) {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const nav = performance.getEntriesByType("navigation")[0];
      if (nav && nav.loadEventEnd > 0) {
        return Math.round(nav.loadEventEnd - nav.startTime);
      }
      const t = performance.timing;
      if (t?.loadEventEnd && t?.navigationStart) {
        return Math.round(t.loadEventEnd - t.navigationStart);
      }
      return null;
    },
  });
  return result;
}

function formatLoadTime(ms) {
  if (ms == null || Number.isNaN(ms)) return "—";
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(2)} s`;
}

function setError(message) {
  const el = $("error");
  el.hidden = !message;
  el.textContent = message || "";
}

function setField(id, value) {
  $(id).textContent = value ?? "—";
}

async function main() {
  setError("");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) {
    setError("No active tab.");
    return;
  }

  const hostname = hostnameFromUrl(tab.url);
  $("host").textContent = hostname || tab.url;
  $("host").title = tab.url;

  if (!hostname) {
    setField("ip", "—");
    setField("isp", "—");
    setField("country", "—");
    $("flag").textContent = "🌍";
    setField("load-time", "—");
    setError("Only http(s) pages are supported.");
    return;
  }

  try {
    const [ip, loadMs] = await Promise.all([
      resolveIp(hostname),
      loadTimeMs(tab.id).catch(() => null),
    ]);

    setField("load-time", formatLoadTime(loadMs));

    if (!ip) {
      setField("ip", "—");
      setField("isp", "—");
      setField("country", "—");
      $("flag").textContent = "🌍";
      setError("Could not resolve an IPv4 address for this host.");
      return;
    }

    setField("ip", ip);

    const { isp, country, flag, cc } = await geoForIp(ip);
    setField("isp", isp);
    setField("country", country);
    if (flag && flag !== "🌍") {
      $("flag").textContent = flag;
      setActionFlagIcon(cc).catch(() => {});
    }
  } catch (err) {
    setError(err.message || "Something went wrong.");
  }
}

main();

document.querySelectorAll(".copy").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const value = $(btn.dataset.copy)?.textContent;
    if (value && value !== "—" && value !== "…") {
      await navigator.clipboard.writeText(value);
      btn.textContent = "✓";
      btn.dataset.copied = "true";
      setTimeout(() => {
        btn.textContent = "⧉";
        delete btn.dataset.copied;
      }, 1000);
    }
  });
});
