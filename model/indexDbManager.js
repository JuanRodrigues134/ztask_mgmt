sap.ui.define([], function () {
  "use strict";

  let db;

  return {
    // INDEX DB
    openDB: function () {
      const indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;
      const request = indexedDB.open("TASKS_DB", 1);

      request.onerror = () => console.error;

      request.onsuccess = () => {
        db = request.result;
      };

      request.onupgradeneeded = () => {
        db = request.result;

        db.createObjectStore("tasks", {
          keyPath: "taskId",
        });
      };
    },

    async putObjectStore(storeName, data) {
      await this._DBPromisse(
        db.transaction([storeName], "readwrite").objectStore(storeName).put(data)
      );
    },

    async addObjectStore(storeName, data) {
      await this._DBPromisse(
        db.transaction([storeName], "readwrite").objectStore(storeName).add(data)
      );
    },

    async removeObjectStore(storeName, sValue) {
      await this._DBPromisse(
        db.transaction([storeName], "readwrite").objectStore(storeName).delete(sValue)
      );
    },

    async clearObjectStore(storeName) {
      await this._DBPromisse(
        db.transaction([storeName], "readwrite").objectStore(storeName).clear()
      );
    },

    async getAllObjectStore(storeName) {
      var result = await this._DBPromisse(
        db.transaction([storeName], "readonly").objectStore(storeName).getAll()
      );

      return result;
    },

    async getObjectStore(storeName, sValue) {
      var result = await this._DBPromisse(
        db.transaction([storeName], "readonly").objectStore(storeName).get(sValue)
      );

      return result;
    },

    _DBPromisse: function (request) {
      return new Promise(function (resolve, reject) {
        request.onsuccess = function (e) {
          resolve(e.target.result);
        };
        request.onerror = function (e) {
          reject(e.target.error);
        };
      });
    },
  };
});
