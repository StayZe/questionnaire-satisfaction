import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers.js'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ReponseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  let reponse
  try {
    reponse = await payload.findByID({
      collection: 'reponses',
      id: id,
    })
  } catch (error) {
    notFound()
  }

  if (!reponse) notFound()

  const dateStr = reponse.createdAt as string
  const date = new Date(dateStr)
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)

  const nom = (reponse.nom as string) || 'Anonyme'
  const prenom = (reponse.prenom as string) || ''
  const fullName = `${prenom} ${nom}`.trim()

  const DetailRow = ({ label, value }: { label: string; value: any }) => (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">
        {value ? String(value) : <em className="detail-empty">Non renseigné</em>}
      </span>
    </div>
  )

  const Section = ({
    title,
    bg = 'white',
    children,
  }: {
    title: string
    bg?: string
    children: React.ReactNode
  }) => (
    <div className="section-card" style={{ margin: 0, backgroundColor: bg === 'white' ? 'var(--card-bg)' : bg }}>
      <h2 style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        {title}
      </h2>
      <div className="detail-grid">{children}</div>
    </div>
  )

  return (
    <div className="detail-container font-sans-fallback">
      <header className="detail-header">
        <Link href="/reponses" className="back-btn">
          <span>←</span> <span className="hide-mobile">Retour</span>
        </Link>
        <div>
          <h1 className="title-font detail-title">Réponse de {fullName}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Soumise le {formattedDate}
          </p>
        </div>
      </header>

      <div className="detail-grid">
        <Section title="Informations Personnelles">
          <DetailRow label="Prénom" value={reponse.prenom} />
          <DetailRow label="Nom" value={reponse.nom} />
        </Section>

        <Section title="1. L'Accueil & Service">
          <DetailRow label="Accueil de l'équipe" value={reponse.accueil} />
          <DetailRow label="Temps d'attente" value={reponse.attente} />
          <DetailRow label="Service global" value={reponse.serviceGlobal} />
        </Section>

        <Section title="2. Le Repas">
          <DetailRow label="Qualité des plats" value={`${reponse.qualitePlats} / 5`} />
          <DetailRow label="Les portions étaient-elles généreuses ?" value={reponse.portions} />
          {reponse.portions === 'Autre' && (
            <DetailRow label="Précisions sur les portions" value={reponse.portionsAutre} />
          )}
          <DetailRow label="Rapport qualité/prix" value={reponse.prix} />
        </Section>

        <Section title="3. Le Cadre & L'Ambiance">
          <DetailRow label="Propreté de la salle" value={`${reponse.propreteSalle} / 10`} />
          <DetailRow label="Propreté des sanitaires" value={`${reponse.propreteSanitaires} / 10`} />
          <DetailRow label="Équipement pour enfants" value={reponse.equipementEnfants} />
        </Section>

        <Section title="4. Impressions & Fidélité">
          <DetailRow label="Ce que vous avez le plus apprécié" value={reponse.plusApprecie} />
          <DetailRow label="Ce que nous pourrions améliorer" value={reponse.amelioration} />
          <DetailRow label="Fréquence de visite" value={reponse.frequence} />
          <DetailRow label="Pensez-vous revenir ?" value={reponse.retourner} />
        </Section>
      </div>
    </div>
  )
}
