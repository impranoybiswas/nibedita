// --- TypeScript Types ---
export type ChannelCategory = "bdtv" | "news" | "sports" | "entertainment";

export const CATEGORY_LABELS: Record<ChannelCategory, string> = {
  bdtv: "BD TV",
  news: "News",
  sports: "Sports",
  entertainment: "Entertainment",
};

export interface Channel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  category: ChannelCategory;
}

// --- Channel Data ---
// NOTE: HTTP stream URLs may be blocked on Vercel (mixed content).
//       Proxy via /api/stream recommended for those entries.
export const channels: Channel[] = [
  // ── BD TV ──────────────────────────────────────────────────────────────────
  {
    id: "001",
    name: "BTV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Bangladesh_Television_Logo.svg/1280px-Bangladesh_Television_Logo.svg.png",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8",
    category: "bdtv",
  },
  {
    id: "008",
    name: "Ekushey TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Ekushey_Television_Logo.svg/1280px-Ekushey_Television_Logo.svg.png",
    streamUrl: "https://tvsen6.aynaott.com/etv/index.m3u8",
    category: "bdtv",
  },
  {
    id: "009",
    name: "Bangla Vision",
    logo: "https://s4.gifyu.com/images/image5c0bfa6b281be803.png",
    streamUrl: "https://tvsen5.aynaott.com/banglavision/index.m3u8",
    category: "bdtv",
  },
  {
    id: "010",
    name: "Channel I",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaDZsPsPGp3Za5iMiQHPZtzQxvm3MOQ3F0rQ&s",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1723/output/index.m3u8",
    category: "bdtv",
  },
  {
    id: "011",
    name: "Deepto TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/00/Logo_of_Deepto_TV.svg/1280px-Logo_of_Deepto_TV.svg.png",
    streamUrl: "https://byphdgllyk.gpcdn.net/hls/deeptotv/0_1/index.m3u8",
    category: "bdtv",
  },
  {
    id: "012",
    name: "Maasranga TV",
    logo: "https://mail.maasranga.tv/public/customize/newImage/logo.png",
    streamUrl: "https://tvsen5.aynaott.com/maasrangatv/index.m3u8",
    category: "bdtv",
  },
  {
    id: "013",
    name: "NTV",
    logo: "https://i.postimg.cc/g27Qp4RD/Background-Eraser-20240628-105829130.png",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/index.m3u8",
    category: "bdtv",
  },
  {
    id: "014",
    name: "Nagorik TV",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJFA8BRgzgG3mZkwOsk2oY37Z6xqTTMiDQ1w&s",
    // ⚠ HTTP URL — will fail on Vercel; route through /api/stream proxy
    streamUrl: "http://198.195.239.50:8095/nagorik/tracks-v1a1/mono.m3u8",
    category: "bdtv",
  },
  {
    id: "017",
    name: "Gazi TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Logo_of_GTV_%28Bangladesh%29.svg/1280px-Logo_of_GTV_%28Bangladesh%29.svg.png",
    streamUrl: "https://tvsen5.aynaott.com/Ravc7gPCZpxk/index.m3u8",
    category: "bdtv",
  },
  {
    id: "021",
    name: "Channel 9",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Channel%209.png",
    streamUrl: "https://tvsen6.aynaott.com/channel9/index.m3u8",
    category: "bdtv",
  },
  {
    id: "022",
    name: "Green TV",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Green%20TV.png",
    streamUrl:
      "https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/greentv.stream/live-orgin/greentv.stream/chunks.m3u8",
    category: "bdtv",
  },
  {
    id: "029",
    name: "Desh TV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/25/Desh_tv_logo.jpg",
    streamUrl: "https://tvsen6.aynaott.com/deshtv/index.m3u8",
    category: "bdtv",
  },
  {
    id: "031",
    name: "ATN Bangla",
    logo: "https://s3.aynaott.com/storage/eff41809fca04f7c1da5481e135d7913",
    streamUrl: "https://tvsen5.aynaott.com/atnbangla/index.m3u8",
    category: "bdtv",
  },
  {
    id: "033",
    name: "RTV",
    logo: "https://s3.aynaott.com/storage/094587a26f2c5e4f2962104728ec8c5d",
    streamUrl: "https://tvsen5.aynaott.com/RtvHD/index.m3u8",
    category: "bdtv",
  },
  {
    id: "034",
    name: "Asian TV",
    logo: "https://yt3.googleusercontent.com/h7Q4IqpBLVNfIoU6c11UQfGK0V_3uPFYt8BvvFhReTwwjdiBzJ0A9oUeFnrPG6fyWlY24R8DeNo=s900-c-k-c0x00ffffff-no-rj",
    streamUrl: "https://tvsen6.aynaott.com/asiantv/index.m3u8",
    category: "bdtv",
  },
  {
    id: "035",
    name: "SA TV",
    logo: "https://www.satv.tv/wp-content/uploads/2021/08/satv-logo-1.jpg",
    streamUrl: "https://tvsen6.aynaott.com/satv/index.m3u8",
    category: "bdtv",
  },
  {
    id: "036",
    name: "Bangla TV",
    logo: "https://s3.aynaott.com/storage/e42ecfa90e3d6b15bdb7fea5ef673864",
    streamUrl: "https://tvsen6.aynaott.com/banglatv/index.m3u8",
    category: "bdtv",
  },
  {
    id: "037",
    name: "Ekhon TV",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKyWxTM9UnEzKhY_fV51zRmG49ienYPjYnpQ&s",
    streamUrl: "https://tvsen6.aynaott.com/ekhontv/index.m3u8",
    category: "bdtv",
  },
  {
    id: "042",
    name: "Bijoy TV",
    logo: "https://assets-prod.services.toffeelive.com/bns4l5sBcqxnFHJBVZ32/posters/feaf9f3d-cc3b-4a3d-81a3-2cb703e561eb.png",
    streamUrl: "https://tvsen6.aynaott.com/bijoytv/index.m3u8",
    category: "bdtv",
  },
  {
    id: "043",
    name: "Global TV",
    logo: "https://assets-prod.services.toffeelive.com/0y_tDJsBNnOkwJLWNrdE/posters/2ff058e1-630f-4657-8dc6-b677e65642c5.png",
    streamUrl: "https://tvsen6.aynaott.com/globaltvhd/tracks-v1a1/mono.ts.m3u8",
    category: "bdtv",
  },

  // ── News ───────────────────────────────────────────────────────────────────
  {
    id: "002",
    name: "Somoy TV",
    logo: "https://dl.dropbox.com/s/leielj83em5kg7h/somoy_news.png",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1702/output/index.m3u8",
    category: "news",
  },
  {
    id: "003",
    name: "Ekattor TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/57/Ekattor_TV_logo.svg",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1705/output/index.m3u8",
    category: "news",
  },
  {
    id: "004",
    name: "Channel 24",
    logo: "https://vectorseek.com/wp-content/uploads/2023/07/Channel-24-Logo-Vector.svg--300x300.png",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1703/output/index.m3u8",
    category: "news",
  },
  {
    id: "005",
    name: "Independent TV",
    logo: "https://dl.dropbox.com/s/7xwwb8hetz3w8rp/independent_tv.png",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1704/output/index.m3u8",
    category: "news",
  },
  {
    id: "006",
    name: "Jamuna TV",
    logo: "https://dl.dropbox.com/s/k7z1dsec1jfjbkn/jamuna_tv_bd.png",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1701/output/index.m3u8",
    category: "news",
  },
  {
    id: "007",
    name: "ATN News",
    logo: "https://dl.dropbox.com/s/4ldi1dp09s8o6bm/atn_news_bd.png",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1706/output/index.m3u8",
    category: "news",
  },
  {
    id: "023",
    name: "Star News",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbR09TSfkHvCcgyT1HiLyzgvGU1TOsNJf_ZA&s",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1710/output/1701.m3u8",
    category: "news",
  },
  {
    id: "024",
    name: "News 24",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/main/News%2024.png",
    streamUrl: "https://tvsen6.aynaott.com/news24/index.m3u8",
    category: "news",
  },
  {
    id: "025",
    name: "DBC News",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/main/DBC%20News.png",
    streamUrl: "https://tvsen6.aynaott.com/dbcnews/index.m3u8",
    category: "news",
  },

  // ── Sports ─────────────────────────────────────────────────────────────────
  {
    id: "015",
    name: "T Sports",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/T_Sports_logo.svg/3840px-T_Sports_logo.svg.png",
    streamUrl: "https://tvsen7.aynaott.com/tsports-hd/tracks-v1a1/mono.ts.m3u8",
    category: "sports",
  },
  {
    id: "016",
    name: "T Sports (Mirror 1)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/T_Sports_logo.svg/3840px-T_Sports_logo.svg.png",
    // ⚠ HTTP URL — proxy recommended
    streamUrl: "http://198.195.239.50:8095/Tsports/tracks-v1a1/mono.m3u8",
    category: "sports",
  },
  {
    id: "016b",
    name: "T Sports (Mirror 2)",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/T_Sports_logo.svg/3840px-T_Sports_logo.svg.png",
    streamUrl: "https://tvsen7.aynaott.com/tsports-hd/index.m3u8",
    category: "sports",
  },
  {
    id: "018",
    name: "Live Sports 1",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPCvTmUhiKDs4ehoVpFLh7xwdCNK2-N_gNFqnaOM4YRQ&s=10",
    streamUrl: "https://tvsen7.aynaott.com/sspts1/tracks-v1a1/mono.ts.m3u8",
    category: "sports",
  },
  {
    id: "019",
    name: "Live Sports 2",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPCvTmUhiKDs4ehoVpFLh7xwdCNK2-N_gNFqnaOM4YRQ&s=10",
    // ⚠ HTTP URL — proxy recommended
    streamUrl: "http://198.195.239.50:8095/Eurosport/index.m3u8",
    category: "sports",
  },
  {
    id: "050",
    name: "FIFA 1",
    logo: "https://pngimg.com/uploads/fifa/fifa_PNG26.png",
    streamUrl:
      "https://a62dad94.wurl.com/manifest/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWV1X0ZJRkFQbHVzRW5nbGlzaF9ITFM/39081f3a-49dd-4b90-b4e6-5b6d4c953fd0/2.m3u8",
    category: "sports",
  },
  {
    id: "051",
    name: "FIFA 2",
    logo: "https://pngimg.com/uploads/fifa/fifa_PNG26.png",
    streamUrl:
      "https://37b4c228.wurl.com/manifest/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWZyX0ZJRkFQbHVzRnJlbmNoX0hMUw/6f5437c5-e015-4754-8476-c8c6d27d3a55/1.m3u8",
    category: "sports",
  },
  {
    id: "052",
    name: "FIFA 3",
    logo: "https://pngimg.com/uploads/fifa/fifa_PNG26.png",
    streamUrl:
      "https://4397879b.wurl.com/manifest/f36d25e7e52f1ba8d7e56eb859c636563214f541/UmFrdXRlblRWLWRlX0ZJRkFQbHVzR2VybWFuX0hMUw/3312c83f-2ec4-4d31-a14c-6e21faae560d/2.m3u8",
    category: "sports",
  },
  {
    id: "053",
    name: "FIFA 4",
    logo: "https://pngimg.com/uploads/fifa/fifa_PNG26.png",
    streamUrl:
      "https://d2w9q46ikgrcwx.cloudfront.net/v1/manifest/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-of5cbk3sav3w5/845316b3-e102-41c5-809d-68199472c0d5/3.m3u8",
    category: "sports",
  },
  {
    id: "020",
    name: "Live Sports 3",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPCvTmUhiKDs4ehoVpFLh7xwdCNK2-N_gNFqnaOM4YRQ&s=10",
    // ⚠ HTTP URL — proxy recommended
    streamUrl: "http://27.124.71.27/Willow_Extra/index.m3u8",
    category: "sports",
  },
  {
    id: "030",
    name: "PTV Sports",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/PTV_Sports.png/250px-PTV_Sports.png",
    streamUrl: "https://tvsen5.aynaott.com/PtvSports/tracks-v1a1/mono.ts.m3u8",
    category: "sports",
  },
  {
    id: "032",
    name: "Willow",
    logo: "https://photos.prnewswire.com/prnfull/20160229/338826LOGO",
    streamUrl: "https://tvsen5.aynaott.com/willowhd/index.m3u8",
    category: "sports",
  },
  {
    id: "044",
    name: "ESPN",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/60/ESPN_logos.png",
    streamUrl: "https://tvsen5.aynaott.com/espn/tracks-v1a1/mono.ts.m3u8",
    category: "sports",
  },
  {
    id: "046",
    name: "Live Sports 4",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPCvTmUhiKDs4ehoVpFLh7xwdCNK2-N_gNFqnaOM4YRQ&s=10",
    streamUrl: "https://bein-esp-xumo.amagi.tv/playlistR1080p.m3u8",
    category: "sports",
  },
  {
    id: "047",
    name: "Live Sports 5",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPCvTmUhiKDs4ehoVpFLh7xwdCNK2-N_gNFqnaOM4YRQ&s=10",
    streamUrl: "https://andro.226503.xyz/checklist/androstreamlivebs3.m3u8",
    category: "sports",
  },
  {
    id: "048",
    name: "Live Sports 6",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPCvTmUhiKDs4ehoVpFLh7xwdCNK2-N_gNFqnaOM4YRQ&s=10",
    streamUrl: "https://andro.226503.xyz/checklist/androstreamlivebs4.m3u8",
    category: "sports",
  },

  // ── Entertainment ──────────────────────────────────────────────────────────
  {
    id: "026",
    name: "Sony Aath",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/56e54462053b1b278b80b532c89c01f17e360fd5/Sony%20Aath.jpeg",
    streamUrl:
      "https://edge2.roarzone.net:8447/roarzone/edge3/sonyaath/index.m3u8",
    category: "entertainment",
  },
  {
    id: "027",
    name: "Jalsha Movies",
    logo: "https://static.wikia.nocookie.net/etv-gspn-bangla/images/6/69/Jalsha_Movies_HD_alt.png",
    // ⚠ HTTP URL — proxy recommended
    streamUrl: "http://198.195.239.50:8095/JalshaMovies/tracks-v1a1/mono.m3u8",
    category: "entertainment",
  },
  {
    id: "028",
    name: "Colors Bangla Cinema",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Colors%20Bangla%20Cinema.png",
    // ⚠ HTTP URL — proxy recommended
    streamUrl:
      "http://198.195.239.50:8095/ColorsBanglaChinema/tracks-v1a1/mono.m3u8",
    category: "entertainment",
  },
  {
    id: "038",
    name: "Duronto TV",
    logo: "https://s3.aynaott.com/storage/51f1530c076c027e431bf18a49613f0b",
    streamUrl: "https://tvsen6.aynaott.com/durontotv-live/index.m3u8",
    category: "entertainment",
  },
  {
    id: "039",
    name: "Disney Channel",
    logo: "https://s3.aynaott.com/storage/a0c74b576321da5aa33a69806401caf1",
    streamUrl: "https://tvsen7.aynaott.com/disney/index.m3u8",
    category: "entertainment",
  },
  {
    id: "040",
    name: "Sangeet Bangla",
    logo: "https://s3.aynaott.com/storage/80424ce0682e14e7d51e28de33d5f380",
    streamUrl: "https://cdn-4.pishow.tv/live/1143/master.m3u8",
    category: "entertainment",
  },
  {
    id: "041",
    name: "G Series Drama",
    logo: "https://raw.githubusercontent.com/Rakib49/Rakibiptv/main/images%20(7).jpeg",
    streamUrl:
      "https://vods2.aynaott.com/gseriesDrama/tracks-v1a1/mono.ts.m3u8",
    category: "entertainment",
  },
  {
    id: "045",
    name: "Gopal Bhar",
    logo: "https://cf-img-a-in.tosshub.com/sites/visualstory/wp/2025/02/GopalITG-1739292904624.jpg",
    streamUrl:
      "https://live20.bozztv.com/giatvplayout7/giatv-209611/tracks-v1a1/mono.ts.m3u8",
    category: "entertainment",
  },
  {
    id: "049",
    name: "Sony Movies",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKRmw0TG8nelaOLgOphjuIlocQ9lj2rDOb1g&s",
    streamUrl: "https://a-cdn.klowdtv.com/live1/smc_720p/chunks.m3u8",
    category: "entertainment",
  },
];

// --- Utility helpers ---

/** Get unique categories that actually have channels */
export const getCategories = (): ChannelCategory[] =>
  Array.from(new Set(channels.map((ch) => ch.category)));

/** Find a channel by id (undefined-safe) */
export const getChannelById = (id: string): Channel | undefined =>
  channels.find((ch) => ch.id === id);

/** Filter channels by category */
export const getChannelsByCategory = (cat: ChannelCategory): Channel[] =>
  channels.filter((ch) => ch.category === cat);
