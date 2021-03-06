class IpLoadBalancerServerService {
    constructor ($q, $translate, IpLoadBalancerConfigurationService, OvhApiIpLoadBalancing, ServiceHelper, RegionService) {
        this.$q = $q;
        this.$translate = $translate;
        this.IpLoadBalancerConfigurationService = IpLoadBalancerConfigurationService;
        this.IpLoadBalancing = OvhApiIpLoadBalancing;
        this.RegionService = RegionService;
        this.ServiceHelper = ServiceHelper;

        this.Server = {
            tcp: this.IpLoadBalancing.Farm().Tcp().Server().Lexi(),
            udp: this.IpLoadBalancing.Farm().Udp().Server().Lexi(),
            http: this.IpLoadBalancing.Farm().Http().Server().Lexi()
        };
    }

    getServer (serviceName, farmId, serverId) {
        return this.getFarmType(serviceName, farmId)
            .then(type => this.Server[type].get({
                serviceName,
                farmId,
                serverId
            }).$promise);
    }

    create (type, serviceName, farmId, server) {
        return this.Server[type].post({
            serviceName,
            farmId
        }, server)
            .$promise
            .then(this.ServiceHelper.successHandler("iplb_server_add_success"))
            .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
            .catch(this.ServiceHelper.errorHandler("iplb_server_add_error"));
    }

    update (type, serviceName, farmId, serverId, server) {
        return this.Server[type].put({
            serviceName,
            farmId,
            serverId
        }, server)
            .$promise
            .then(this.ServiceHelper.successHandler("iplb_server_update_success"))
            .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
            .catch(this.ServiceHelper.errorHandler("iplb_server_update_error"));
    }

    delete (serviceName, farmId, serverId) {
        return this.getFarmType(serviceName, farmId)
            .then(type => this.Server[type].delete({
                serviceName,
                farmId,
                serverId
            }).$promise)
            .then(this.ServiceHelper.successHandler("iplb_server_delete_success"))
            .then(() => this.IpLoadBalancerConfigurationService.showRefreshWarning())
            .catch(this.ServiceHelper.errorHandler("iplb_server_delete_error"));
    }

    getFarmType (serviceName, farmId) {
        return this.IpLoadBalancing.Farm().Lexi().query({ serviceName })
            .$promise
            .then(farms => {
                const farm = _.find(farms, { id: parseInt(farmId, 10) });
                return farm;
            })
            .then(farm => {
                if (!farm) {
                    return this.$q.reject("NOTFOUND");
                }
                return farm.type;
            });
    }

    getProxyProtocolVersions () {
        return this.IpLoadBalancing.Lexi().schema()
            .$promise
            .then(schema => schema.models["ipLoadbalancing.ProxyProtocolVersionEnum"].enum)
            .catch(this.ServiceHelper.errorHandler("iplb_server_request_error"));
    }
}

angular.module("managerApp")
    .service("IpLoadBalancerServerService", IpLoadBalancerServerService);
