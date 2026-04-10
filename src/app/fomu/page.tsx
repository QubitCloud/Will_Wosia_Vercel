'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './fomu.module.css'
import type { WosiaData, Mrithi, KipachiArdhi, KipachiBenki, KipachiGari } from '@/lib/types'

const MAJINA_HATUA = ['Mwandishi', 'Mali', 'Wateule', 'Msimamizi', 'Matakwa', 'Kagua']

const F = ({ label, req, error, children }: { label: string, req?: boolean, error?: boolean, children: React.ReactNode }) => (
  <div className={`${styles.uga} ${error ? styles.ugaKosa : ''}`}>
    <label className={styles.lebo}>{label}{req && <span className={styles.lazima}> *</span>}</label>
    {children}
    {error && <span className={styles.ujumbeKosa}>Inahitajika</span>}
  </div>
)

const emptyMwandishi = () => ({ fname:'', mname:'', lname:'', dob:'', nid:'', jinsi:'', simu:'', barua_pepe:'', anwani:'', hali_ndoa:'', dini:'' })
const emptyMali      = () => ({ ardhi:[] as KipachiArdhi[], benki:[] as KipachiBenki[], magari:[] as KipachiGari[], nyingine:'' })
const emptyMsimamizi = () => ({ jina:'', uhusiano:'', simu:'', nida:'', mbadala_jina:'', mbadala_simu:'' })
const emptyMdhamini  = () => ({ jina:'', uhusiano:'', simu:'', nida:'' })
const emptyMatakwa   = () => ({ mazishi:'', sadaka:'', masharti:'', madeni:'' })
const emptyMashahidi = () => ({ shahidi1_jina:'', shahidi1_nida:'', shahidi2_jina:'', shahidi2_nida:'' })
const emptyMrithi    = (): Mrithi => ({ 'jina-mrithi':'', 'uhusiano-mrithi':'mke', 'mgawanyo-mrithi':'', 'dob-mrithi':'', 'nida-mrithi':'', 'simu-mrithi':'' })
const emptyArdhi     = (): KipachiArdhi => ({ 'aina-ardhi':'nyumba', 'hati-ardhi':'', 'mahali-ardhi':'', 'thamani-ardhi':'', 'mrithi-ardhi':'' })
const emptyBenki     = (): KipachiBenki => ({ 'jina-benki':'', 'namba-benki':'', 'tawi-benki':'', 'mrithi-benki':'' })
const emptyGari      = (): KipachiGari  => ({ 'aina-gari':'', 'mwaka-gari':'', 'usajili-gari':'', 'mrithi-gari':'' })

export default function FormuPage() {
  const [hatua, setHatua] = useState(1)
  const [inatuma, setInatuma] = useState(false)
  const [makosa, setMakosa] = useState<Record<string,boolean>>({})

  const [mwandishi, setMwandishi] = useState(emptyMwandishi())
  const [mali, setMali]           = useState(emptyMali())
  const [wateule, setWateule]     = useState<Mrithi[]>([])
  const [msimamizi, setMsimamizi] = useState(emptyMsimamizi())
  const [mdhamini, setMdhamini]   = useState(emptyMdhamini())
  const [matakwa, setMatakwa]     = useState(emptyMatakwa())
  const [mashahidi, setMashahidi] = useState(emptyMashahidi())

  const asilimia = Math.round(((hatua - 1) / 6) * 100)

  function thibitisha(sek: number): boolean {
    if (sek === 1) {
      const m: Record<string,boolean> = {}
      if (!mwandishi.fname.trim())  m['fname'] = true
      if (!mwandishi.lname.trim())  m['lname'] = true
      if (!mwandishi.dob.trim())    m['dob'] = true
      if (!mwandishi.nid.trim())    m['nid'] = true
      if (!mwandishi.simu.trim())   m['simu'] = true
      if (!mwandishi.anwani.trim()) m['anwani'] = true
      setMakosa(m)
      return Object.keys(m).length === 0
    }
    if (sek === 4) {
      const m: Record<string,boolean> = {}
      if (!msimamizi.jina.trim()) m['msimamizi_jina'] = true
      setMakosa(m)
      return Object.keys(m).length === 0
    }
    return true
  }

  function endelea(sek: number) {
    if (!thibitisha(sek)) return
    setHatua(sek + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function rudi(sek: number) {
    setHatua(sek - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function tumaFormu() {
    setInatuma(true)
    const data: WosiaData = { mwandishi, mali, wateule, msimamizi, mdhamini, matakwa, mashahidi }
    try {
      const { generateWosiaPDF } = await import('@/lib/pdfGenerator')
      await generateWosiaPDF(data)
    } catch(e) {
      console.error(e)
      alert('Hitilafu ya kuzalisha PDF. Jaribu tena.')
    }
    setInatuma(false)
  }

  function updM(k: keyof typeof mwandishi, val: string) { setMwandishi(p => ({...p, [k]: val})); setMakosa(p => ({...p, [k]: false})) }
  function updMs(k: keyof typeof msimamizi, val: string) { setMsimamizi(p => ({...p, [k]: val})) }
  function updMd(k: keyof typeof mdhamini, val: string)  { setMdhamini(p => ({...p, [k]: val})) }
  function updMt(k: keyof typeof matakwa, val: string)   { setMatakwa(p => ({...p, [k]: val})) }
  function updSh(k: keyof typeof mashahidi, val: string) { setMashahidi(p => ({...p, [k]: val})) }

  function updArdhi(i: number, k: keyof KipachiArdhi, val: string) { setMali(p => { const a = [...p.ardhi]; a[i] = {...a[i], [k]: val}; return {...p, ardhi: a} }) }
  function updBenki(i: number, k: keyof KipachiBenki, val: string) { setMali(p => { const a = [...p.benki]; a[i] = {...a[i], [k]: val}; return {...p, benki: a} }) }
  function updGari (i: number, k: keyof KipachiGari,  val: string) { setMali(p => { const a = [...p.magari]; a[i] = {...a[i], [k]: val}; return {...p, magari: a} }) }
  function updW    (i: number, k: keyof Mrithi,        val: string) { setWateule(p => { const a = [...p]; a[i] = {...a[i], [k]: val}; return a }) }

  const inp = (val: string, onChange: (v:string)=>void, placeholder='', type='text') => (
    <input className={styles.ingizo} type={type} value={val} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
  )
  const numFmt = (raw: string) => { const d = raw.replace(/[^\d]/g,''); return d ? Number(d).toLocaleString('en-US') : '' }
  const moneyInp = (val: string, onChange: (v:string)=>void, placeholder='0') => (
    <input className={styles.ingizo} type="text" inputMode="numeric" value={val} onChange={e=>onChange(numFmt(e.target.value))} placeholder={placeholder} />
  )
  const sel = (val: string, onChange: (v:string)=>void, opts: [string,string][]) => (
    <select className={styles.ingizo} value={val} onChange={e=>onChange(e.target.value)}>
      {opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
    </select>
  )
  const txt = (val: string, onChange: (v:string)=>void, placeholder='') => (
    <textarea className={`${styles.ingizo} ${styles.eneo}`} value={val} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
  )

  return (
    <div className={styles.ukurasa}>
      {/* NAV */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>⚖ Wosia Wangu</Link>
        <span className={styles.navHatua}>Hatua {hatua} ya 6</span>
      </nav>

      {/* PROGRESS */}
      <div className={styles.mwambao}>
        <div className={styles.hatuaSafu}>
          {MAJINA_HATUA.map((jina, i) => (
            <div key={i} className={`${styles.hatuaLebo} ${i+1===hatua?styles.sasa:''} ${i+1<hatua?styles.imekamilika:''}`}>
              {i+1}. {jina}
            </div>
          ))}
        </div>
        <div className={styles.asilimia}>Umekamilisha {asilimia}% ya fomu</div>
      </div>

      <div className={styles.kisanduku}>

        {/* ── SEHEMU 1: MWANDISHI ── */}
        {hatua === 1 && (
          <div>
            <div className={styles.sehemuKichwa}>
              <div className={styles.sehemuNamba}>01</div>
              <div className={styles.sehemuJina}>Taarifa za Mwandishi wa Wosia</div>
              <div className={styles.sehemuMaelezo}>Habari zako za msingi kama mwandishi wa wosia huu.</div>
            </div>
            <div className={styles.gridi}>
              <F label="Jina la Kwanza" req error={makosa['fname']}>{inp(mwandishi.fname, v=>updM('fname',v), 'Jina la kwanza')}</F>
              <F label="Jina la Kati">{inp(mwandishi.mname, v=>updM('mname',v), 'Jina la kati (kama lipo)')}</F>
              <F label="Jina la Familia" req error={makosa['lname']}>{inp(mwandishi.lname, v=>updM('lname',v), 'Jina la familia')}</F>
              <F label="Tarehe ya Kuzaliwa" req error={makosa['dob']}>{inp(mwandishi.dob, v=>updM('dob',v), '', 'date')}</F>
              <F label="Namba ya Kitambulisho (NIDA)" req error={makosa['nid']}>{inp(mwandishi.nid, v=>updM('nid',v), 'Namba ya NIDA')}</F>
              <F label="Jinsi">
                <div className={styles.kundiChaguo}>
                  {[['mume','Mume'],['mke','Mke'],['nyingine','Nyingine']].map(([val,lbl])=>(
                    <label key={val} className={styles.kipachiChaguo}>
                      <input type="radio" name="jinsi" value={val} checked={mwandishi.jinsi===val} onChange={()=>updM('jinsi',val)} />
                      <span>{lbl}</span>
                    </label>
                  ))}
                </div>
              </F>
              <F label="Simu" req error={makosa['simu']}>{inp(mwandishi.simu, v=>updM('simu',v), '+255 7XX XXX XXX', 'tel')}</F>
              <F label="Barua Pepe">{inp(mwandishi.barua_pepe, v=>updM('barua_pepe',v), 'mfano@barua.co.tz', 'email')}</F>
              <F label="Anwani ya Makazi" req error={makosa['anwani']}><div className={styles.kamili}>{inp(mwandishi.anwani, v=>updM('anwani',v), 'Mtaa, Kata, Wilaya, Mkoa')}</div></F>
              <F label="Hali ya Ndoa">{sel(mwandishi.hali_ndoa, v=>updM('hali_ndoa',v), [['','-- Chagua --'],['sijaoana','Sijaoana'],['nimeoa','Nimeoa / Nimeolewa'],['talaka','Talaka'],['mjane','Mjane']])}</F>
              <F label="Dini">
                {sel(mwandishi.dini, v=>updM('dini',v), [['','-- Chagua --'],['mkristo','Mkristo'],['mwislamu','Mwislamu'],['nyingine','Nyingine']])}
                <span className={styles.kidokezo}>Waislamu wanaweza kuomba Wosia wa Kiislamu chini ya Sheria ya Mirathi.</span>
              </F>
            </div>
            <div className={styles.sandukuHabari}>
              <strong>Kwa nini tunahitaji taarifa hizi?</strong> Jina kamili na kitambulisho cha mwandishi wa wosia ni sharti la lazima chini ya Sheria ya Uthibitishaji Wosia na Usimamizi wa Mirathi, Sura ya 352 (R.E. 2023).
            </div>
            <div className={styles.vitufeNav}><div/><button className={styles.btnEndelea} onClick={()=>endelea(1)}>Endelea →</button></div>
          </div>
        )}

        {/* ── SEHEMU 2: MALI ── */}
        {hatua === 2 && (
          <div>
            <div className={styles.sehemuKichwa}>
              <div className={styles.sehemuNamba}>02</div>
              <div className={styles.sehemuJina}>Mali na Rasilimali</div>
              <div className={styles.sehemuMaelezo}>Orodhesha mali zako zote — ardhi, nyumba, akaunti za benki, magari, na mali nyingine.</div>
            </div>
            <div className={styles.sandukuHabari}>
              <strong>Muhimu kuhusu Ardhi (The Land Act 1999 &amp; Village Land Act 1999):</strong> Ardhi yote Tanzania ni mali ya Serikali. Unaweza kurithi <em>haki ya kumiliki ardhi</em> (Right of Occupancy) — si ardhi yenyewe. <strong>Warithi wasio raia wa Tanzania</strong> hawawezi kumiliki ardhi moja kwa moja. <strong>Haki za Wanawake:</strong> Sheria inawapa wanawake haki sawa ya kumiliki na kurithi ardhi.
            </div>

            <div className={styles.kikapu}>
              <div className={styles.kikapuKichwa}>🏠 Ardhi na Nyumba</div>
              {mali.ardhi.map((p,i)=>(
                <div key={i} className={styles.kadiKipande}>
                  <button className={styles.btnOndoa} onClick={()=>setMali(prev=>({...prev,ardhi:prev.ardhi.filter((_,j)=>j!==i)}))}>✕</button>
                  <div className={styles.gridi}>
                    <F label="Aina ya Mali">{sel(p['aina-ardhi'],v=>updArdhi(i,'aina-ardhi',v),[['nyumba','Nyumba'],['ardhi','Ardhi'],['ghorofa','Ghorofa / Flat'],['shamba','Shamba']])}</F>
                    <F label="Namba ya Hati / Kiwanja">{inp(p['hati-ardhi'],v=>updArdhi(i,'hati-ardhi',v),'LO/DSM/XXX')}</F>
                    <F label="Mahali / Anwani"><div className={styles.kamili}>{inp(p['mahali-ardhi'],v=>updArdhi(i,'mahali-ardhi',v))}</div></F>
                    <F label="Thamani (TZS) — Tahmini">{moneyInp(p['thamani-ardhi'],v=>updArdhi(i,'thamani-ardhi',v))}</F>
                    <F label="Atakayepata">{inp(p['mrithi-ardhi'],v=>updArdhi(i,'mrithi-ardhi',v),'Jina la mrithi')}</F>
                  </div>
                </div>
              ))}
              <button className={styles.btnOngeza} onClick={()=>setMali(p=>({...p,ardhi:[...p.ardhi,emptyArdhi()]}))}>+ Ongeza Mali ya Ardhi/Nyumba</button>
            </div>

            <div className={styles.kikapu}>
              <div className={styles.kikapuKichwa}>🏦 Akaunti za Benki na Fedha</div>
              {mali.benki.map((b,i)=>(
                <div key={i} className={styles.kadiKipande}>
                  <button className={styles.btnOndoa} onClick={()=>setMali(p=>({...p,benki:p.benki.filter((_,j)=>j!==i)}))}>✕</button>
                  <div className={styles.gridi}>
                    <F label="Jina la Benki">{inp(b['jina-benki'],v=>updBenki(i,'jina-benki',v),'NMB, CRDB, NBC...')}</F>
                    <F label="Namba ya Akaunti">{inp(b['namba-benki'],v=>updBenki(i,'namba-benki',v))}</F>
                    <F label="Tawi">{inp(b['tawi-benki'],v=>updBenki(i,'tawi-benki',v))}</F>
                    <F label="Atakayepata">{inp(b['mrithi-benki'],v=>updBenki(i,'mrithi-benki',v))}</F>
                  </div>
                </div>
              ))}
              <button className={styles.btnOngeza} onClick={()=>setMali(p=>({...p,benki:[...p.benki,emptyBenki()]}))}>+ Ongeza Akaunti ya Benki</button>
            </div>

            <div className={styles.kikapu}>
              <div className={styles.kikapuKichwa}>🚗 Magari na Vifaa</div>
              {mali.magari.map((g,i)=>(
                <div key={i} className={styles.kadiKipande}>
                  <button className={styles.btnOndoa} onClick={()=>setMali(p=>({...p,magari:p.magari.filter((_,j)=>j!==i)}))}>✕</button>
                  <div className={styles.gridi}>
                    <F label="Aina (Make/Model)">{inp(g['aina-gari'],v=>updGari(i,'aina-gari',v),'Toyota, Bajaj...')}</F>
                    <F label="Namba ya Usajili">{inp(g['usajili-gari'],v=>updGari(i,'usajili-gari',v))}</F>
                    <F label="Mwaka">{inp(g['mwaka-gari'],v=>updGari(i,'mwaka-gari',v),'2015','number')}</F>
                    <F label="Atakayepata">{inp(g['mrithi-gari'],v=>updGari(i,'mrithi-gari',v))}</F>
                  </div>
                </div>
              ))}
              <button className={styles.btnOngeza} onClick={()=>setMali(p=>({...p,magari:[...p.magari,emptyGari()]}))}>+ Ongeza Gari / Kifaa</button>
            </div>

            <div className={styles.kikapu}>
              <div className={styles.kikapuKichwa}>📦 Mali Nyingine</div>
              <F label="Eleza Mali Nyingine (Biashara, Hisa, Mifugo, n.k.)">{txt(mali.nyingine,v=>setMali(p=>({...p,nyingine:v})),'Eleza...')}</F>
            </div>

            <div className={styles.vitufeNav}>
              <button className={styles.btnRudi} onClick={()=>rudi(2)}>← Rudi</button>
              <button className={styles.btnEndelea} onClick={()=>endelea(2)}>Endelea →</button>
            </div>
          </div>
        )}

        {/* ── SEHEMU 3: WATEULE ── */}
        {hatua === 3 && (
          <div>
            <div className={styles.sehemuKichwa}>
              <div className={styles.sehemuNamba}>03</div>
              <div className={styles.sehemuJina}>Wateule wa Mirathi</div>
              <div className={styles.sehemuMaelezo}>Wateule ni watu watakaopata mali yako. Ongeza kila mtu na mgawanyo wake.</div>
            </div>
            {wateule.map((b,i)=>(
              <div key={i} className={styles.kadiKipande}>
                <button className={styles.btnOndoa} onClick={()=>setWateule(p=>p.filter((_,j)=>j!==i))}>✕</button>
                <div className={styles.kadiKichwa}>Mrithi {i+1}</div>
                <div className={styles.gridiTatu}>
                  <F label="Jina Kamili">{inp(b['jina-mrithi'],v=>updW(i,'jina-mrithi',v))}</F>
                  <F label="Uhusiano">{sel(b['uhusiano-mrithi'],v=>updW(i,'uhusiano-mrithi',v),[['mke','Mke'],['mume','Mume'],['mtoto','Mtoto'],['mzazi','Mzazi'],['kaka','Kaka'],['dada','Dada'],['nyingine','Nyingine']])}</F>
                  <F label="Mgawanyo (%)">{inp(b['mgawanyo-mrithi'],v=>updW(i,'mgawanyo-mrithi',v),'50','number')}</F>
                  <F label="Tarehe ya Kuzaliwa">{inp(b['dob-mrithi'],v=>updW(i,'dob-mrithi',v),'','date')}</F>
                  <F label="Kitambulisho (NIDA)">{inp(b['nida-mrithi'],v=>updW(i,'nida-mrithi',v))}</F>
                  <F label="Simu">{inp(b['simu-mrithi'],v=>updW(i,'simu-mrithi',v),'+255...','tel')}</F>
                </div>
              </div>
            ))}
            <button className={styles.btnOngeza} onClick={()=>setWateule(p=>[...p,emptyMrithi()])}>+ Ongeza Mrithi</button>
            <div className={styles.sandukuHabari} style={{marginTop:'1.5rem'}}>
              <strong>Mambo Muhimu ya Kisheria:</strong><br/>
              · <strong>Watoto wadogo</strong> (chini ya miaka 18) hawataweza kupokea mali moja kwa moja — mdhamini atashikilia mali mpaka wafikia utu uzima.<br/>
              · <strong>Watoto wote</strong>, ikiwa ni pamoja na wale waliozaliwa nje ya ndoa, wana haki ya kurithi.<br/>
              · <strong>Wajane:</strong> Sheria ya kimila mara nyingi haimpi mjane haki ya moja kwa moja ya kurithi mali. Wosia wa maandishi unakupa uwezo wa kulinda mkeo/mumewe dhidi ya hili.
            </div>
            <div className={styles.vitufeNav}>
              <button className={styles.btnRudi} onClick={()=>rudi(3)}>← Rudi</button>
              <button className={styles.btnEndelea} onClick={()=>endelea(3)}>Endelea →</button>
            </div>
          </div>
        )}

        {/* ── SEHEMU 4: MSIMAMIZI ── */}
        {hatua === 4 && (
          <div>
            <div className={styles.sehemuKichwa}>
              <div className={styles.sehemuNamba}>04</div>
              <div className={styles.sehemuJina}>Msimamizi wa Wosia na Mdhamini</div>
              <div className={styles.sehemuMaelezo}>Msimamizi (Executor) ndiye atakayetekeleza wosia huu. Mdhamini anaweza kutunza watoto wadogo.</div>
            </div>
            <div className={styles.kikapu}>
              <div className={styles.kikapuKichwa}>Msimamizi wa Kwanza</div>
              <div className={styles.gridi}>
                <F label="Jina Kamili la Msimamizi" req error={makosa['msimamizi_jina']}>{inp(msimamizi.jina,v=>updMs('jina',v))}</F>
                <F label="Uhusiano nawe">{inp(msimamizi.uhusiano,v=>updMs('uhusiano',v),'Mke, Ndugu, Rafiki, n.k.')}</F>
                <F label="Simu ya Msimamizi">{inp(msimamizi.simu,v=>updMs('simu',v),'+255 7XX XXX XXX','tel')}</F>
                <F label="Kitambulisho cha Msimamizi">{inp(msimamizi.nida,v=>updMs('nida',v))}</F>
              </div>
            </div>
            <div className={styles.kikapu}>
              <div className={styles.kikapuKichwa}>Msimamizi Mbadala</div>
              <div className={styles.gridi}>
                <F label="Jina Kamili">{inp(msimamizi.mbadala_jina,v=>updMs('mbadala_jina',v))}</F>
                <F label="Simu">{inp(msimamizi.mbadala_simu,v=>updMs('mbadala_simu',v),'+255 7XX XXX XXX','tel')}</F>
              </div>
            </div>
            <div className={styles.kikapu}>
              <div className={styles.kikapuKichwa}>Mdhamini wa Watoto Wadogo (kama wapo)</div>
              <div className={styles.gridi}>
                <F label="Jina Kamili la Mdhamini">{inp(mdhamini.jina,v=>updMd('jina',v))}</F>
                <F label="Uhusiano">{inp(mdhamini.uhusiano,v=>updMd('uhusiano',v))}</F>
                <F label="Simu ya Mdhamini">{inp(mdhamini.simu,v=>updMd('simu',v),'+255 7XX XXX XXX','tel')}</F>
                <F label="Kitambulisho cha Mdhamini">{inp(mdhamini.nida,v=>updMd('nida',v))}</F>
              </div>
            </div>
            <div className={styles.vitufeNav}>
              <button className={styles.btnRudi} onClick={()=>rudi(4)}>← Rudi</button>
              <button className={styles.btnEndelea} onClick={()=>endelea(4)}>Endelea →</button>
            </div>
          </div>
        )}

        {/* ── SEHEMU 5: MATAKWA ── */}
        {hatua === 5 && (
          <div>
            <div className={styles.sehemuKichwa}>
              <div className={styles.sehemuNamba}>05</div>
              <div className={styles.sehemuJina}>Matakwa Maalum na Masharti</div>
              <div className={styles.sehemuMaelezo}>Maelekezo ya mazishi, misaada ya hisani, na masharti yoyote maalum.</div>
            </div>
            <div className={styles.gridiMoja}>
              <F label="Maelekezo ya Mazishi">{txt(matakwa.mazishi,v=>updMt('mazishi',v),'Eleza matakwa yako ya mazishi...')}</F>
              <F label="Misaada ya Hisani (Sadaka)">{txt(matakwa.sadaka,v=>updMt('sadaka',v),'Taasisi na kiasi...')}</F>
              <F label="Masharti Maalum / Maelekezo Mengine">{txt(matakwa.masharti,v=>updMt('masharti',v),'Masharti yoyote maalum...')}</F>
              <F label="Madeni ya Kulipwa">{txt(matakwa.madeni,v=>updMt('madeni',v),'Orodha ya madeni...')}</F>
            </div>
            <div className={styles.kikapu}>
              <div className={styles.kikapuKichwa}>Mashahidi</div>
              <div className={styles.sandukuHabari}>
                <strong>Sheria inasema (Probate and Administration of Estates Act, Cap. 352):</strong> Wosia lazima usainiwe mbele ya mashahidi <strong>WAWILI</strong> wazima ambao si wateule wa wosia huu. Wosia unaoshuhudiwa na mrithi au mwenzi wa mrithi hautakuwa halali.
              </div>
              <div className={styles.gridi}>
                <F label="Shahidi wa 1 — Jina Kamili">{inp(mashahidi.shahidi1_jina,v=>updSh('shahidi1_jina',v))}</F>
                <F label="Shahidi wa 1 — Kitambulisho">{inp(mashahidi.shahidi1_nida,v=>updSh('shahidi1_nida',v))}</F>
                <F label="Shahidi wa 2 — Jina Kamili">{inp(mashahidi.shahidi2_jina,v=>updSh('shahidi2_jina',v))}</F>
                <F label="Shahidi wa 2 — Kitambulisho">{inp(mashahidi.shahidi2_nida,v=>updSh('shahidi2_nida',v))}</F>
              </div>
            </div>
            <div className={styles.vitufeNav}>
              <button className={styles.btnRudi} onClick={()=>rudi(5)}>← Rudi</button>
              <button className={styles.btnEndelea} onClick={()=>endelea(5)}>Endelea →</button>
            </div>
          </div>
        )}

        {/* ── SEHEMU 6: KAGUA ── */}
        {hatua === 6 && (
          <div>
            <div className={styles.sehemuKichwa}>
              <div className={styles.sehemuNamba}>06</div>
              <div className={styles.sehemuJina}>Kagua na Pakua</div>
              <div className={styles.sehemuMaelezo}>Hakikisha taarifa zote ni sahihi, kisha pakua PDF yako.</div>
            </div>
            <div className={styles.muhtasari}>
              <h3 className={styles.muhtasariKichwa}>Muhtasari wa Wosia</h3>
              <p><strong>Jina Kamili:</strong> {[mwandishi.fname,mwandishi.mname,mwandishi.lname].filter(Boolean).join(' ')}</p>
              <p><strong>NIDA:</strong> {mwandishi.nid || '—'}</p>
              <p><strong>Simu:</strong> {mwandishi.simu || '—'}</p>
              <p><strong>Anwani:</strong> {mwandishi.anwani || '—'}</p>
              <hr className={styles.mstariMuhtasari}/>
              <p><strong>Msimamizi Mkuu:</strong> {msimamizi.jina || '—'}</p>
              <p><strong>Wateule:</strong> {wateule.filter(b=>b['jina-mrithi']).map(b=>b['jina-mrithi']).join(', ') || '—'}</p>
              <p><strong>Mali za Ardhi:</strong> {mali.ardhi.length} zilizoorodheshwa</p>
              <p><strong>Akaunti za Benki:</strong> {mali.benki.length} zilizoorodheshwa</p>
              <p><strong>Magari:</strong> {mali.magari.length} zilizoorodheshwa</p>
            </div>
            <div className={styles.sandukuHabari}>
              <strong>Kumbuka:</strong> Bonyeza "Pakua PDF" ili kupakua wosia wako. Peleka PDF hiyo kwa wakili aliyesajiliwa kusaini mbele ya mashahidi wawili.
            </div>
            <div className={styles.vitufeNav}>
              <button className={styles.btnRudi} onClick={()=>rudi(6)}>← Rudi</button>
              <button className={styles.btnTuma} onClick={tumaFormu} disabled={inatuma}>
                {inatuma ? 'Inatengeneza...' : '⬇ Pakua PDF'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
