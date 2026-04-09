import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <>
      <nav className={styles.nav}>
        <div className={styles.navLogo}>Wosia Wangu</div>
        <Link href="/fomu" className={styles.navBtn}>Anza Hapa</Link>
      </nav>

      <main className={styles.hero}>
        <div className={styles.card}>
          <p className={styles.eyebrow}>Wosia wa Maandishi</p>
          <h1 className={styles.title}>Andika <em>wosia</em> wako.</h1>
          <p className={styles.sub}>Jaza taarifa zako na uandae rasimu safi ya wosia wako.</p>
          <Link href="/fomu" className={styles.btnMain}>Anza Wosia Wako</Link>
          <p className={styles.note}>Utamalizia kusaini mbele ya wakili na mashahidi.</p>
        </div>
      </main>

      <section className={styles.jinsi}>
        <p className={styles.jinsiKichwa}>Jinsi Inavyofanya Kazi</p>

        {[
          { n: '1', h: 'Jaza Fomu', p: 'Toa taarifa zako za kibinafsi, mali, na wateule wako wa mirathi.' },
          { n: '2', h: 'Pakua PDF', p: 'Mfumo utatengeneza PDF ya wosia iliyopangwa vizuri — tayari kupakiwa.' },
          { n: '3', h: 'Peleka kwa Wakili', p: 'Wakili atasimamia usainiaji mbele ya mashahidi ili wosia uwe halali kisheria.' },
          { n: '4', h: 'Hifadhi Salama', p: 'Weka nakala na wakili wako na mwambie mtu unayemwamini mahali ilipo.' },
        ].map((h, i) => (
          <div key={i}>
            <div className={styles.hatua}>
              <div className={styles.hatua_n}>{h.n}</div>
              <div>
                <h3 className={styles.hatua_h}>{h.h}</h3>
                <p className={styles.hatua_p}>{h.p}</p>
              </div>
            </div>
            {i < 3 && <div className={styles.mgawanyo} />}
          </div>
        ))}

        <p className={styles.sheriaNoti}>
          Inazingatia: Sheria ya Uthibitishaji Wosia na Usimamizi wa Mirathi, Sura ya 352 (R.E. 2023) ·
          Judicature and Application of Laws Act, Cap. 358 · The Land Act (1999) · Law of Marriage Act, Cap. 29
        </p>
      </section>
    </>
  )
}
