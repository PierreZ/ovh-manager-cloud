/**
 *  Two main sections (IaaS and PaaS)
 */
angular.module("managerApp")
    .config(function ($stateProvider) {
        $stateProvider
            .state("dbaas", {
                url: "/dbaas",
                abstract: true,
                template: "<ui-view/>",
                translations: ["common", "cloud"]
            });
    });
