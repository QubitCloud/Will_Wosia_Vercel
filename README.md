# Wosia Wangu — Next.js (Vercel)

Toleo la Next.js la Wosia Wangu — linaweza kupakiwa moja kwa moja kwenye Vercel.

PDF inatengenezwa upande wa mteja (client-side) kwa kutumia jsPDF — hakuna backend, hakuna server, hakuna database.

---

## Kuendesha Mahali (Local)

```bash
npm install
npm run dev
```

Fungua: http://localhost:3000

---

## Kupakia Vercel

### Hatua 1 — Weka GitHub
```bash
git init
git add .
git commit -m "Wosia Wangu — toleo la kwanza"
```
GitHub → New Repository → `wosia-wangu` → copy URL →
```bash
git remote add origin https://github.com/JINA-LAKO/wosia-wangu.git
git push -u origin main
```

### Hatua 2 — Deploy Vercel
1. Nenda [vercel.com](https://vercel.com) → Sign up na GitHub
2. **Add New → Project**
3. Chagua repo yako `wosia-wangu`
4. Framework: **Next.js** (itatambulika otomatiki)
5. **Deploy** → dakika 2 → URL yako ipo

---

## Muundo wa Mradi

```
wosia-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx          ← Root layout
│   │   ├── globals.css         ← Design tokens
│   │   ├── page.tsx            ← Landing page
│   │   ├── page.module.css
│   │   └── fomu/
│   │       ├── page.tsx        ← Fomu ya hatua 6 (Client Component)
│   │       └── fomu.module.css
│   └── lib/
│       ├── types.ts            ← TypeScript types
│       └── pdfGenerator.ts     ← PDF builder (jsPDF)
├── package.json
├── next.config.js
├── tsconfig.json
└── vercel.json
```

---

## Sheria Zinazosimamia

- **Sheria ya Uthibitishaji Wosia na Usimamizi wa Mirathi, Sura ya 352 (R.E. 2023)**
- Judicature and Application of Laws Act, Cap. 358 (R.E. 2019)
- Local Customary Law (Declaration) Order, GN 436 of 1963
- The Land Act (1999) & Village Land Act (1999)
- Law of Marriage Act, Cap. 29 (R.E. 2022)
