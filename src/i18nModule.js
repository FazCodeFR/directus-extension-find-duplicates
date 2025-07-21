
export const messages = {
  en: {
    title: 'Find Duplicates',
    selectCollection: 'Select a Collection',
    chooseCollection: 'Choose a collection',
    selectField: 'Select a Field',
    chooseField: 'Choose a field',
    findDuplicates: 'Find Duplicates',
    noDuplicates: 'No duplicates found 🎉',
    duplicatesFound: 'Duplicates Found',
    openItem: 'Open Item',
    duplicatesFor: 'Duplicates for',
    value: 'Value',
    times: 'times',
  },
  fr: {
    title: 'Rechercher les doublons',
    selectCollection: 'Sélectionner une collection',
    chooseCollection: 'Choisir une collection',
    selectField: 'Sélectionner un champ',
    chooseField: 'Choisir un champ',
    findDuplicates: 'Rechercher les doublons',
    noDuplicates: 'Aucun doublon trouvé 🎉',
    duplicatesFound: 'Doublons trouvés',
    openItem: 'Ouvrir l\'élément',
    duplicatesFor: 'Doublons pour',
    value: 'Valeur',
    times: 'fois',
  },
  en: {
    title: 'Yinelenenleri Bul',
    selectCollection: 'Bir koleksiyon seçin',
    chooseCollection: 'Bir koleksiyon seçin',
    selectField: 'Bir alan seçin',
    chooseField: 'Bir alan seçin',
    findDuplicates: 'Yinelenenleri Bul',
    noDuplicates: 'Hiç yineleyen değer yok 🎉',
    duplicatesFound: 'Yinelenen değerler bulundu',
    openItem: 'Kaydı Aç',
    duplicatesFor: 'Yinelenenler için',
    value: 'Değer',
    times: 'tekrar',
  },
};


export function resolveLocale(locale) {
  if (locale) {
    if (locale.includes('-')) {
      return locale.split('-')[0].toLowerCase();
    }
    return locale.toLowerCase();
  }
  return 'en';
}
