export type RiskLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Vessel {
  id: string;
  imo: string;
  name: string;
  flag: string;
  type: string;
  emoji: string;
  riskScore: number;
  speed: string;
  destination: string;
  reportedDestination: string;
  origin: string;
  atd: string;
  draught: string;
  status: string;
  eta: string;
  lat: number;
  lng: number;
  heading: number;
  currentPosition: string;
}

export interface RiskZone {
  id: string;
  name: string;
  reason: string;
  riskLevel: RiskLevel;
  lat: number;
  lng: number;
  radius: number;
  category: 'Geopolitical' | 'Weather' | 'Operational';
}

export interface WeatherStation {
  id: string;
  location: string;
  temp: string;
  wind: string;
  waves: string;
  visibility: string;
}

export interface Port {
  name: string;
  region: string;
  congestion: 'Low' | 'Medium' | 'High' | 'Severe';
  ships: number;
  wait: string;
  risk: number;
}

export interface Route {
  from: string;
  to: string;
  risk: number;
}

// ─── ALL WORLD PORTS (from Ceha Lojistik port list, A–Z by country) ─────────

export const WORLD_PORT_NAMES: string[] = [
  // ALASKA
  'CARDOVA', 'VALDEZ',
  // ALBANIA
  'DURRES', 'VLORE',
  // ALGERIA
  'ALGIERS', 'ANNABA', 'BERJAIA', 'ORAN', 'SKIKDA',
  // ANGOLA
  'LOBITO', 'LUANDA',
  // ANTIGUA
  'ST. JOHNS',
  // ARGENTINA
  'BAHIA BLANKA', 'BUENOS AIRES', 'CORDOBA', 'MENDOZA', 'ROSARIO', 'SAN PEDRO', 'USHUAIA',
  // ARUBA
  'ORANJESTAD',
  // AFGHANISTAN
  'KABUL', 'HAIRATAN', 'TORGHUNDI',
  // AUSTRALIA
  'ADELAIDE', 'BELLBAY', 'BRISBANE', 'BROOME', 'BURNIE', 'DAMPIER', 'DARWIN',
  'FREMANTLE', 'GERALDTON', 'GLADSTONE', 'HOBART', 'MELBOURNE', 'PORT HEDLAND', 'SYDNEY', 'TOWNSVILLE',
  // AUSTRIA
  'VIENNA',
  // BAHAMAS
  'NASSAU',
  // BAHRAIN
  'MANAMA', 'UMM SAID',
  // BANGLADESH
  'CHITTAGONG', 'MONGLA',
  // BARBADOS
  'BRIDGETOWN',
  // BELIZE
  'BELIZE',
  // BENIN
  'COTONOU', 'PORT NOVO',
  // BRAZIL
  'ALTAMIRA', 'BELEM', 'BAHIA', 'FORTALEZA', 'ITAJAI', 'MACAPA', 'MANAUS',
  'PARANAGUA', 'PORTOALEGRE', 'RECIFE', 'RIO GRANDE', 'RIO DE JANEIRO',
  'SALVADOR', 'SAO FRANCISCO DO SUL', 'SANTOS', 'SUAPE', 'VITORIA',
  // BRUNEI
  'BRUNEI', 'KUALA BELAIT', 'MUARA',
  // BELGIUM
  'ANTWERP', 'BRUSSELS',
  // BULGARIA
  'BURGAS', 'SOFIA', 'VARNA',
  // CROATIA
  'RIJEKA',
  // CAMBODIA
  'SIHANOUKVILLE', 'PHNOM PENH',
  // CAMEROON
  'DOUALA',
  // CANADA
  'HALIFAX', 'MONTREAL', 'TORONTO', 'PRINCE RUPERT', 'VANCOUVER',
  // CANARY ISLANDS
  'LAS PALMAS', 'SANTA CRUZ DE TENERIFE', 'TENERIFE',
  // CAROLINE ISLANDS
  'TRUK', 'PONAPE',
  // CHILE
  'ANTOFAGASTA', 'ARICA', 'CHANARAL', 'IQUIQUE', 'LIRQUEN',
  'PUNTA ARENAS', 'SAN ANTONIO', 'SANTIAGO', 'TALCAHUANO', 'VALPARAISO',
  // CHINA
  'BEIHAI', 'DONG GUAN', 'DALIAN', 'FANCHENG', 'FOSHAN', 'FUZHOU',
  'GUANGZHOU', 'HAIKOU', 'HANGZHOU', 'HONG KONG', 'HUANGPU', 'XINGANG',
  'JIANGMEN', 'LIANYUNGANG', 'NANJING', 'NANTONG', 'NINGBO', 'QINGDAO',
  'QUANZHOU', 'SHANGHAI', 'SHANTOU', 'SHEKOU', 'SHENZHEN', 'SHAOXING',
  'SUZHOU', 'TIANJIN', 'WUXI', 'WUZHOU', 'WEIHAI', 'WUHU', 'WENZHOU',
  'WUHAN', 'XIAMEN', 'YANGZHOU', 'YANTAI', 'ZHANJIANG', 'ZHAOQING',
  'ZHUHAI', 'ZHANGJIAGANG',
  // COLOMBIA
  'BARRANQUILLA', 'BUENAVENTURA', 'CARTAGENA', 'SANTA MARTA',
  // COMOROS ISLANDS
  'MORONI', 'MUTSAMUDU',
  // CONGO
  'POINTE NOIRE',
  // COSTA RICA
  'PUERTO CALDERA', 'PUERTO LIMON', 'PUNTARENAS', 'SAN JOSE',
  // CUBA
  'HAVANA', 'MANZANILLO', 'MATANZAS',
  // CYPRUS
  'FAMAGUSTA', 'LARNACA', 'LIMASSOL',
  // CZECHOSLOVAKIA
  'PRAGUE',
  // DENMARK
  'AARHUS', 'COPENHAGEN', 'ESBJERG', 'SONDERBURG',
  // DJIBOUTI
  'DJIBOUTI',
  // DOMINICAN REPUBLIC
  'RIO HAINA', 'SANTO DOMINGO',
  // DOMINICA
  'ROSEAU',
  // ESTONIA
  'TALLINN',
  // ECUADOR
  'ESMERALDAS', 'GUAYAQUIL', 'MANTA',
  // EGYPT
  'ADABIYA', 'ALEXANDRIA', 'DAMIETTA', 'PORT SUEZ', 'PORT SAID',
  // EL SALVADOR
  'ACAJUTLA',
  // ETHIOPIA
  'ASSAB', 'MASSAWA',
  // FIJI
  'LAUTTOKA', 'SUVA',
  // FINLAND
  'HELSINKI', 'KOTKA', 'TURKU',
  // FRANCE
  'FOS', 'LE HAVRE', 'LYON', 'MARSEILLES', 'NANTES', 'PARIS',
  // GREECE
  'PIRAEUS', 'SALONICA', 'KAVALLA', 'PATRAI', 'THESSALONIKI', 'VOLOS',
  // GABON
  'LIBREVILLE', 'PORT GENTIL',
  // GAMBIA
  'BANJUL',
  // GERMANY
  'BREMEN', 'BREMERHAVEN', 'HAMBURG', 'LUDWIGSBURG', 'MUNICH', 'ROSTOCK', 'STUTTGART',
  // GHANA
  'SEKONDI', 'TAKORADI', 'TEMA',
  // GRENADA
  'ST. GEORGES',
  // GUATEMALA
  'PUERTO QUETZAL', 'SANTO TOMAS DE CASTILLA',
  // GUAM
  'GUAM',
  // GUINEA
  'BISSAU', 'CONAKRY',
  // GUYANA
  'GEORGETOWN', 'NEW AMSTERDAM',
  // HAITI
  'PORT-AU-PRINCE',
  // HAWAII
  'HONOLULU',
  // HONDURAS
  'PUERTO CORTES', 'SAN PEDRO SULA', 'SAN LORENZO',
  // HUNGARY
  'BUDAPEST',
  // ICELAND
  'REYKJAVIK',
  // IRELAND
  'BELFAST', 'CORK', 'DUBLIN', 'WEXFORD',
  // ITALY
  'ANCONA', 'BARI', 'BOLOGNA', 'CATANIA', 'GENOA', 'LA SPEZIA',
  'LIVORNO', 'MESSINA', 'MILAN', 'MONFALCONE', 'NAPLES', 'PALERMO',
  'RAVENNA', 'ROME', 'SALERNO', 'TARANTO', 'TRIESTE', 'TURIN', 'VENICE', 'VERONA',
  // IRAN
  'BANDAR ABBAS', 'BANDAR KHOMEINI', 'KISH ISLAND',
  // IRAQ
  'BAGHDAD', 'UMM QASR',
  // ISRAEL
  'ASHDOD', 'HAIFA',
  // INDIA
  'HALDIA', 'CHENNAI', 'COCHIN', 'ENNORE', 'JAWAHARLAL NEHRU PORT',
  'KANDLA', 'KOLKATA', 'MORMUGAO', 'MUMBAI', 'MUNDRA', 'NEW MANGALORE',
  'PARADEEP', 'PIPAVAV', 'PORT BLAIR', 'TUTICORIN', 'VISAKHAPATNAM',
  // INDONESIA
  'BALIKPAPAN', 'BANJARMASIN', 'BATU AMPAR', 'BELAWAN', 'BENGKULU',
  'CIREBON', 'JAKARTA', 'JAMBI', 'KUPANG', 'MEDAN', 'PADANG',
  'PALEMBANG', 'PANJANG', 'PEKAN BARU', 'PONTIANAK', 'SAMARINDA',
  'SAMPIT', 'SEMARANG', 'SURABAYA', 'UJUNG PANDANG',
  // IVORY COAST
  'ABIDJAN',
  // JAMAICA
  'KINGSTON',
  // JORDAN
  'AQABA',
  // JAPAN
  'CHIBA', 'HACHINOHE', 'HAKATA', 'HIROSHIMA', 'HITACHI', 'IMABARI',
  'IWAKI', 'KAGOSHIMA', 'KOBE', 'MIZUSHIMA', 'MOJI', 'NAGOYA', 'NAHA',
  'NIIGATA', 'OSAKA', 'SAKAI', 'SAKAIMINATO', 'SENDAI', 'SHIBUSHI',
  'SHIMIZU', 'TOKYO', 'TOMAKOMAI', 'TOYAMA', 'YOKKAICHI', 'YOKOHAMA',
  // KENYA
  'MOMBASA',
  // KOREA
  'PUSAN', 'INCHEON', 'CHONGJIN', 'NAMPO', 'PYONGYANG',
  // KUWAIT
  'KUWAIT',
  // LATVIA
  'RIGA',
  // LIBYA
  'BENGHAZI', 'MISRATAH', 'TRIPOLI',
  // LIBERIA
  'MONROVIA',
  // LEBANON
  'BEIRUT',
  // MALAYSIA
  'BINTULU', 'JOHOR BAHRU', 'KOTA KINABALU', 'KUANTAN', 'KUCHING',
  'LABUAN', 'LAHAD DATU', 'MIRI', 'PASIR GUDANG', 'PENANG',
  'PORT KELANG', 'SANDAKAN', 'SIBU', 'TAWAU',
  // MAURITANIA
  'NOUADHIBOU', 'NOUAKCHOTT',
  // MOROCCO
  'AGADIR', 'CASABLANCA', 'CEUTA', 'MELILLA',
  // MOZAMBIQUE
  'BEIRA', 'MAPUTO', 'NACALA',
  // MADAGASCAR
  'DIEGO SUAREZ', 'MAJUNGA', 'NOSY BE', 'TAMATAVE', 'TOLIARY',
  // MYANMAR
  'SITTWE', 'YANGON',
  // MALTA
  'VALLETTA',
  // MAURITIUS
  'PORT LOUIS',
  // MEXICO
  'ACAPULCO', 'ENSENADA', 'GUADALAJARA', 'LAZARO CARDENAS',
  'MEXICO CITY', 'SALINA CRUZ', 'TAMPICO', 'VERA CRUZ',
  // MALDIVES
  'MALE',
  // NAMIBIA
  'LUDERITZ', 'WALVIS BAY',
  // NETHERLANDS
  'AMSTERDAM', 'ROTTERDAM', 'FLUSHING',
  // NORWAY
  'BERGEN', 'OSLO', 'STAVANGER',
  // NIGERIA
  'APAPA', 'LAGOS', 'PORT HARCOURT', 'TINCAN ISLAND',
  // NEW ZEALAND
  'AUCKLAND', 'BLUFF', 'CHRISTCHURCH', 'DUNEDIN', 'LYTTELTON',
  'NAPIER', 'NELSON', 'NEW PLYMOUTH', 'PORT CHALMERS', 'TAURANGA', 'WELLINGTON',
  // NEW CALEDONIA
  'NOUMEA',
  // OMAN
  'MUSCAT', 'SALALAH',
  // PANAMA
  'BALBOA', 'COLON', 'CRISTOBAL', 'PANAMA CITY',
  // PERU
  'CALLAO',
  // PUERTO RICO
  'PONCE', 'SAN JUAN',
  // POLAND
  'GDANSK', 'GDYNIA', 'KATOWICE', 'KRAKOW', 'WARSAW',
  // PORTUGAL
  'LEIXOES', 'LISBON',
  // PAKISTAN
  'KARACHI',
  // PHILIPPINES
  'CEBU', 'DAVAO', 'GENERAL SANTOS', 'MANILA', 'ZAMBOANGA',
  // PAPUA NEW GUINEA
  'LAE', 'MADANG', 'PORT MORESBY', 'RABAUL',
  // QATAR
  'DOHA',
  // ROMANIA
  'CONSTANTA',
  // RUSSIA
  'MOSCOW', 'NAKHODKA', 'ROSTOV', 'SAINT PETERSBURG', 'VLADIVOSTOK',
  // SINGAPORE
  'SINGAPORE',
  // SENEGAL
  'DAKAR',
  // SIERRA LEONE
  'FREETOWN',
  // SOMALIA
  'BERBERA', 'MOGADISHU',
  // SUDAN
  'PORT SUDAN',
  // SPAIN
  'ALGECIRAS', 'ALICANTE', 'BARCELONA', 'BILBAO', 'MADRID',
  'MALAGA', 'PALMA DE MALLORCA', 'PASAJES', 'VALENCIA', 'VIGO',
  // SWEDEN
  'GOTHENBURG', 'HELSINGBORG', 'MALMO', 'STOCKHOLM',
  // SWITZERLAND
  'BASEL', 'GENEVA', 'ZURICH',
  // SYRIA
  'LATTAKIA',
  // SAUDI ARABIA
  'AL JUBAIL', 'DAMMAM', 'JEDDAH', 'RIYADH',
  // SRI LANKA
  'COLOMBO',
  // SOUTH AFRICA
  'CAPE TOWN', 'DURBAN', 'EAST LONDON', 'JOHANNESBURG', 'PORT ELIZABETH', 'RICHARDS BAY',
  // TRINIDAD
  'POINT LISAS', 'PORT OF SPAIN',
  // TUNISIA
  'BIZERTE', 'GABES', 'SFAX', 'RADES', 'TUNIS',
  // TURKEY
  'ANTALYA', 'DERINCE', 'ISKENDERUN', 'ISTANBUL', 'IZMIR', 'MERSIN', 'TRABZON',
  // TAIWAN
  'KAOHSIUNG', 'KEELUNG', 'TAICHUNG', 'TAIPEI',
  // THAILAND
  'BANGKOK', 'LAEM CHABANG', 'SONGKHLA',
  // TANZANIA
  'DAR ES SALAAM', 'TANGA', 'ZANZIBAR',
  // TOGO
  'LOME',
  // USA (selected major ports)
  'BALTIMORE', 'BOSTON', 'NEW YORK', 'NEWARK', 'PHILADELPHIA',
  'PORTLAND', 'SEATTLE', 'TACOMA', 'CHICAGO', 'DETROIT',
  'ATLANTA', 'BATON ROUGE', 'BEAUMONT', 'CHARLESTON', 'CORPUS CHRISTI',
  'DALLAS', 'GALVESTON', 'HOUSTON', 'JACKSONVILLE', 'MIAMI',
  'MOBILE', 'NEW ORLEANS', 'NORFOLK', 'PORT EVERGLADES', 'SAVANNAH',
  'TAMPA', 'LONG BEACH', 'LOS ANGELES', 'OAKLAND', 'SAN FRANCISCO', 'SAN DIEGO',
  // UNITED KINGDOM
  'BIRMINGHAM', 'CARDIFF', 'FELIXSTOWE', 'HULL', 'IMMINGHAM',
  'LIVERPOOL', 'LONDON', 'MANCHESTER', 'SOUTHAMPTON', 'TILBURY',
  // URUGUAY
  'MONTEVIDEO', 'NUEVA PALMIRA',
  // UAE
  'ABU DHABI', 'DUBAI', 'FUJAIRAH', 'JEBEL ALI', 'KHORFAKKAN', 'SHARJAH',
  // UKRAINE
  'ILYCHEVSK', 'ODESSA',
  // VENEZUELA
  'LA GUAIRA', 'MARACAIBO', 'PUERTO CABELLO',
  // VIETNAM
  'DANANG', 'HAIPHONG', 'HANOI', 'HO CHI MINH CITY', 'NHA TRANG', 'VUNGTAU',
  // YEMEN
  'ADEN', 'HODEIDAH', 'MUKALLA',
];

// ─── SHIP GENERATION ─────────────────────────────────────────────────────────

const SHIP_NAMES = [
  'MAERSK', 'MSC', 'COSCO', 'CMA CGM', 'HAPAG-LLOYD', 'ONE', 'EVERGREEN',
  'HMM', 'YANG MING', 'ZIM', 'WAN HAI', 'PIL', 'GRIMALDI', 'MATSON',
  'KMTC', 'ARKAS', 'X-PRESS', 'UNIFEEDER', 'EUKOR', 'WALLENIUS',
];

const SHIP_SUFFIXES = [
  'EDINBURGH', 'LE HAVRE', 'SHANGHAI', 'ROTTERDAM', 'SINGAPORE', 'PIONEER',
  'STAR', 'TITAN', 'AURORA', 'MARINER', 'VOYAGER', 'EXPLORER', 'LEGEND',
  'SOVEREIGN', 'MAJESTY', 'PRIDE', 'SPIRIT', 'VICTORY', 'GLORY', 'QUEST',
];

const FLAGS = ['🇱🇷 LR', '🇵🇦 PA', '🇲🇭 MH', '🇧🇸 BS', '🇲🇹 MT', '🇸🇬 SG', '🇭🇰 HK', '🇨🇳 CN', '🇩🇪 DE', '🇩🇰 DK', '🇹🇷 TR'];
const TYPES = ['Container Ship', 'Crude Oil Tanker', 'Bulk Carrier', 'LNG Carrier', 'Ro-Ro Cargo', 'General Cargo'];
const EMOJIS: Record<string, string> = {
  'Container Ship': '📦',
  'Crude Oil Tanker': '🛢',
  'Bulk Carrier': '⚓',
  'LNG Carrier': '💧',
  'Ro-Ro Cargo': '🚗',
  'General Cargo': '🏗',
};

function randomPort(): string {
  return WORLD_PORT_NAMES[Math.floor(Math.random() * WORLD_PORT_NAMES.length)];
}

function generateVessels(count: number): Vessel[] {
  const vessels: Vessel[] = [];
  for (let i = 1; i <= count; i++) {
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];
    const name = `${SHIP_NAMES[Math.floor(Math.random() * SHIP_NAMES.length)]} ${SHIP_SUFFIXES[Math.floor(Math.random() * SHIP_SUFFIXES.length)]}`;
    const risk = Math.floor(Math.random() * 100);
    const lat = (Math.random() * 120) - 50;
    const lng = (Math.random() * 300) - 150;
    const dest = randomPort();

    vessels.push({
      id: i.toString(),
      imo: (9000000 + i).toString(),
      name,
      flag: FLAGS[Math.floor(Math.random() * FLAGS.length)],
      type,
      emoji: EMOJIS[type],
      riskScore: risk,
      speed: (10 + Math.random() * 15).toFixed(1) + ' kn',
      destination: dest,
      reportedDestination: dest,
      origin: randomPort(),
      atd: '2026-04-01 10:00',
      draught: (8 + Math.random() * 10).toFixed(1) + 'm',
      status: Math.random() > 0.8 ? 'At Anchor' : 'Underway Using Engine',
      eta: 'Apr ' + (5 + (i % 10)) + ', 14:00',
      lat,
      lng,
      heading: Math.floor(Math.random() * 360),
      currentPosition: `${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E`,
    });
  }
  return vessels;
}

export const VESSELS: Vessel[] = generateVessels(100);

// ─── TURKISH PORTS (full metadata) ───────────────────────────────────────────

export const TURKISH_PORTS: Port[] = [
  { name: 'Ambarlı (Marport/Kumport/Mardaş)', region: 'Marmara / Istanbul',      congestion: 'Severe', ships: 145, wait: '18h', risk: 85 },
  { name: 'Haydarpaşa',                        region: 'Marmara / Istanbul',      congestion: 'Medium', ships: 56,  wait: '4h',  risk: 35 },
  { name: 'İzmit / Derince (Safiport)',         region: 'Marmara / Kocaeli',       congestion: 'High',   ships: 112, wait: '9h',  risk: 61 },
  { name: 'Dilovası (Yılport/Evyapport)',       region: 'Marmara / Kocaeli',       congestion: 'High',   ships: 88,  wait: '12h', risk: 68 },
  { name: 'Gemlik (Borusan/Gemport)',           region: 'Marmara / Bursa',         congestion: 'Medium', ships: 74,  wait: '6h',  risk: 42 },
  { name: 'Bandırma',                           region: 'Marmara / Balıkesir',     congestion: 'Low',    ships: 32,  wait: '2h',  risk: 15 },
  { name: 'Tekirdağ (Asyaport)',                region: 'Marmara / Tekirdağ',      congestion: 'High',   ships: 92,  wait: '10h', risk: 58 },
  { name: 'İzmir (Alsancak)',                   region: 'Aegean / Izmir',          congestion: 'High',   ships: 82,  wait: '8h',  risk: 55 },
  { name: 'Aliağa (Nemport/TCE)',               region: 'Aegean / Izmir',          congestion: 'Severe', ships: 104, wait: '22h', risk: 88 },
  { name: 'Mersin (MIP)',                       region: 'Mediterranean / Mersin',  congestion: 'Severe', ships: 167, wait: '24h', risk: 92 },
  { name: 'İskenderun (Limak)',                 region: 'Mediterranean / Hatay',   congestion: 'High',   ships: 74,  wait: '11h', risk: 63 },
  { name: 'Antalya (QTerminals)',               region: 'Mediterranean / Antalya', congestion: 'Low',    ships: 35,  wait: '3h',  risk: 20 },
  { name: 'Samsun',                             region: 'Black Sea / Samsun',      congestion: 'Low',    ships: 41,  wait: '3h',  risk: 18 },
  { name: 'Trabzon',                            region: 'Black Sea / Trabzon',     congestion: 'Low',    ships: 28,  wait: '2h',  risk: 12 },
  { name: 'Zonguldak / Erdemir',               region: 'Black Sea / Zonguldak',   congestion: 'Medium', ships: 63,  wait: '7h',  risk: 44 },
  { name: 'Ereğli',                             region: 'Black Sea / Zonguldak',   congestion: 'Medium', ships: 45,  wait: '5h',  risk: 30 },
];

// ─── GLOBAL PORTS (with metadata) ────────────────────────────────────────────

export const PORTS: Port[] = [
  ...TURKISH_PORTS,
  { name: 'Shanghai',      region: 'China',        congestion: 'Severe', ships: 312, wait: '22h', risk: 82 },
  { name: 'Singapore',     region: 'Singapore',    congestion: 'High',   ships: 198, wait: '8h',  risk: 67 },
  { name: 'Rotterdam',     region: 'Netherlands',  congestion: 'High',   ships: 176, wait: '11h', risk: 65 },
  { name: 'Jebel Ali',     region: 'UAE',          congestion: 'Medium', ships: 142, wait: '6h',  risk: 48 },
  { name: 'Los Angeles',   region: 'USA',          congestion: 'High',   ships: 98,  wait: '14h', risk: 72 },
  { name: 'Hong Kong',     region: 'China',        congestion: 'High',   ships: 154, wait: '10h', risk: 60 },
  { name: 'Busan',         region: 'South Korea',  congestion: 'High',   ships: 132, wait: '9h',  risk: 58 },
  { name: 'Ningbo',        region: 'China',        congestion: 'Severe', ships: 224, wait: '18h', risk: 78 },
  { name: 'Qingdao',       region: 'China',        congestion: 'High',   ships: 186, wait: '12h', risk: 70 },
  { name: 'Tianjin',       region: 'China',        congestion: 'High',   ships: 172, wait: '14h', risk: 72 },
  { name: 'Guangzhou',     region: 'China',        congestion: 'High',   ships: 165, wait: '11h', risk: 68 },
  { name: 'Port Kelang',   region: 'Malaysia',     congestion: 'Medium', ships: 118, wait: '7h',  risk: 45 },
  { name: 'Hamburg',       region: 'Germany',      congestion: 'Medium', ships: 108, wait: '6h',  risk: 40 },
  { name: 'Antwerp',       region: 'Belgium',      congestion: 'High',   ships: 145, wait: '10h', risk: 55 },
  { name: 'Felixstowe',    region: 'UK',           congestion: 'Medium', ships: 94,  wait: '7h',  risk: 42 },
  { name: 'Piraeus',       region: 'Greece',       congestion: 'High',   ships: 122, wait: '9h',  risk: 58 },
  { name: 'Colombo',       region: 'Sri Lanka',    congestion: 'Medium', ships: 88,  wait: '6h',  risk: 38 },
  { name: 'Mumbai',        region: 'India',        congestion: 'High',   ships: 112, wait: '10h', risk: 62 },
  { name: 'Jawaharlal Nehru Port', region: 'India', congestion: 'High', ships: 98,  wait: '9h',  risk: 58 },
  { name: 'Durban',        region: 'South Africa', congestion: 'Medium', ships: 76,  wait: '7h',  risk: 45 },
  { name: 'Cape Town',     region: 'South Africa', congestion: 'Low',    ships: 48,  wait: '3h',  risk: 22 },
  { name: 'Mombasa',       region: 'Kenya',        congestion: 'Medium', ships: 62,  wait: '6h',  risk: 40 },
  { name: 'Lagos',         region: 'Nigeria',      congestion: 'Severe', ships: 142, wait: '20h', risk: 88 },
  { name: 'Dakar',         region: 'Senegal',      congestion: 'Low',    ships: 38,  wait: '3h',  risk: 20 },
  { name: 'Casablanca',    region: 'Morocco',      congestion: 'Medium', ships: 72,  wait: '5h',  risk: 35 },
  { name: 'Alexandria',    region: 'Egypt',        congestion: 'High',   ships: 118, wait: '12h', risk: 68 },
  { name: 'Port Said',     region: 'Egypt',        congestion: 'High',   ships: 134, wait: '14h', risk: 70 },
  { name: 'Jeddah',        region: 'Saudi Arabia', congestion: 'High',   ships: 138, wait: '11h', risk: 62 },
  { name: 'Dammam',        region: 'Saudi Arabia', congestion: 'Medium', ships: 94,  wait: '7h',  risk: 48 },
  { name: 'Bandar Abbas',  region: 'Iran',         congestion: 'High',   ships: 104, wait: '16h', risk: 78 },
  { name: 'Salalah',       region: 'Oman',         congestion: 'Medium', ships: 82,  wait: '5h',  risk: 35 },
  { name: 'Doha',          region: 'Qatar',        congestion: 'Low',    ships: 44,  wait: '4h',  risk: 28 },
  { name: 'Fujairah',      region: 'UAE',          congestion: 'Medium', ships: 96,  wait: '8h',  risk: 50 },
  { name: 'Karachi',       region: 'Pakistan',     congestion: 'High',   ships: 108, wait: '13h', risk: 72 },
  { name: 'Chittagong',    region: 'Bangladesh',   congestion: 'High',   ships: 86,  wait: '10h', risk: 65 },
  { name: 'Laem Chabang',  region: 'Thailand',     congestion: 'Medium', ships: 96,  wait: '7h',  risk: 42 },
  { name: 'Ho Chi Minh City', region: 'Vietnam',   congestion: 'High',   ships: 102, wait: '9h',  risk: 55 },
  { name: 'Haiphong',      region: 'Vietnam',      congestion: 'Medium', ships: 74,  wait: '6h',  risk: 40 },
  { name: 'Manila',        region: 'Philippines',  congestion: 'High',   ships: 112, wait: '11h', risk: 60 },
  { name: 'Jakarta',       region: 'Indonesia',    congestion: 'Severe', ships: 148, wait: '18h', risk: 80 },
  { name: 'Surabaya',      region: 'Indonesia',    congestion: 'High',   ships: 96,  wait: '10h', risk: 58 },
  { name: 'Tokyo',         region: 'Japan',        congestion: 'Medium', ships: 88,  wait: '5h',  risk: 32 },
  { name: 'Yokohama',      region: 'Japan',        congestion: 'Medium', ships: 82,  wait: '5h',  risk: 30 },
  { name: 'Kobe',          region: 'Japan',        congestion: 'Low',    ships: 64,  wait: '3h',  risk: 22 },
  { name: 'Nagoya',        region: 'Japan',        congestion: 'Medium', ships: 76,  wait: '5h',  risk: 35 },
  { name: 'Osaka',         region: 'Japan',        congestion: 'Medium', ships: 72,  wait: '5h',  risk: 33 },
  { name: 'Incheon',       region: 'South Korea',  congestion: 'Medium', ships: 84,  wait: '6h',  risk: 38 },
  { name: 'Kaohsiung',     region: 'Taiwan',       congestion: 'High',   ships: 118, wait: '9h',  risk: 55 },
  { name: 'Keelung',       region: 'Taiwan',       congestion: 'Medium', ships: 86,  wait: '7h',  risk: 45 },
  { name: 'Vancouver',     region: 'Canada',       congestion: 'Medium', ships: 78,  wait: '6h',  risk: 38 },
  { name: 'New York',      region: 'USA',          congestion: 'High',   ships: 124, wait: '12h', risk: 65 },
  { name: 'Houston',       region: 'USA',          congestion: 'High',   ships: 116, wait: '10h', risk: 60 },
  { name: 'Savannah',      region: 'USA',          congestion: 'Medium', ships: 88,  wait: '7h',  risk: 42 },
  { name: 'Long Beach',    region: 'USA',          congestion: 'High',   ships: 136, wait: '14h', risk: 72 },
  { name: 'Seattle',       region: 'USA',          congestion: 'Medium', ships: 72,  wait: '6h',  risk: 38 },
  { name: 'Santos',        region: 'Brazil',       congestion: 'High',   ships: 126, wait: '12h', risk: 65 },
  { name: 'Buenos Aires',  region: 'Argentina',    congestion: 'Medium', ships: 86,  wait: '8h',  risk: 45 },
  { name: 'Callao',        region: 'Peru',         congestion: 'Medium', ships: 78,  wait: '7h',  risk: 42 },
  { name: 'Valparaiso',    region: 'Chile',        congestion: 'Medium', ships: 64,  wait: '5h',  risk: 35 },
  { name: 'Cartagena',     region: 'Colombia',     congestion: 'Medium', ships: 82,  wait: '6h',  risk: 40 },
  { name: 'Colon',         region: 'Panama',       congestion: 'High',   ships: 112, wait: '9h',  risk: 55 },
  { name: 'Le Havre',      region: 'France',       congestion: 'High',   ships: 118, wait: '10h', risk: 55 },
  { name: 'Barcelona',     region: 'Spain',        congestion: 'High',   ships: 104, wait: '9h',  risk: 52 },
  { name: 'Algeciras',     region: 'Spain',        congestion: 'High',   ships: 128, wait: '11h', risk: 60 },
  { name: 'Valencia',      region: 'Spain',        congestion: 'Medium', ships: 96,  wait: '8h',  risk: 48 },
  { name: 'Gothenburg',    region: 'Sweden',       congestion: 'Low',    ships: 52,  wait: '3h',  risk: 18 },
  { name: 'Saint Petersburg', region: 'Russia',    congestion: 'Medium', ships: 84,  wait: '8h',  risk: 55 },
  { name: 'Vladivostok',   region: 'Russia',       congestion: 'Low',    ships: 48,  wait: '4h',  risk: 30 },
  { name: 'Odessa',        region: 'Ukraine',      congestion: 'High',   ships: 36,  wait: '20h', risk: 95 },
  { name: 'Constanta',     region: 'Romania',      congestion: 'Medium', ships: 74,  wait: '6h',  risk: 42 },
  { name: 'Varna',         region: 'Bulgaria',     congestion: 'Low',    ships: 46,  wait: '3h',  risk: 22 },
  { name: 'Lattakia',      region: 'Syria',        congestion: 'High',   ships: 32,  wait: '18h', risk: 90 },
  { name: 'Beirut',        region: 'Lebanon',      congestion: 'High',   ships: 28,  wait: '16h', risk: 85 },
  { name: 'Ashdod',        region: 'Israel',       congestion: 'High',   ships: 72,  wait: '10h', risk: 72 },
  { name: 'Haifa',         region: 'Israel',       congestion: 'High',   ships: 68,  wait: '9h',  risk: 70 },
  { name: 'Aden',          region: 'Yemen',        congestion: 'Severe', ships: 14,  wait: '48h', risk: 98 },
  { name: 'Djibouti',      region: 'Djibouti',     congestion: 'High',   ships: 88,  wait: '10h', risk: 68 },
  { name: 'Richards Bay',  region: 'South Africa', congestion: 'Medium', ships: 58,  wait: '5h',  risk: 28 },
];

// ─── ROUTES ───────────────────────────────────────────────────────────────────

export const ROUTES: Route[] = [
  { from: 'Shanghai',    to: 'Rotterdam',   risk: 82 },
  { from: 'Singapore',   to: 'Jebel Ali',   risk: 45 },
  { from: 'Istanbul',    to: 'Mersin',      risk: 28 },
  { from: 'New York',    to: 'London',      risk: 15 },
  { from: 'Busan',       to: 'Los Angeles', risk: 52 },
  { from: 'Mumbai',      to: 'Jeddah',      risk: 58 },
  { from: 'Ningbo',      to: 'Long Beach',  risk: 74 },
  { from: 'Santos',      to: 'Rotterdam',   risk: 42 },
  { from: 'Antwerp',     to: 'Singapore',   risk: 36 },
  { from: 'Colombo',     to: 'Hamburg',     risk: 48 },
  { from: 'Piraeus',     to: 'Alexandria',  risk: 55 },
  { from: 'Karachi',     to: 'Bandar Abbas',risk: 72 },
  { from: 'Lagos',       to: 'Antwerp',     risk: 60 },
  { from: 'Callao',      to: 'Colon',       risk: 32 },
  { from: 'Vladivostok', to: 'Yokohama',    risk: 25 },
];

// ─── RISK ZONES ───────────────────────────────────────────────────────────────

export const ALL_RISK_ZONES: RiskZone[] = [
  { id: 'z1',  name: 'Bab el-Mandeb',        reason: 'High Geopolitical Instability / Regional Conflict',  riskLevel: 'Critical', lat: 12.6,  lng: 43.3,   radius: 25, category: 'Geopolitical' },
  { id: 'z2',  name: 'Strait of Hormuz',      reason: 'Strategic Chokepoint Risk / Seizure Warnings',       riskLevel: 'High',     lat: 26.5,  lng: 56.2,   radius: 20, category: 'Geopolitical' },
  { id: 'z3',  name: 'Taiwan Strait',         reason: 'Military Exercise Zone / Political Friction',         riskLevel: 'Medium',   lat: 24.5,  lng: 119.5,  radius: 30, category: 'Geopolitical' },
  { id: 'z4',  name: 'Black Sea War Zone',    reason: 'Active Conflict / Mine Risk / Port Attacks',          riskLevel: 'Critical', lat: 46.0,  lng: 32.0,   radius: 50, category: 'Geopolitical' },
  { id: 'z5',  name: 'Gulf of Aden',          reason: 'Piracy Risk / Drone / Missile Attacks',               riskLevel: 'Critical', lat: 13.0,  lng: 48.0,   radius: 35, category: 'Geopolitical' },
  { id: 'wz1', name: 'Arabian Sea Cyclone',   reason: 'Developing Tropical System - Category 3',             riskLevel: 'Critical', lat: 15.0,  lng: 65.0,   radius: 45, category: 'Weather' },
  { id: 'wz2', name: 'North Atlantic Gale',   reason: 'Severe Storm Front / Heavy Swell',                    riskLevel: 'High',     lat: 45.0,  lng: -30.0,  radius: 60, category: 'Weather' },
  { id: 'wz3', name: 'Bay of Bengal Depression', reason: 'Cyclonic Activity - Monitor Course',               riskLevel: 'Medium',   lat: 12.0,  lng: 88.0,   radius: 40, category: 'Weather' },
];

// ─── WEATHER STATIONS ─────────────────────────────────────────────────────────

export const WEATHER_STATIONS: WeatherStation[] = [
  { id: 'w1', location: 'North Atlantic',  temp: '14°C', wind: '22 kn NW', waves: '2.4m', visibility: '8nm'  },
  { id: 'w2', location: 'Red Sea Central', temp: '28°C', wind: '8 kn S',   waves: '0.8m', visibility: '12nm' },
  { id: 'w3', location: 'South China Sea', temp: '26°C', wind: '15 kn NE', waves: '1.5m', visibility: '10nm' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

export function getRiskColorClass(score: number) {
  const level = getRiskLevel(score);
  switch (level) {
    case 'Critical': return 'risk-critical';
    case 'High':     return 'risk-high';
    case 'Medium':   return 'risk-medium';
    case 'Low':      return 'risk-low';
  }
}