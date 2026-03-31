import type { CollectionConfig } from 'payload'

export const Reponses: CollectionConfig = {
  slug: 'reponses',
  labels: {
    singular: 'Réponse',
    plural: 'Réponses',
  },
  admin: {
    useAsTitle: 'createdAt',
    defaultColumns: ['createdAt', 'nom', 'prenom', 'accueil', 'serviceGlobal'],
  },
  access: {
    // Anyone can submit a response
    create: () => true,
    // Only authenticated admins can view/edit/delete
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '1. Accueil & Service',
          fields: [
            {
              name: 'accueil',
              type: 'text',
              label: "Comment évaluez-vous l'accueil ?",
            },
            {
              name: 'attente',
              type: 'text',
              label: "Temps d'attente",
            },
            {
              name: 'serviceGlobal',
              type: 'text',
              label: 'Service global',
            },
          ],
        },
        {
          label: '2. Le Repas',
          fields: [
            { name: 'qualitePlats', type: 'number', label: 'Qualité des plats (1 à 5)', min: 0, max: 5 },
            {
              name: 'portions',
              type: 'select',
              label: 'Les portions étaient-elles généreuses ?',
              options: [
                { label: 'Oui', value: 'Oui' },
                { label: 'Non', value: 'Non' },
                { label: 'Autre', value: 'Autre' },
              ],
            },
            {
              name: 'portionsAutre',
              type: 'text',
              label: 'Précisions sur les portions (si Autre)',
              admin: {
                condition: (data) => data.portions === 'Autre',
              },
            },
            {
              name: 'prix',
              type: 'select',
              label: 'Rapport qualité/prix',
              options: [
                { label: "Je ne m'attendais pas à de si petits prix 😅", value: "Je ne m'attendais pas à de si petits prix 😅" },
                { label: 'Raisonnable', value: 'Raisonnable' },
                { label: 'Cher', value: 'Cher' },
                { label: 'Hors de prix', value: 'Hors de prix' },
              ],
            },
          ],
        },
        {
          label: '3. Cadre & Ambiance',
          fields: [
            { name: 'propreteSalle', type: 'number', label: 'Propreté de la salle (1 à 10)', min: 1, max: 10 },
            { name: 'propreteSanitaires', type: 'number', label: 'Propreté des sanitaires (1 à 10)', min: 1, max: 10 },
            { name: 'equipementEnfants', type: 'textarea', label: 'Équipement pour enfants' },
          ],
        },
        {
          label: '4. Impressions & Fidélité',
          fields: [
            { name: 'plusApprecie', type: 'textarea', label: 'Ce que vous avez le plus apprécié' },
            { name: 'amelioration', type: 'textarea', label: 'Ce que nous pourrions améliorer' },
            {
              name: 'frequence',
              type: 'select',
              label: 'Fréquence de visite',
              options: [
                { label: 'Première fois 😊', value: 'Première fois 😊' },
                { label: 'Parfois', value: 'Parfois' },
                { label: 'De temps en temps', value: 'De temps en temps' },
                { label: 'Souvent', value: 'Souvent' },
                { label: 'Très souvent', value: 'Très souvent' },
              ],
            },
            {
              name: 'retourner',
              type: 'select',
              label: 'Pensez-vous revenir ?',
              options: [
                { label: 'Oui, avec plaisir', value: 'Oui, avec plaisir' },
                { label: 'Peut-être', value: 'Peut-être' },
                { label: 'Non', value: 'Non' },
              ],
            },
          ],
        },
        {
          label: '5. Informations Personnelles',
          fields: [
            { name: 'nom', type: 'text', label: 'Nom' },
            { name: 'prenom', type: 'text', label: 'Prénom' },
          ],
        },
      ],
    },
  ],
}
