export interface Channel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
}

export const channels: Channel[] = [
  {
    id: "001",
    name: "BTV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Bangladesh_Television_Logo.svg/1280px-Bangladesh_Television_Logo.svg.png",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8",
  },
  {
    id: "002",
    name: "Somoy TV",
    logo: "https://dl.dropbox.com/s/leielj83em5kg7h/somoy_news.png",
    streamUrl: "https://tvsen6.aynaott.com/somoytv/index.m3u8",
  },
  {
    id: "003",
    name: "Ekattor TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/5/57/Ekattor_TV_logo.svg",
    streamUrl: "https://tvsen6.aynaott.com/ekattorbdtv/index.m3u8",
  },
  {
    id: "004",
    name: "Channel 24",
    logo: "https://vectorseek.com/wp-content/uploads/2023/07/Channel-24-Logo-Vector.svg--300x300.png",
    streamUrl: "https://tvsen6.aynaott.com/channel24/index.m3u8",
  },
  {
    id: "005",
    name: "Independent TV",
    logo: "https://dl.dropbox.com/s/7xwwb8hetz3w8rp/independent_tv.png",
    streamUrl: "https://tvsen6.aynaott.com/independenttv/index.m3u8",
  },
  {
    id: "006",
    name: "Jamuna TV",
    logo: "https://dl.dropbox.com/s/k7z1dsec1jfjbkn/jamuna_tv_bd.png",
    streamUrl: "https://tvsen6.aynaott.com/jamunatv/index.m3u8",
  },
  {
    id: "007",
    name: "ATN News",
    logo: "https://dl.dropbox.com/s/4ldi1dp09s8o6bm/atn_news_bd.png",
    streamUrl: "https://tvsen6.aynaott.com/atnnews/index.m3u8",
  },
  {
    id: "008",
    name: "Ekushey TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/Ekushey_Television_Logo.svg/1280px-Ekushey_Television_Logo.svg.png",
    streamUrl: "https://tvsen6.aynaott.com/etv/index.m3u8",
  },
  {
    id: "009",
    name: "Bangla Vision",
    logo: "https://s4.gifyu.com/images/image5c0bfa6b281be803.png",
    streamUrl: "https://tvsen5.aynaott.com/banglavision/index.m3u8",
  },
  {
    id: "010",
    name: "Channel I",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaDZsPsPGp3Za5iMiQHPZtzQxvm3MOQ3F0rQ&s",
    streamUrl: "https://tvsen6.aynaott.com/channeli/index.m3u8",
  },
  {
    id: "011",
    name: "Deepto TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/0/00/Logo_of_Deepto_TV.svg/1280px-Logo_of_Deepto_TV.svg.png",
    streamUrl: "https://tvsen5.aynaott.com/DeeptoTVHD/index.m3u8",
  },
  {
    id: "012",
    name: "Maasranga TV",
    logo: "https://mail.maasranga.tv/public/customize/newImage/logo.png",
    streamUrl: "https://tvsen5.aynaott.com/maasrangatv/index.m3u8",
  },
  {
    id: "013",
    name: "NTV",
    logo: "https://i.postimg.cc/g27Qp4RD/Background-Eraser-20240628-105829130.png",
    streamUrl: "https://tvsen5.aynaott.com/ntvbd/index.m3u8",
  },
  {
    id: "014",
    name: "Nagorik TV",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJFA8BRgzgG3mZkwOsk2oY37Z6xqTTMiDQ1w&s",
    streamUrl: "http://198.195.239.50:8095/nagorik/tracks-v1a1/mono.m3u8",
  },
  {
    id: "015",
    name: "T Sports",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/T_Sports_logo.svg/3840px-T_Sports_logo.svg.png",
    streamUrl: "https://tvsen7.aynaott.com/tsports-hd/tracks-v1a1/mono.ts.m3u8",
  },
  {
    id: "016",
    name: "T Sports Backup",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/T_Sports_logo.svg/3840px-T_Sports_logo.svg.png",
    streamUrl: "http://198.195.239.50:8095/Tsports/tracks-v1a1/mono.m3u8",
  },
  {
    id: "044",
    name: "T Sports Backup",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/T_Sports_logo.svg/3840px-T_Sports_logo.svg.png",
    streamUrl: "https://tvsen7.aynaott.com/tsports-hd/index.m3u8",
  },
  {
    id: "017",
    name: "Gazi TV",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Logo_of_GTV_%28Bangladesh%29.svg/1280px-Logo_of_GTV_%28Bangladesh%29.svg.png",
    streamUrl: "https://tvsen5.aynaott.com/Ravc7gPCZpxk/index.m3u8",
  },
  {
    id: "018",
    name: "Live Sports 1",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPCvTmUhiKDs4ehoVpFLh7xwdCNK2-N_gNFqnaOM4YRQ&s=10",
    streamUrl: "https://tvsen7.aynaott.com/sspts1/tracks-v1a1/mono.ts.m3u8",
  },
  {
    id: "019",
    name: "Live Sports 2",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPCvTmUhiKDs4ehoVpFLh7xwdCNK2-N_gNFqnaOM4YRQ&s=10",
    streamUrl: "http://198.195.239.50:8095/Eurosport/index.m3u8",
  },
  {
    id: "020",
    name: "Live Sports 3",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPCvTmUhiKDs4ehoVpFLh7xwdCNK2-N_gNFqnaOM4YRQ&s=10",
    streamUrl: "http://27.124.71.27/Willow_Extra/index.m3u8",
  },
  {
    id: "021",
    name: "Channel 9",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Channel%209.png",
    streamUrl: "https://tvsen6.aynaott.com/channel9/index.m3u8",
  },
  {
    id: "022",
    name: "Green TV",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Green%20TV.png",
    streamUrl: "https://app.ncare.live/c3VydmVyX8RpbEU9Mi8xNy8yMDE0GIDU6RgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcGVMZEJCTEFWeVN3PTOmdFsaWRtaW51aiPhnPTI2/greentv.stream/live-orgin/greentv.stream/chunks.m3u8",
  },
  {
    id: "023",
    name: "Star News",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbR09TSfkHvCcgyT1HiLyzgvGU1TOsNJf_ZA&s",
    streamUrl: "https://owrcovcrpy.gpcdn.net/bpk-tv/1710/output/1701.m3u8",
  },
  {
    id: "024",
    name: "News 24",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/main/News%2024.png",
    streamUrl: "https://tvsen6.aynaott.com/news24/index.m3u8",
  },
  {
    id: "025",
    name: "DBC News",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/main/DBC%20News.png",
    streamUrl: "https://tvsen6.aynaott.com/dbcnews/index.m3u8",
  },
  {
    id: "026",
    name: "Sony Aath",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/56e54462053b1b278b80b532c89c01f17e360fd5/Sony%20Aath.jpeg",
    streamUrl: "https://edge2.roarzone.net:8447/roarzone/edge3/sonyaath/index.m3u8",
  },
  {
    id: "027",
    name: "Jalsha Movies",
    logo: "https://e7.pngegg.com/pngimages/535/809/png-clipart-jalsha-movies-star-jalsha-television-show-star-india-sitarhd-purple-television.png",
    streamUrl: "http://198.195.239.50:8095/JalshaMovies/tracks-v1a1/mono.m3u8",
  },
  {
    id: "028",
    name: "Colors Bangla Cinema",
    logo: "https://raw.githubusercontent.com/subirkumarpaul/Logo/main/Colors%20Bangla%20Cinema.png",
    streamUrl: "http://198.195.239.50:8095/ColorsBanglaChinema/tracks-v1a1/mono.m3u8",
  },
  {
    id: "029",
    name: "Desh TV",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/25/Desh_tv_logo.jpg",
    streamUrl: "https://tvsen6.aynaott.com/deshtv/index.m3u8",
  },
  {
    id: "030",
    name: "PTV Sports",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/PTV_Sports.png/250px-PTV_Sports.png",
    streamUrl: "https://tvsen5.aynaott.com/PtvSports/tracks-v1a1/mono.ts.m3u8",
  },
  {
    id: "031",
    name: "ATN Bangla",
    logo: "https://s3.aynaott.com/storage/eff41809fca04f7c1da5481e135d7913",
    streamUrl: "https://tvsen5.aynaott.com/atnbangla/index.m3u8",
  },
  {
    id: "032",
    name: "Willow",
    logo: "https://s3.aynaott.com/storage/94a778ec3219f7eb54bdf1ee07a95788",
    streamUrl: "https://tvsen5.aynaott.com/willowhd/index.m3u8",
  },

  {
    id: "033",
    name: "RTV",
    streamUrl: "https://tvsen5.aynaott.com/RtvHD/index.m3u8",
    logo: "https://s3.aynaott.com/storage/094587a26f2c5e4f2962104728ec8c5d",

  },

  {
    id: "034",
    name: "Asian TV",
    streamUrl: "https://tvsen6.aynaott.com/asiantv/index.m3u8",
    logo: "https://s3.aynaott.com/storage/5282cec3a2e9349b750540d658cf1b6c",
  },
  {
    id: "035",
    name: "SA TV",
    streamUrl: "https://tvsen6.aynaott.com/satv/index.m3u8",
    logo: "https://s3.aynaott.com/storage/f710d2ff532cb7e7b75566232c5b72d3",
  },
  {
    id: "036",
    name: "Bangla TV",
    streamUrl: "https://tvsen6.aynaott.com/banglatv/index.m3u8",
    logo: "https://s3.aynaott.com/storage/e42ecfa90e3d6b15bdb7fea5ef673864",
  },

  {
    id: "037",
    name: "Ekhon TV",
    streamUrl: "https://tvsen6.aynaott.com/ekhontv/index.m3u8",
    logo: "https://s3.aynaott.com/storage/274c30c492e8795c8011d0129113f4bc",
  },

  {
    id: "038",
    name: "Duronto TV",
    streamUrl: "https://tvsen6.aynaott.com/durontotv-live/index.m3u8",
    logo: "https://s3.aynaott.com/storage/51f1530c076c027e431bf18a49613f0b",
  },

   {
    id: "039",
    name: "Disney Channel",
    streamUrl: "https://tvsen7.aynaott.com/disney/index.m3u8",
    logo: "https://s3.aynaott.com/storage/a0c74b576321da5aa33a69806401caf1",
  },

  {
    id: "040",
    name: "Sangeet Bangla",
    streamUrl: "https://cdn-4.pishow.tv/live/1143/master.m3u8",
    logo: "https://s3.aynaott.com/storage/80424ce0682e14e7d51e28de33d5f380",
  },{
    id: "041",
    name: "G Series Drama",
    streamUrl: "https://vods2.aynaott.com/gseriesDrama/tracks-v1a1/mono.ts.m3u8",
    logo: "https://raw.githubusercontent.com/Rakib49/Rakibiptv/main/images%20(7).jpeg",
  },
];