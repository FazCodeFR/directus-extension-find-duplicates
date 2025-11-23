
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
    delete: 'Delete',
    deleting: 'Deleting...',
    confirmDelete: 'Are you sure you want to delete this item?',
    deleteError: 'Error deleting item. Please try again.',
    clickAgainToConfirm: 'Click again to confirm deletion',
    deleteAllDuplicates: 'Delete All Duplicates',
    deletingAll: 'Deleting All...',
    confirmDeleteAll: 'Are you sure you want to delete {count} duplicate items? This will keep only the first item in each duplicate group.',
    deleteAllError: 'Error deleting some items. Please check the console for details.',
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
    delete: 'Supprimer',
    deleting: 'Suppression...',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    deleteError: 'Erreur lors de la suppression. Veuillez réessayer.',
    clickAgainToConfirm: 'Cliquez à nouveau pour confirmer la suppression',
    deleteAllDuplicates: 'Supprimer tous les doublons',
    deletingAll: 'Suppression en cours...',
    confirmDeleteAll: 'Êtes-vous sûr de vouloir supprimer {count} éléments en double ? Cela ne gardera que le premier élément de chaque groupe de doublons.',
    deleteAllError: 'Erreur lors de la suppression de certains éléments. Veuillez vérifier la console pour plus de détails.',
  },
  tr: {
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
    delete: 'Sil',
    deleting: 'Siliniyor...',
    confirmDelete: 'Bu öğeyi silmek istediğinizden emin misiniz?',
    deleteError: 'Öğe silinirken hata oluştu. Lütfen tekrar deneyin.',
    clickAgainToConfirm: 'Silmeyi onaylamak için tekrar tıklayın',
    deleteAllDuplicates: 'Tüm Yinelenenleri Sil',
    deletingAll: 'Tümü Siliniyor...',
    confirmDeleteAll: '{count} yinelenen öğeyi silmek istediğinizden emin misiniz? Bu, her yinelenen grubundaki yalnızca ilk öğeyi tutacaktır.',
    deleteAllError: 'Bazı öğeler silinirken hata oluştu. Lütfen detaylar için konsolu kontrol edin.',
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
