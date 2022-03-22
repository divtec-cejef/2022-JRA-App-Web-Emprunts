# app-emprunts (app-emprunts)

Application pour la gestion d'emprunt de matériels

## Install the dependencies
```bash
npm install
```

1.	Ouvrir le dossier du projet Quasar dans le terminal
2.	Ajouter cordova au projet

```quasar mode add cordova```

3.	What is the Cordova app id ?

```ch.divtec.bendsev.emprunts```

4.	Aller dans le nouveau dossier src-cordova

```cd src-cordova```

5.	Ajouter Android au projet Cordova

```cordova platform add android```


```cordova platform add ios```

6.	Ajouter les plugins

```cordova plugin add phonegap-plugin-barcodescanner```

```cordova plugin add phonegap-nfc```


### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev -m cordova -T ios
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
