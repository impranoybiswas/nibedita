import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "owrcovcrpy.gpcdn.net",
  "byphdgllyk.gpcdn.net",
  "tvsen7.aynaott.com",
  "tvsen5.aynaott.com",
  "198.195.239.50",
  "27.124.71.27",
  "210.4.72.204",
  "ekusheyserver.com",
  "gpcdn.net",
  "aynaott.com",
  "ncare.live",
  "youtube-nocookie.com",
  "bozztv.com",
  "app.ncare.live",
  "cdn-4.pishow.tv"
];

/* ----------------------------
   HOST VALIDATION
-----------------------------*/
function isAllowedHost(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;

    return ALLOWED_HOSTS.some(
      (h) => hostname === h || hostname.endsWith(`.${h}`),
    );
  } catch {
    return false;
  }
}

/* ----------------------------
   URL RESOLVER
-----------------------------*/
function resolveUrl(url: string, base: string) {
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}

/* ----------------------------
   M3U8 REWRITER
-----------------------------*/
function rewriteM3U8(line: string, baseUrl: string): string {
  const trimmed = line.trim();

  // Handle URI inside tags (#EXT-X-KEY, #EXT-X-MAP)
  if (trimmed.includes('URI="')) {
    return line.replace(/URI="([^"]+)"/g, (_, uri) => {
      const abs = resolveUrl(uri, baseUrl);
      return `URI="/api/stream?url=${encodeURIComponent(abs)}"`;
    });
  }

  // Skip comments
  if (trimmed.startsWith("#")) return line;

  // Rewrite segment URL
  if (trimmed.length > 0) {
    const abs = resolveUrl(trimmed, baseUrl);
    return `/api/stream?url=${encodeURIComponent(abs)}`;
  }

  return line;
}

/* ----------------------------
   MAIN HANDLER
-----------------------------*/
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 },
    );
  }

  const decodedUrl = decodeURIComponent(url);

  if (!isAllowedHost(decodedUrl)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000);

    const upstream = await fetch(decodedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: new URL(decodedUrl).origin + "/",
        Origin: new URL(decodedUrl).origin,
        Accept: "*/*",
      },
      redirect: "follow",
    });

    clearTimeout(timeoutId);

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream error ${upstream.status}` },
        { status: upstream.status },
      );
    }

    const contentType = upstream.headers.get("content-type") || "";

    /* ----------------------------
       M3U8 HANDLING
    -----------------------------*/
    const isM3U8 =
      decodedUrl.includes(".m3u8") ||
      contentType.includes("mpegurl") ||
      contentType.includes("x-mpegURL");

    if (isM3U8) {
      const text = await upstream.text();

      const body = text
        .split("\n")
        .map((line) => rewriteM3U8(line, decodedUrl))
        .join("\n");

      return new NextResponse(body, {
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        },
      });
    }

    /* ----------------------------
       BINARY STREAM (TS, MP4)
    -----------------------------*/
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType || "video/MP2T",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "Upstream timed out" },
        { status: 504 },
      );
    }

    console.error("[Stream Proxy Error]", err);
    return NextResponse.json({ error: "Stream fetch failed" }, { status: 500 });
  }
}

/* ----------------------------
   CORS PRE-FLIGHT
-----------------------------*/
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range",
    },
  });
}
