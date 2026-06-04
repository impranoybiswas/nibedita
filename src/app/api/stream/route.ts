import { NextRequest, NextResponse } from "next/server";

// Allowed hosts to proxy (security: prevent open proxy abuse)
// Add any new stream hosts here
const ALLOWED_HOSTS = [
  "owrcovcrpy.gpcdn.net",
  "byphdgllyk.gpcdn.net",
  "tvsen7.aynaott.com",
  "tvsen5.aynaott.com",
  "198.195.239.50",
  "27.124.71.27",
  "210.4.72.204",
  "gpcdn.net",
  "aynaott.com",
  "ncare.live",
];

function isAllowedHost(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return ALLOWED_HOSTS.some(
      (allowed) => hostname === allowed || hostname.endsWith("." + allowed),
    );
  } catch {
    return false;
  }
}

/**
 * Rewrites a relative or absolute URL found in an M3U8 playlist
 * so that it goes through this proxy instead of the origin server.
 */
function rewriteM3u8Line(line: string, baseUrl: string): string {
  const trimmed = line.trim();

  // Skip empty lines, comments, and EXT tags (except URI= values inside tags)
  if (
    trimmed === "" ||
    (trimmed.startsWith("#") && !trimmed.includes("URI="))
  ) {
    // Handle URI= attributes inside tags like #EXT-X-KEY and #EXT-X-MAP
    return line.replace(/URI="([^"]+)"/g, (_, uri) => {
      const absolute = resolveUrl(uri, baseUrl);
      return `URI="/api/stream?url=${encodeURIComponent(absolute)}"`;
    });
  }

  // Lines that are segment URLs (not starting with #)
  if (!trimmed.startsWith("#")) {
    const absolute = resolveUrl(trimmed, baseUrl);
    return `/api/stream?url=${encodeURIComponent(absolute)}`;
  }

  return line;
}

function resolveUrl(url: string, base: string): string {
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 },
    );
  }

  // Decode in case it was double-encoded
  const decodedUrl = decodeURIComponent(targetUrl);

  if (!isAllowedHost(decodedUrl)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const upstream = await fetch(decodedUrl, {
      headers: {
        // Some servers require a Referer / User-Agent
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: new URL(decodedUrl).origin + "/",
        Origin: new URL(decodedUrl).origin,
      },
      // Do not follow redirects automatically so we can proxy them too
      redirect: "follow",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${upstream.status}` },
        { status: upstream.status },
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "";

    // --- M3U8 Playlist: rewrite URLs ---
    if (
      decodedUrl.includes(".m3u8") ||
      contentType.includes("mpegurl") ||
      contentType.includes("x-mpegURL")
    ) {
      const text = await upstream.text();
      const lines = text.split("\n");
      const rewritten = lines.map((line) => rewriteM3u8Line(line, decodedUrl));
      const body = rewritten.join("\n");

      return new NextResponse(body, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache",
        },
      });
    }

    // --- Binary segment / other content: stream through ---
    const buffer = await upstream.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType || "video/MP2T",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
      },
    });
  } catch (err) {
    console.error("[Stream Proxy] Error fetching upstream:", err);
    return NextResponse.json(
      { error: "Failed to fetch stream" },
      { status: 500 },
    );
  }
}
