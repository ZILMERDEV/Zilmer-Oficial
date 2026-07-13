/**
 * CÓDIGO ARQUIVADO - Seções removidas das páginas de áreas
 * 
 * Este arquivo contém o código das seções "Como Soluciona" e "Projetos Específicos"
 * que foram removidas conforme solicitado.
 * 
 * Para restaurar estas seções, copie o conteúdo de volta para page.tsx
 */

/* Solução Section - ARQUIVADA */
/*
      <section className={styles.solucaoSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{area.solucao.title}</h2>
            <div className={styles.titleUnderline}></div>
          </div>
          
          <div className={styles.solucaoGrid}>
            <div className={styles.solucaoCard}>
              <div className={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <h3 className={styles.cardTitle}>O Problema</h3>
              <div className={styles.cardText}>
                {renderText(area.solucao.problem)}
              </div>
            </div>
            
            <div className={styles.solucaoCard}>
              <div className={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Como Melhora</h3>
              <div className={styles.cardText}>
                {renderText(area.solucao.melhora)}
              </div>
            </div>
            
            <div className={styles.solucaoCard}>
              <div className={styles.cardIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className={styles.cardTitle}>Por que é Essencial</h3>
              <div className={styles.cardText}>
                {renderText(area.solucao.essencial)}
              </div>
            </div>
          </div>
        </div>
      </section>
*/

/* Projetos Section - ARQUIVADA */
/*
      <section className={styles.projetosSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Projetos Específicos</h2>
            <div className={styles.titleUnderline}></div>
            <p className={styles.sectionDescription}>
              Conheça projetos reais onde nossas soluções estão em operação
            </p>
          </div>
          
          <div className={styles.projetosGrid}>
            {area.projetos.map((projeto: { title: string; description: string; image: string }, index: number) => (
              <div key={index} className={styles.projetoCard}>
                <div className={styles.projetoImage}>
                  <Image
                    src={projeto.image}
                    alt={projeto.title}
                    fill
                    className={styles.projetoImageContent}
                  />
                  <div className={styles.projetoOverlay}>
                    <div className={styles.projetoNumber}>{String(index + 1).padStart(2, '0')}</div>
                  </div>
                </div>
                <div className={styles.projetoContent}>
                  <h3 className={styles.projetoTitle}>{projeto.title}</h3>
                  <p className={styles.projetoDescription}>{projeto.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
*/







