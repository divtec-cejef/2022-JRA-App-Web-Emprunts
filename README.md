# Client web Qasar de base de la DIVTEC

## Présentation
Vous pouvez utiliser la version 0.0.1 de ce projet comme base de départ pour votre application Quasar.

Sur cette version, l’authentification n’est pas encore fonctionnelle.

En attendant, vous pouvez créer de nouvelles pages sans protection en suivant cette procédure :

1. Créer un composant dans le dossier `src/pages` en dupliquant le fichier  `Index.vue`
1. Définir la route vers votre page dans le fichier  `src/routes.js`
  - Créer la route pour votre page en ajoutant une entrée dans le tableau  `children`.
  -  La propriété `meta` d’une route permet de définir les rôles autorisés à consulter une page.
  -  Pour l’instant pas besoin de la définir pour votre route, qui sera donc accessible par tous.

1. Ajouter un lien au menu
1. Ouvrir le composant  `src/layouts/MainLayout.vue` et ajouter votre page dans le tableau `liens` à la `ligne 68`.
  - Laisser la propriété `roles` à `null` pour votre page.

Pour construire et exécuter votre application, voir le fichier `README.md`.

La configuration de l’api DIVTEC se trouve dans le dossier `src/boot/axios.js` mais n’est actuellement pas fonctionnelle.

Les fonctions, méthodes globales sont définies dans le dossier `src/functions` et les magasins vueX dans `src/store`.

Les variables des couleurs DIVTEC ont été définies dans `src/css/quasar.variables.sass`.

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
