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
  
  // Security check
  const { user } = await payload.auth({ headers })
  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: 'var(--error)' }}>Accès Refusé</h1>
        <p>Vous devez être connecté en tant qu'administrateur pour afficher cette page.</p>
        <Link href="/admin/login" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Se connecter</Link>
      </div>
    )
  }

  let reponse
  try {
    reponse = await payload.findByID({
      collection: 'reponses',
      id: id,
    })
  } catch (error) {
    // If invalid ID
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
    minute: '2-digit'
  }).format(date)

  const nom = (reponse.nom as string) || 'Anonyme'
  const prenom = (reponse.prenom as string) || ''
  const fullName = `${prenom} ${nom}`.trim()

  const DetailRow = ({ label, value }: { label: string, value: any }) => (
    <div style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{value ? String(value) : <em style={{ color: '#ccc' }}>Non renseigné</em>}</span>
    </div>
  )

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Link 
          href="/reponses" 
          style={{ padding: '0.5rem 1rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)', borderRadius: '8px', textDecoration: 'none' }}
        >
          ← Retour
        </Link>
        <div>
          <h1 className="title-font" style={{ fontSize: '2rem', color: 'var(--primary)', margin: 0 }}>
            Réponse de {fullName}
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Soumise le {formattedDate}</p>
        </div>
      </header>

      <div style={{ display: 'grid', gap: '2rem' }}>
        <div className="section-card" style={{ margin: 0 }}>
          <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Informations Personnelles</h2>
          <DetailRow label="Prénom" value={reponse.prenom} />
          <DetailRow label="Nom" value={reponse.nom} />
        </div>

        <div className="section-card" style={{ margin: 0 }}>
          <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>1. Accueil & Service</h2>
          <DetailRow label="Accueil de l'équipe" value={reponse.accueil} />
          <DetailRow label="Temps d'attente" value={reponse.attente} />
          <DetailRow label="Service global" value={reponse.serviceGlobal} />
        </div>

        <div className="section-card" style={{ margin: 0 }}>
          <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>2. Le Repas</h2>
          <DetailRow label="Qualité des plats" value={`${reponse.qualitePlats} / 5`} />
          <DetailRow label="Les portions étaient-elles généreuses ?" value={reponse.portions} />
          {reponse.portions === 'Autre' && <DetailRow label="Précisions sur les portions" value={reponse.portionsAutre} />}
          <DetailRow label="Rapport qualité/prix" value={reponse.prix} />
        </div>

        <div className="section-card" style={{ margin: 0 }}>
          <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>3. Le Cadre & L'Ambiance</h2>
          <DetailRow label="Propreté de la salle" value={`${reponse.propreteSalle} / 10`} />
          <DetailRow label="Propreté des sanitaires" value={`${reponse.propreteSanitaires} / 10`} />
          <DetailRow label="Équipement pour enfants" value={reponse.equipementEnfants} />
        </div>

        <div className="section-card" style={{ margin: 0 }}>
          <h2 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>4. Impressions & Fidélité</h2>
          <DetailRow label="Ce que vous avez le plus apprécié" value={reponse.plusApprecie} />
          <DetailRow label="Ce que nous pourrions améliorer" value={reponse.amelioration} />
          <DetailRow label="Fréquentez-vous souvent notre établissement ?" value={reponse.frequence} />
          <DetailRow label="Pensez-vous revenir nous voir ?" value={reponse.retourner} />
        </div>
      </div>
    </div>
  )
}
