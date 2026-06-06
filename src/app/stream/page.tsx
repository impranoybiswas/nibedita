export const runtime = "edge";

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
  "vods2.aynaott.com",
  "dzkyvlfyge.erbvr.com",
  "server.thelegitpro.in",
  "edge2.roarzone.net",
  "dbcanada.sonarbanglatv.com",
  "5dd3981940faa.streamlock.net",
  "d3qs3d2rkhfqrt.cloudfront.net",
  "live-bangla.akamaized.net",
  "yupptvcatchupire.yuppcdn.net",
  "live-hls-apps-aje-fa.getaj.net",
  "dwamdstream102.akamaized.net",
  "d7x8z4yuq42qn.cloudfront.net",
  "tv-trtworld.medya.trt.com.tr",
  "kwtsplta.cdn.mangomolo.com",
  "d4ddgdmj1cvnm.cloudfront.net",
  "xumo-xumoent-vc-122-sjv70.fast.nbcuni.com",
  "moviesphereuk-samsunguk.amagi.tv",
  "247wlive.foxweather.com",
  "cdn-ue1-prod.tsv2.amagi.tv",
  "linear-493.frequency.stream",
  "37b4c228.wurl.com",
];

function isAllowedHost(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return ALLOWED_HOSTS.some(
      (h) => hostname === h || hostname.endsWith(`.${h}`)
    );
  } catch {
    return false;
  }
}

function resolveUrl(url: string, base: string): string {
  try {
    return new URL(url, base).toString();
  } catch {
    return url;
  }
}

function rewriteM3U8(line: string, baseUrl: string): string {
  const trimmed = line.trim();

  if (trimmed.includes('URI="')) {
    return line.replace(/URI="([^"]+)"/g, (_, uri) => {
      const abs = resolveUrl(uri, baseUrl);
      return `URI="/api/stream?url=${encodeURIComponent(abs)}"`;
    });
  }

  if (trimmed.startsWith("#")) return line;

  if (trimmed.length > 0) {
    const abs = resolveUrl(trimmed, baseUrl);
    return `/api/stream?url=${encodeURIComponent(abs)}`;
  }

  return line;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const decodedUrl = decodeURIComponent(url);

  if (!isAllowedHost(decodedUrl)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 });
  }

  try {
    const upstream = await fetch(decodedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        Referer: new URL(decodedUrl).origin + "/",
        Origin: new URL(decodedUrl).origin,
        Accept: "*/*",
        "Accept-Encoding": "identity", // Edge-এ compression avoid করুন
      },
      redirect: "follow",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: `Upstream error ${upstream.status}` },
        { status: upstream.status }
      );
    }

    const contentType = upstream.headers.get("content-type") || "";

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
          "Cache-Control": "no-cache, no-store",
        },
      });
    }

    // TS/MP4 segments — Edge Runtime-এ stream করা যায়
    // upstream.body সরাসরি pass করুন, buffer করবেন না
    return new NextResponse(upstream.body, {
      headers: {
        "Content-Type": contentType || "video/MP2T",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
        // Content-Length থাকলে রাখুন
        ...(upstream.headers.get("content-length")
          ? { "Content-Length": upstream.headers.get("content-length")! }
          : {}),
      },
    });
  } catch (err) {
    console.error("[Stream Proxy Error]", err);
    return NextResponse.json({ error: "Stream fetch failed" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Range",
    },
  });
}