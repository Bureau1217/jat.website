/**
 * Interface texts in English, keyed by their French version — the code
 * keeps reading in French (the default language) and a missing entry
 * simply falls back to it. Editorial content is translated in the Panel,
 * not here.
 */
const EN: Record<string, string> = {
  // Navigation, footer
  'Jazz à Tours — accueil': 'Jazz à Tours — home',
  'Navigation principale': 'Main navigation',
  'Ouvrir le menu': 'Open the menu',
  'Fermer le menu': 'Close the menu',
  'Sections de la page': 'Page sections',
  'Pages de la rubrique': 'Section pages',
  'Langue': 'Language',
  'E-mail': 'Email',
  'e-mail': 'email',
  'Prénom': 'First name',
  'Nom': 'Last name',
  'S’inscrire': 'Subscribe',
  'Pour vous tenir au courant de l’actualité de l’école, inscrivez-vous à notre': 'To keep up with the school’s news, subscribe to our',
  'Merci, vous êtes inscrit·e à la newsletter.': 'Thank you, you are subscribed to the newsletter.',
  'L’adresse e-mail n’est pas valide.': 'This email address is not valid.',
  'L’inscription à la newsletter ouvre bientôt.': 'Newsletter sign-up opens soon.',
  'Une erreur est survenue, réessayez ou écrivez-nous.': 'Something went wrong, please try again or write to us.',
  'Infos pratiques': 'Practical info',
  'Nous contacter': 'Contact us',
  'Référent·es VHSS': 'Harassment contacts',
  'Référent·e handicap': 'Disability contact',
  'Référent·es handicap': 'Disability contacts',
  'Mentions légales': 'Legal notice',
  'Politique de confidentialité': 'Privacy policy',
  // Practical info
  'Informations pratiques': 'Practical information',
  'Transports': 'Getting here',
  'Horaires d’ouverture': 'Opening hours',
  'Situation de handicap': 'Disability access',
  'Personne référente': 'Contact person',
  'Personnes référentes': 'Contact persons',
  'Carte': 'Map',
  // Agenda, news
  'Agenda': 'Agenda',
  'Actualités': 'News',
  'À la une': 'Featured',
  'À venir': 'Upcoming',
  'Passé': 'Past',
  'Tout': 'All',
  'Filtrer par catégorie': 'Filter by category',
  'Aucun événement à venir dans cette catégorie.': 'No upcoming event in this category.',
  'charger +': 'load more +',
  'Date': 'Date',
  'Horaires': 'Times',
  'Lieu': 'Venue',
  'Catégories': 'Categories',
  'Galerie': 'Gallery',
  'Galerie photos': 'Photo gallery',
  'Informations pratiques et galerie': 'Practical information and gallery',
  // Related content, three columns
  'Sommaire': 'Contents',
  'Contenus liés': 'Related content',
  'Actualités en lien': 'Related news',
  'Formations en lien': 'Related courses',
  'Formations concernées': 'Related courses',
  'Témoignage': 'Testimonial',
  'Lauréats': 'Award winners',
  // Team
  'Enseignant·es': 'Teachers',
  'Instruments': 'Instruments',
  'Ateliers': 'Workshops',
  'contacter': 'contact',
  'Parcours': 'Background',
  'Cursus': 'Training',
  'Groupe·s': 'Band(s)',
  'Collaborations': 'Collaborations',
  'Liens': 'Links',
  'Vidéo': 'Video',
  'réduire la fiche': 'close',
  'Enseignant·e': 'Teacher',
  // Programs
  'Descriptif': 'Description',
  'Déroulé': 'Outline',
  // Carousel
  'Photos': 'Photos',
  'Photo': 'Photo',
  'Photos précédentes': 'Previous photos',
  'Photos suivantes': 'Next photos',
  'sur': 'of',
  // Errors
  'Page introuvable': 'Page not found',
  'Erreur serveur': 'Server error'
}

/** `french` in the language of the current route. */
export function t(french: string): string {
  return currentLocale() === 'en' ? EN[french] ?? french : french
}
