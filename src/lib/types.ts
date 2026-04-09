export interface Mwandishi {
  fname: string
  mname: string
  lname: string
  dob: string
  nid: string
  jinsi: string
  simu: string
  barua_pepe: string
  anwani: string
  hali_ndoa: string
  dini: string
}

export interface KipachiArdhi {
  'aina-ardhi': string
  'hati-ardhi': string
  'mahali-ardhi': string
  'thamani-ardhi': string
  'mrithi-ardhi': string
}

export interface KipachiBenki {
  'jina-benki': string
  'namba-benki': string
  'tawi-benki': string
  'mrithi-benki': string
}

export interface KipachiGari {
  'aina-gari': string
  'mwaka-gari': string
  'usajili-gari': string
  'mrithi-gari': string
}

export interface Mali {
  ardhi: KipachiArdhi[]
  benki: KipachiBenki[]
  magari: KipachiGari[]
  nyingine: string
}

export interface Mrithi {
  'jina-mrithi': string
  'uhusiano-mrithi': string
  'mgawanyo-mrithi': string
  'dob-mrithi': string
  'nida-mrithi': string
  'simu-mrithi': string
}

export interface Msimamizi {
  jina: string
  uhusiano: string
  simu: string
  nida: string
  mbadala_jina: string
  mbadala_simu: string
}

export interface Mdhamini {
  jina: string
  uhusiano: string
  simu: string
  nida: string
}

export interface Matakwa {
  mazishi: string
  sadaka: string
  masharti: string
  madeni: string
}

export interface Mashahidi {
  shahidi1_jina: string
  shahidi1_nida: string
  shahidi2_jina: string
  shahidi2_nida: string
}

export interface WosiaData {
  mwandishi: Mwandishi
  mali: Mali
  wateule: Mrithi[]
  msimamizi: Msimamizi
  mdhamini: Mdhamini
  matakwa: Matakwa
  mashahidi: Mashahidi
}
