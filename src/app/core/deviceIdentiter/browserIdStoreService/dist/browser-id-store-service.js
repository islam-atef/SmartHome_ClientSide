"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BrowserIdStoreService = void 0;
var core_1 = require("@angular/core");
var BrowserIdStoreService = /** @class */ (function () {
    function BrowserIdStoreService() {
        this.KEY = 'device_id_v1';
    }
    // -----------------------------
    // GET device id
    // -----------------------------
    BrowserIdStoreService.prototype.getBrowserId = function () {
        var json = localStorage.getItem(this.KEY);
        if (!json || json.trim() === '') {
            return null;
        }
        try {
            return JSON.parse(json);
        }
        catch (err) {
            console.error('[BrowserIdStore] Invalid token JSON in localStorage. Clearing.', err);
            this.clearBrowserId();
            return null;
        }
    };
    // -----------------------------
    // SAVE device id
    // -----------------------------
    BrowserIdStoreService.prototype.saveBrowserId = function (deviceId) {
        try {
            var json = JSON.stringify(deviceId);
            localStorage.setItem(this.KEY, json);
        }
        catch (err) {
            console.error('[BrowserIdStore] Failed to save tokens', err);
        }
    };
    // -----------------------------
    // CLEAR device id
    // -----------------------------
    BrowserIdStoreService.prototype.clearBrowserId = function () {
        localStorage.removeItem(this.KEY);
    };
    BrowserIdStoreService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], BrowserIdStoreService);
    return BrowserIdStoreService;
}());
exports.BrowserIdStoreService = BrowserIdStoreService;
