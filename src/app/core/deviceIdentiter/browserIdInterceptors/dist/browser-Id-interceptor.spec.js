"use strict";
exports.__esModule = true;
var testing_1 = require("@angular/core/testing");
var browser_Id_interceptor_1 = require("./browser-Id-interceptor");
describe('authInterceptor', function () {
    var interceptor = function (req, next) {
        return testing_1.TestBed.runInInjectionContext(function () { return browser_Id_interceptor_1.browserIdInterceptor(req, next); });
    };
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({});
    });
    it('should be created', function () {
        expect(interceptor).toBeTruthy();
    });
});
