import type { WosiaData } from './types'

const v = (val: unknown): string =>
  val && String(val).trim() ? String(val).trim() : ''

const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

export async function generateWosiaPDF(data: WosiaData): Promise<void> {
  // Dynamic import — keeps bundle small
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const W = 210
  const L = 20  // left margin
  const R = 190 // right margin
  const TW = R - L // text width

  // Colours
  const RUST   = [139, 58, 26]  as [number,number,number]
  const INK    = [26, 18, 8]    as [number,number,number]
  const MID    = [122, 106, 85] as [number,number,number]
  const BORDER = [224, 208, 188]as [number,number,number]
  const CREAM  = [253, 250, 246]as [number,number,number]

  const m   = data.mwandishi
  const tar = new Date().toLocaleDateString('sw-TZ', { day: '2-digit', month: 'long', year: 'numeric' })
  const jina_kamili = `${v(m.fname)} ${v(m.mname)} ${v(m.lname)}`.replace(/\s+/g,' ').trim()

  let y = 20
  let sekNamba = 0

  // ── helpers ───────────────────────────────────────────────
  function checkPage(needed = 20) {
    if (y + needed > 275) { doc.addPage(); y = 20 }
  }

  function kichwaKuu(text: string) {
    doc.setFont('times', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(...RUST)
    doc.text(text, W / 2, y, { align: 'center' })
    y += 7
  }

  function kichwaChini(text: string) {
    doc.setFont('times', 'italic')
    doc.setFontSize(9)
    doc.setTextColor(...MID)
    doc.text(text, W / 2, y, { align: 'center' })
    y += 5
  }

  function mstariMzito() {
    doc.setDrawColor(...RUST)
    doc.setLineWidth(0.8)
    doc.line(L, y, R, y)
    y += 5
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.3)
  }

  function mstariMwembamba() {
    doc.setDrawColor(...BORDER)
    doc.setLineWidth(0.3)
    doc.line(L, y, R, y)
    y += 4
  }

  function sehemu(kichwa: string) {
    checkPage(16)
    sekNamba++
    mstariMwembamba()
    doc.setFont('times', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...RUST)
    doc.text(`${sekNamba}. ${kichwa.toUpperCase()}`, L, y)
    y += 7
  }

  function mwili(text: string, indent = 0) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(...INK)
    const lines = doc.splitTextToSize(text, TW - indent)
    checkPage(lines.length * 5 + 3)
    doc.text(lines, L + indent, y)
    y += lines.length * 5 + 2
  }

  function safu(lebo: string, thamani: string) {
    if (!v(thamani)) return
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(...MID)
    doc.text(lebo.toUpperCase(), L, y)
    y += 4
    mwili(thamani)
    y += 1
  }

  // ── KICHWA ────────────────────────────────────────────────
  kichwaKuu('HATI YA WOSIA WA MWISHO')
  kichwaChini('Imetolewa kwa mujibu wa Sheria ya Uthibitishaji Wosia na Usimamizi wa Mirathi, Sura ya 352 (R.E. 2023)')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...MID)
  doc.text(`Tarehe ya Kutolewa: ${tar}`, W / 2, y, { align: 'center' })
  y += 8
  mstariMzito()

  // ── TAMKO LA AWALI ─────────────────────────────────────────
  const nida   = v(m.nid)   || '_______________'
  const anwani = v(m.anwani) || '_______________'
  mwili(`Mimi, ${jina_kamili}, mwenye Kitambulisho Namba ${nida}, mwenye makazi ${anwani}, nikiwa na akili timamu natoa Wosia huu wa Mwisho na kufuta wosia na maagizo yote ya awali niliyowahi kutoa.`)
  y += 3

  // ── SEHEMU 1: MWANDISHI ───────────────────────────────────
  sehemu('Taarifa za Mwandishi wa Wosia')
  const safu_mwandishi: [string, string][] = [
    ['Jina Kamili',        jina_kamili],
    ['Tarehe ya Kuzaliwa', v(m.dob)],
    ['Kitambulisho (NIDA)',nida !== '_______________' ? nida : ''],
    ['Jinsi',              cap(v(m.jinsi))],
    ['Simu',               v(m.simu)],
    ['Barua Pepe',         v(m.barua_pepe)],
    ['Anwani ya Makazi',   anwani !== '_______________' ? anwani : ''],
    ['Hali ya Ndoa',       cap(v(m.hali_ndoa))],
    ['Dini',               cap(v(m.dini))],
  ].filter(([, val]) => v(val)) as [string,string][]

  autoTable(doc, {
    startY: y,
    margin: { left: L, right: L },
    head: [],
    body: safu_mwandishi,
    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold', textColor: MID, fontSize: 8 }, 1: { fontSize: 9.5, textColor: INK } },
    styles: { fillColor: false, lineColor: BORDER, lineWidth: 0.3, cellPadding: 2.5 },
    alternateRowStyles: { fillColor: CREAM },
    didDrawPage: (d) => { y = (d.cursor?.y ?? y) + 4 },
  })
  y = (doc as any).lastAutoTable.finalY + 5

  // ── SEHEMU 2: MALI ────────────────────────────────────────
  const mali = data.mali
  const ardhi   = mali.ardhi?.filter(p => v(p['aina-ardhi']) || v(p['mahali-ardhi'])) ?? []
  const benki   = mali.benki?.filter(b => v(b['jina-benki'])) ?? []
  const magari  = mali.magari?.filter(g => v(g['aina-gari'])) ?? []
  const nyingine = v(mali.nyingine)
  const kunaMali = ardhi.length || benki.length || magari.length || nyingine

  if (kunaMali) {
    sehemu('Mali na Rasilimali')

    if (ardhi.length) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...INK)
      doc.text('A. Ardhi na Nyumba', L, y); y += 5
      ardhi.forEach((p, i) => {
        const parts = []
        if (v(p['aina-ardhi'])) parts.push(cap(v(p['aina-ardhi'])))
        if (v(p['hati-ardhi'])) parts.push(`Hati: ${v(p['hati-ardhi'])}`)
        if (v(p['mahali-ardhi'])) parts.push(`Mahali: ${v(p['mahali-ardhi'])}`)
        if (v(p['thamani-ardhi'])) parts.push(`Thamani: TZS ${v(p['thamani-ardhi'])}`)
        if (v(p['mrithi-ardhi'])) parts.push(`Mrithi: ${v(p['mrithi-ardhi'])}`)
        mwili(`${i+1}. ${parts.join(' — ')}`, 4)
      })
      y += 2
    }

    if (benki.length) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...INK)
      doc.text('B. Akaunti za Benki', L, y); y += 5
      benki.forEach((b, i) => {
        const parts = []
        if (v(b['jina-benki'])) parts.push(v(b['jina-benki']))
        if (v(b['namba-benki'])) parts.push(`Akaunti: ${v(b['namba-benki'])}`)
        if (v(b['tawi-benki'])) parts.push(`Tawi: ${v(b['tawi-benki'])}`)
        if (v(b['mrithi-benki'])) parts.push(`Mrithi: ${v(b['mrithi-benki'])}`)
        mwili(`${i+1}. ${parts.join(' — ')}`, 4)
      })
      y += 2
    }

    if (magari.length) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...INK)
      doc.text('C. Magari', L, y); y += 5
      magari.forEach((g, i) => {
        const parts = []
        if (v(g['aina-gari'])) parts.push(v(g['aina-gari']))
        if (v(g['mwaka-gari'])) parts.push(`(${v(g['mwaka-gari'])})`)
        if (v(g['usajili-gari'])) parts.push(`Usajili: ${v(g['usajili-gari'])}`)
        if (v(g['mrithi-gari'])) parts.push(`Mrithi: ${v(g['mrithi-gari'])}`)
        mwili(`${i+1}. ${parts.join(' ')}`, 4)
      })
      y += 2
    }

    if (nyingine) {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...INK)
      doc.text('D. Mali Nyingine', L, y); y += 5
      mwili(nyingine, 4)
    }
  }

  // ── SEHEMU 3: WATEULE ─────────────────────────────────────
  const wateule = (data.wateule ?? []).filter(b => v(b['jina-mrithi']))
  if (wateule.length) {
    sehemu('Wateule wa Mirathi')
    const kunaKitu = (key: keyof typeof wateule[0]) => wateule.some(b => v(b[key]))
    const vichwa = ['#', 'Jina', 'Uhusiano', 'Mgawanyo']
    if (kunaKitu('nida-mrithi')) vichwa.push('NIDA')
    if (kunaKitu('simu-mrithi')) vichwa.push('Simu')

    const mwili_wateule = wateule.map((b, i) => {
      const row: string[] = [
        String(i+1),
        v(b['jina-mrithi']),
        cap(v(b['uhusiano-mrithi'])),
        v(b['mgawanyo-mrithi']) ? `${v(b['mgawanyo-mrithi'])}%` : '—',
      ]
      if (kunaKitu('nida-mrithi')) row.push(v(b['nida-mrithi']) || '—')
      if (kunaKitu('simu-mrithi')) row.push(v(b['simu-mrithi']) || '—')
      return row
    })

    autoTable(doc, {
      startY: y,
      margin: { left: L, right: L },
      head: [vichwa],
      body: mwili_wateule,
      headStyles: { fillColor: RUST, textColor: [255,255,255], fontSize: 8, fontStyle: 'bold' },
      styles: { fontSize: 9, textColor: INK, lineColor: BORDER, lineWidth: 0.3, cellPadding: 2.5 },
      alternateRowStyles: { fillColor: CREAM },
    })
    y = (doc as any).lastAutoTable.finalY + 5
  }

  // ── SEHEMU 4: MSIMAMIZI ───────────────────────────────────
  const ms = data.msimamizi
  const md = data.mdhamini
  if (v(ms.jina)) {
    sehemu('Msimamizi wa Wosia na Mdhamini')
    const ms_parts = [v(ms.jina)]
    if (v(ms.uhusiano)) ms_parts.push(`Uhusiano: ${v(ms.uhusiano)}`)
    if (v(ms.simu))     ms_parts.push(`Simu: ${v(ms.simu)}`)
    if (v(ms.nida))     ms_parts.push(`NIDA: ${v(ms.nida)}`)
    safu('Msimamizi Mkuu', ms_parts.join('  |  '))

    if (v(ms.mbadala_jina)) {
      const mb_parts = [v(ms.mbadala_jina)]
      if (v(ms.mbadala_simu)) mb_parts.push(`Simu: ${v(ms.mbadala_simu)}`)
      safu('Msimamizi Mbadala', mb_parts.join('  |  '))
    }

    if (v(md.jina)) {
      const md_parts = [v(md.jina)]
      if (v(md.uhusiano)) md_parts.push(`Uhusiano: ${v(md.uhusiano)}`)
      if (v(md.simu))     md_parts.push(`Simu: ${v(md.simu)}`)
      if (v(md.nida))     md_parts.push(`NIDA: ${v(md.nida)}`)
      safu('Mdhamini wa Watoto', md_parts.join('  |  '))
    }
  }

  // ── SEHEMU 5: MATAKWA ─────────────────────────────────────
  const mt = data.matakwa
  const kunaMtakwa = v(mt.mazishi) || v(mt.sadaka) || v(mt.masharti) || v(mt.madeni)
  if (kunaMtakwa) {
    sehemu('Matakwa Maalum')
    safu('Maelekezo ya Mazishi',       v(mt.mazishi))
    safu('Misaada ya Hisani / Sadaka', v(mt.sadaka))
    safu('Masharti Maalum',            v(mt.masharti))
    safu('Madeni ya Kulipwa',          v(mt.madeni))
  }

  // ── SEHEMU 6: MASHAHIDI ───────────────────────────────────
  const sh = data.mashahidi
  const sh1 = v(sh.shahidi1_jina)
  const sh2 = v(sh.shahidi2_jina)
  if (sh1 || sh2) {
    sehemu('Mashahidi')
    mwili('Wosia huu umesainiwa mbele ya mashahidi wafuatao wazima, ambao si wateule wa wosia huu wala wawakilishi wao, kwa mujibu wa Probate and Administration of Estates Act, Cap. 352 (R.E. 2023).')
    y += 2
    if (sh1) { const p = [sh1]; if (v(sh.shahidi1_nida)) p.push(`NIDA: ${v(sh.shahidi1_nida)}`); safu('Shahidi wa 1', p.join('  |  ')) }
    if (sh2) { const p = [sh2]; if (v(sh.shahidi2_nida)) p.push(`NIDA: ${v(sh.shahidi2_nida)}`); safu('Shahidi wa 2', p.join('  |  ')) }
  }

  // ── SAINI ─────────────────────────────────────────────────
  checkPage(60)
  y += 8
  doc.setDrawColor(...BORDER); doc.setLineWidth(0.3); doc.line(L, y, R, y); y += 6

  const sigY = y
  const cols = [L, L+45, L+90, L+138]
  const sigW = 40

  cols.forEach(x => {
    doc.setDrawColor(...INK); doc.setLineWidth(0.4)
    doc.line(x, sigY, x + sigW, sigY)
  })
  y = sigY + 4

  const sigLabels = [
    ['Mwandishi wa Wosia', jina_kamili],
    ['Wakili / Advocate', 'Namba ya Usajili: _______', 'Muhuri:'],
    ['Shahidi wa 1', sh1 || '_______________'],
    ['Shahidi wa 2', sh2 || '_______________'],
  ]
  sigLabels.forEach((lines, i) => {
    let sy = y
    lines.forEach(line => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(...MID)
      doc.text(line, cols[i] + sigW/2, sy, { align: 'center' })
      sy += 3.5
    })
  })
  y += 18

  // ── TANGAZO LA KISHERIA ───────────────────────────────────
  checkPage(25)
  doc.setDrawColor(...BORDER); doc.setLineWidth(0.3); doc.line(L, y, R, y); y += 5
  doc.setFont('helvetica', 'bolditalic'); doc.setFontSize(7.5); doc.setTextColor(...MID)
  doc.text('Sheria Zinazosimamia:', L, y); y += 4
  doc.setFont('helvetica', 'italic')
  const sheria = 'Sheria ya Uthibitishaji Wosia na Usimamizi wa Mirathi, Sura ya 352 (R.E. 2023) · Judicature and Application of Laws Act, Cap. 358 (R.E. 2019) · Local Customary Law (Declaration) Order, GN 436 of 1963 · The Land Act (1999) & Village Land Act (1999) · Law of Marriage Act, Cap. 29 (R.E. 2022)'
  const sheriaLines = doc.splitTextToSize(sheria, TW)
  doc.text(sheriaLines, L, y); y += sheriaLines.length * 4 + 3

  doc.setFont('helvetica', 'italic'); doc.setFontSize(7.5)
  const tangazo = 'Hati hii haina nguvu ya kisheria hadi itakaposainiwa mbele ya mashahidi wawili wazima na wakili aliyesajiliwa na Tanganyika Law Society au Zanzibar Law Society. Mshauri wa kisheria anashauriwa sana. Sheria za mirathi za Tanzania zinafanyiwa mapitio kuhusu haki za wanawake.'
  const tangazoLines = doc.splitTextToSize(tangazo, TW)
  doc.text(tangazoLines, L, y)

  doc.save('Wosia_Wangu.pdf')
}
