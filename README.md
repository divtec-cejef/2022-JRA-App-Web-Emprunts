# Application gestion des emprunts et des retours de la section informatique

## Présentation
L'application a pour but de gérer les emprunts et les retours de la section informatique. La partie authentification a été developpé par M. Fallet et m'a été fourni fonctionnelle. La seule partie réalisée par moi a été la page gestion. Cette page gère l'enregistrement des emprunts et des retours. (https://github.com/divtec-cejef/2022-JRA-App-Web-Emprunts/blob/multiple-articles/src/pages/Gestion.vue)

La branche principale correspond à "multiple-articles".

## Installer les dépendances
```bash
npm install
```

## Mise en place de cordova

### Ajouter cordova au projet
```bash
quasar mode add cordova
```

### Qu'elle est l’id Cordova de l’application ?
```bash
ch.divtec.bendsev.emprunts
```

### Aller dans le nouveau dossier src-cordova
```bash
cd src-cordova
```

### Ajouter Android au projet Cordova
```bash
cordova platform add android
```

### Ajouter iOS au projet Cordova
```bash
cordova platform add ios
```

### Ajouter un plugin pour le scan des QR codes
```bash
cordova plugin add phonegap-plugin-barcodescanner
```

### Ajouter un plugin pour le scan de puces NFC
```bash
cordova plugin add phonegap-nfc
```

### Builder l'application pour Android
```bash
quasar build -m android
```

### Builder l'application pour iOS
```bash
quasar build -m ios
```



