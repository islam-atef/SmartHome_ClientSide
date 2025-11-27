"use strict";
exports.__esModule = true;
exports.BrowserIdentifierModel = void 0;
var uuid_1 = require("uuid");
var BrowserIdentifierModel = /** @class */ (function () {
    function BrowserIdentifierModel() {
        this.deviceIdentifier = uuid_1.v4();
        this.createdAt = new Date();
        this.isActive = true;
        this.updatedAt = null;
        this.isUpdated = false;
        this.deletedAt = null;
    }
    return BrowserIdentifierModel;
}());
exports.BrowserIdentifierModel = BrowserIdentifierModel;
