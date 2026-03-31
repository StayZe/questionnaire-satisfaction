'use client'

import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Star, Send } from 'lucide-react'
import { submitReponse } from '@/app/(frontend)/actions'

// Variants for elegant fade-up animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const SliderField = ({
  value,
  onChange,
}: {
  value: number
  onChange: (val: number) => void
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const percentage = ((value - 1) / 9) * 100
  return (
    <div
      className="slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="slider-tooltip"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          left: `${percentage}%`,
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
          y: isHovered ? 0 : 5,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 40,
          opacity: { duration: 0.1 },
        }}
      >
        {value}
      </motion.div>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="slider"
      />
      <div className="slider-labels">
        <span>Rouge (1)</span>
        <span>Vert (10)</span>
      </div>
    </div>
  )
}

export default function QuestionnaireForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [formData, setFormData] = useState({
    // Accueil & Service
    accueil: '',
    attente: '',
    serviceGlobal: '',
    // Repas
    qualitePlats: 0,
    portions: '',
    portionsAutre: '',
    prix: '',
    // Cadre & Ambiance
    propreteSalle: 5,
    propreteSanitaires: 5,
    equipementEnfants: '',
    // Impressions
    plusApprecie: '',
    amelioration: '',
    frequence: '',
    retourner: '',
    // Personal Info
    nom: '',
    prenom: '',
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const renderStars = (field: string, value: number) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= value ? 'active' : ''}`}
            onClick={() => handleChange(field, star)}
          >
            <Star size={36} fill={star <= value ? 'currentColor' : 'none'} strokeWidth={1.5} />
          </button>
        ))}
      </div>
    )
  }

  const renderPills = (field: keyof typeof formData, options: string[]) => {
    return (
      <div className="options-grid">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className={`option-pill ${formData[field] === option ? 'active' : ''}`}
            onClick={() => handleChange(field, option)}
          >
            {option}
          </button>
        ))}
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const result = await submitReponse(formData)

      if (!result.success) {
        throw new Error(result.error)
      }

      setIsSuccess(true)
    } catch (error) {
      console.error('Error during form submission:', error)
      setErrorMessage("Une erreur s'est produite lors de l'enregistrement. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        className="container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="section-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ color: 'var(--success)', marginBottom: '1.5rem' }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              <Send size={64} style={{ display: 'inline-block' }} />
            </motion.div>
          </div>
          <h1 className="title-font" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            Merci beaucoup !
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>
            Votre avis a bien été enregistré. Toute l'équipe de l'échequier vous remercie et espère vous revoir très vite !
          </p>
        </div>
      </motion.div>
    )
  }

  const renderMatrix = () => {
    const matrixOptions = ['Très insatisfait', 'Insatisfait', 'Neutre', 'Satisfait', 'Très satisfait']
    const matrixQuestions = [
      { id: 'accueil', label: "L'accueil de l'équipe" },
      { id: 'attente', label: "Le temps d'attente" },
      { id: 'serviceGlobal', label: "Le service global" }
    ]

    return (
      <div className="matrix-table-container">
        <table className="matrix-table">
          <thead>
            <tr>
              <th></th>
              {matrixOptions.map((opt) => (
                <th key={opt}>{opt}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixQuestions.map((q) => (
              <tr key={q.id}>
                <td className="matrix-question">{q.label}</td>
                {matrixOptions.map((opt) => (
                  <td key={opt} className="matrix-cell" onClick={() => handleChange(q.id, opt)}>
                    <div className={`matrix-radio ${formData[q.id as keyof typeof formData] === opt ? 'active' : ''}`} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <motion.div
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="header" variants={itemVariants}>
        <h1 className="title-font">Merci d'avoir choisi l'échequier</h1>
        <p>
          Votre retour nous aide à améliorer nos services et à mieux répondre à vos besoins. Ce
          questionnaire ne prend que 2min !
        </p>
        {errorMessage && (
          <p style={{ color: 'var(--error)', marginTop: '1rem', fontWeight: 'bold' }}>
            {errorMessage}
          </p>
        )}
      </motion.div>

      <form onSubmit={handleSubmit}>
        {/* SECTION 1: L'Accueil & Service */}
        <motion.div className="section-card" variants={itemVariants}>
          <h2 className="section-title">1. L'Accueil & Service</h2>
          {renderMatrix()}
        </motion.div>

        {/* SECTION 2: Le Repas */}
        <motion.div className="section-card" variants={itemVariants}>
          <h2 className="section-title">2. Le Repas</h2>

          <div className="question-group">
            <span className="question-label">
              Comment évaluez-vous la qualité des plats servis ?
            </span>
            {renderStars('qualitePlats', formData.qualitePlats)}
          </div>

          <div className="question-group">
            <span className="question-label">Les portions étaient-elles généreuses ?</span>
            {renderPills('portions', ['Oui', 'Non', 'Autre'])}
            {formData.portions === 'Autre' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ marginTop: '1rem' }}
              >
                <input
                  type="text"
                  className="text-input"
                  placeholder="Précisez votre avis..."
                  value={formData.portionsAutre}
                  onChange={(e) => handleChange('portionsAutre', e.target.value)}
                />
              </motion.div>
            )}
          </div>

          <div className="question-group">
            <span className="question-label">Que pensez-vous du rapport qualité/prix ?</span>
            {renderPills('prix', [
              "Je ne m'attendais pas à de si petits prix 😅",
              'Raisonnable',
              'Cher',
              'Hors de prix',
            ])}
          </div>
        </motion.div>

        {/* SECTION 3: Le Cadre & L'Ambiance */}
        <motion.div className="section-card" variants={itemVariants}>
          <h2 className="section-title">3. Le Cadre & L'Ambiance</h2>

          <div className="question-group">
            <span className="question-label">La propreté de la salle ?</span>
            <SliderField
              value={formData.propreteSalle}
              onChange={(val) => handleChange('propreteSalle', val)}
            />
          </div>

          <div className="question-group">
            <span className="question-label">La propreté des sanitaires ?</span>
            <SliderField
              value={formData.propreteSanitaires}
              onChange={(val) => handleChange('propreteSanitaires', val)}
            />
          </div>

          <div className="question-group">
            <span className="question-label">
              L'équipement pour les enfants vous a-t-il paru complet ?
            </span>
            <input
              type="text"
              className="text-input"
              placeholder="(Optionnel) Chaise haute, table à langer..."
              value={formData.equipementEnfants}
              onChange={(e) => handleChange('equipementEnfants', e.target.value)}
            />
          </div>
        </motion.div>

        {/* SECTION 4: Vos Impressions & Fidélité */}
        <motion.div className="section-card" variants={itemVariants}>
          <h2 className="section-title">4. Vos Impressions & Fidélité</h2>

          <div className="question-group">
            <span className="question-label">
              Qu'avez-vous le plus apprécié lors de votre visite ?
            </span>
            <textarea
              className="text-input"
              rows={3}
              placeholder="Ex: La sympathie du serveur, la cuisson de la viande..."
              value={formData.plusApprecie}
              onChange={(e) => handleChange('plusApprecie', e.target.value)}
            />
          </div>

          <div className="question-group">
            <span className="question-label">
              Que pourrions-nous améliorer pour votre prochaine venue ?
            </span>
            <textarea
              className="text-input"
              rows={3}
              placeholder="Ex: Plus de choix végétariens, un fond musical moins fort..."
              value={formData.amelioration}
              onChange={(e) => handleChange('amelioration', e.target.value)}
            />
          </div>

          <div className="question-group">
            <span className="question-label">Fréquentez-vous souvent notre établissement ?</span>
            {renderPills('frequence', [
              'Première fois 😊',
              'Parfois',
              'De temps en temps',
              'Souvent',
              'Très souvent',
            ])}
          </div>

          <div className="question-group">
            <span className="question-label">Pensez-vous revenir nous voir ?</span>
            {renderPills('retourner', ['Oui, avec plaisir', 'Peut-être', 'Non'])}
          </div>
        </motion.div>

        {/* SECTION 5: Informations Personnelles */}
        <motion.div className="section-card" variants={itemVariants}>
          <h2 className="section-title">5. Informations Personnelles</h2>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="question-group" style={{ flex: '1 1 200px' }}>
              <span className="question-label" style={{ marginBottom: '0.5rem' }}>Prénom (Optionnel)</span>
              <input
                type="text"
                className="text-input"
                placeholder="Ex: Jean"
                value={formData.prenom}
                onChange={(e) => handleChange('prenom', e.target.value)}
              />
            </div>
            
            <div className="question-group" style={{ flex: '1 1 200px' }}>
              <span className="question-label" style={{ marginBottom: '0.5rem' }}>Nom (Optionnel)</span>
              <input
                type="text"
                className="text-input"
                placeholder="Ex: Dupont"
                value={formData.nom}
                onChange={(e) => handleChange('nom', e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        <motion.div className="submit-container" variants={itemVariants}>
          <button type="submit" className="submit-btn" disabled={isSubmitting} style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
            {isSubmitting ? (
              'Envoi en cours...'
            ) : (
              <>
                <Send
                  size={20}
                  style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }}
                />
                Envoyer mes réponses
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  )
}
