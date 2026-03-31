import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'

export default async function ReponsesListPage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  
  // Security check: Only authenticated users (admins) can view this page
  const { user } = await payload.auth({ headers })
  
  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: 'var(--error)' }}>Accès Refusé</h1>
        <p>Vous devez être connecté en tant qu'administrateur pour voir les réponses.</p>
        <Link href="/admin/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
          Se connecter
        </Link>
      </div>
    )
  }

  const { docs: reponses } = await payload.find({
    collection: 'reponses',
    sort: '-createdAt',
    limit: 100,
  })

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 className="title-font" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            Tableau de bord : Réponses
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Liste des avis reçus par vos clients.</p>
        </div>
        <Link 
          href="/admin" 
          style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
        >
          Retour au Panel
        </Link>
      </header>

      {reponses.length === 0 ? (
        <div className="section-card" style={{ textAlign: 'center' }}>
          <p>Aucune réponse pour le moment.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {reponses.map((reponse) => {
            const dateStr = reponse.createdAt as string
            const date = new Date(dateStr)
            const formattedDate = new Intl.DateTimeFormat('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(date)
            
            // Format name
            const nom = (reponse.nom as string) || 'Anonyme'
            const prenom = (reponse.prenom as string) || ''
            const fullName = `${prenom} ${nom}`.trim()
            
            return (
              <div 
                key={reponse.id} 
                className="section-card" 
                style={{ 
                  margin: 0, 
                  padding: '1.5rem', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'transform 0.2s',
                }}
              >
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {fullName}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Soumis le {formattedDate}
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.875rem' }}>
                    <span><strong>Service:</strong> {reponse.serviceGlobal}</span>
                    <span><strong>Propreté:</strong> {reponse.propreteSalle}/10</span>
                  </div>
                </div>
                
                <Link 
                  href={`/reponses/${reponse.id}`}
                  style={{ 
                    padding: '0.5rem 1.5rem', 
                    border: '2px solid var(--primary)', 
                    color: 'var(--primary)', 
                    borderRadius: '9999px', 
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                >
                  Voir détails
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
