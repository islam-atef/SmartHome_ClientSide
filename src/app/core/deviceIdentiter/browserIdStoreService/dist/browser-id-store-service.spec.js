"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var browser_id_store_service_1 = require("./browser-id-store-service");
describe('BrowserIdStoreService', function () {
    var service;
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
        service = testing_1.TestBed.inject(browser_id_store_service_1.BrowserIdStoreService);
    });
    it('should be created', function () {
        expect(service).toBeTruthy();
    });
});
