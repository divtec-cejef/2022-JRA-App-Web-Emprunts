import device from './plugins/cordova-plugin-device'
import barcodeScanner from './plugins/cordova-plugin-barcodeScanner'

export default {
  install: (Vue, options) => {

    device.install(Vue,
      options,
      pluginLoaded => {
        if (pluginLoaded) {
          Vue.cordova.plugins.push(device);
        }
      });

    barcodeScanner.install(Vue,
      options,
      pluginLoaded => {
        if (pluginLoaded) {
          Vue.cordova.plugins.push(barcodeScanner);
        }
      });
  }
};
