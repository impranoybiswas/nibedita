import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = [
  "owrcovcrpy.gpcdn.net",
  "byphdgllyk.gpcdn.net",
  "tvsen7.aynaott.com",
  "tvsen6.aynaott.com",
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
  "cdn-4.pishow.tv",
  "a-cdn.klowdtv.com",
  "edge2.roarzone.net",
  "amagi.tv",
  "226503.xyz",
  "pishow.tv",
  "vods2.aynaott.com",
  "wurl.com",
  "cloudfront.net",
];

/* ----------------------------
   HOST VALIDATION
-----------------------------*/
function isAllowedHost(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    // Check for exact match or subdomain match
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
    console.warn("[Stream Proxy] Blocked host:", new URL(decodedUrl).hostname);
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const controller = new AbortController();
    // Vercel Hobby timeout is 10s, Pro is 60s. 12s is a safe middle ground for the fetch itself.
    const timeoutId = setTimeout(() => controller.abort(), 12_000);

    const upstream = await fetch(decodedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
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
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    }

    /* ----------------------------
       BINARY STREAM (TS, MP4) - Use direct body streaming
    -----------------------------*/
    // We pass the upstream body directly to NextResponse to enable true streaming
    // and avoid Vercel's payload size limits for serverless functions.
    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": contentType || "video/MP2T",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=10, s-maxage=10", // Reduce cache for segments to 10s to stay fresh but still cached
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
    return NextResponse.json(
      {
        error: "Stream fetch failed",
        message: err instanceof Error ? err.message : String(err),
        cause: err instanceof Error && "cause" in err ? err.cause : "unknown",
      },
      { status: 500 },
    );
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
