exports.install = function(Vue, options, cb) {
  document.addEventListener('deviceready',
    () => {
      if (typeof window.cordova.plugins.barcodeScanner === 'undefined') {
        return cb(false);
      }
      // pass through the Barcode Scanner object
      Vue.cordova.barcodeScanner = window.cordova.plugins.barcodeScanner;
      return cb(true);
    },
    false);
};
