import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'

export default async function ReponsesListPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: reponses } = await payload.find({
    collection: 'reponses',
    sort: '-createdAt',
    limit: 100,
  })

  return (
    <div className="dashboard-container font-sans-fallback">
      <header className="dashboard-header">
        <div>
          <h1 className="title-font dashboard-title">
            Tableau de bord : Réponses
          </h1>
          <p className="dashboard-subtitle">Liste des avis reçus par vos clients.</p>
        </div>
        <Link
          href="/"
          className="btn btn-primary"
        >
          Retour à l'accueil
        </Link>
      </header>

      {reponses.length === 0 ? (
        <div className="section-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <p>Aucune réponse pour le moment.</p>
        </div>
      ) : (
        <div className="response-list">
          {reponses.map((reponse) => {
            const dateStr = reponse.createdAt as string
            const date = new Date(dateStr)
            const formattedDate = new Intl.DateTimeFormat('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(date)

            // Format name
            const nom = (reponse.nom as string) || 'Anonyme'
            const prenom = (reponse.prenom as string) || ''
            const fullName = `${prenom} ${nom}`.trim()

            return (
              <div
                key={reponse.id}
                className="section-card response-card-compact"
              >
                <div className="response-info">
                  <h3>{fullName}</h3>
                  <p className="response-date">Soumis le {formattedDate}</p>
                  <div className="response-tags">
                    <span className="tag-badge">
                      <strong>Service:</strong> {reponse.serviceGlobal}
                    </span>
                    <span className="tag-badge">
                      <strong>Propreté:</strong> {reponse.propreteSalle}
                      /10
                    </span>
                  </div>
                </div>

                <Link
                  href={`/reponses/${reponse.id}`}
                  className="btn btn-outline"
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
