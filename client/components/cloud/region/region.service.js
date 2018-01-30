class RegionService {
    constructor ($translate) {
        this.$translate = $translate;
    }

    static addOverQuotaInfos (region, quota) {
        const quotaByRegion = _.find(quota, { region: _.get(region, "microRegion.code") });
        const instanceQuota = _.get(quotaByRegion, "instance", false);
        if (instanceQuota) {
            if (instanceQuota.maxInstances !== -1 && instanceQuota.usedInstances >= instanceQuota.maxInstances) {
                region.disabled = "QUOTA_INSTANCE";
            } else if (instanceQuota.maxRam !== -1 && instanceQuota.usedRAM >= instanceQuota.maxRam) {
                region.disabled = "QUOTA_RAM";
            } else if (instanceQuota.maxCores !== -1 && instanceQuota.usedCores >= instanceQuota.maxCores) {
                region.disabled = "QUOTA_VCPUS";
            }
        }
    }

    getMacroRegion (region) {
        const macro = /[\D]{2,3}/.exec(region);
        return macro ? macro[0].toUpperCase() : "";
    }

    getMacroRegionLowercase (region) {
        const macro = this.getMacroRegion(region);
        return macro ? macro.toLowerCase() : "";
    }

    getRegionNumber (region) {
        const number = /[\d]+$/.exec(region);
        return number ? number[0] : "";
    }

    getTranslatedMacroRegion (region) {
        const translatedMacroRegion = this.$translate.instant(`cloud_common_region_${this.getMacroRegion(region)}`);
        return translatedMacroRegion || region;
    }

    getTranslatedMicroRegion (region) {
        const translatedMicroRegion = this.$translate.instant(`cloud_common_region_${this.getMacroRegion(region)}_micro`, {
            micro: region
        });
        return translatedMicroRegion || region;
    }

    getTranslatedMicroRegionLocation (region) {
        const translatedMicroRegionLocation = this.$translate.instant(`cloud_common_region_location_${this.getMacroRegion(region)}`);
        return translatedMicroRegionLocation || region;
    }

    getRegionIconFlag (region) {
        return `flag-icon-${this.getMacroRegionLowercase(region)}`;
    }

    getTranslatedRegionContinent (region) {
        const translatedRegionContinent = this.$translate.instant(`cloud_common_region_continent_${this.getMacroRegion(region)}`);
        return translatedRegionContinent || region;
    }

    getRegionCountry (region) {
        const translatedMicroRegionLocation = this.getTranslatedMicroRegionLocation(region);
        return _.trim(translatedMicroRegionLocation.split("(")[1], ")");
    }

    getRegion (region) {
        region = region.toUpperCase();
        return {
            macroRegion: {
                code: this.getMacroRegion(region),
                text: this.getTranslatedMacroRegion(region)
            },
            microRegion: {
                code: region,
                text: this.getTranslatedMicroRegion(region)
            },
            location: this.getTranslatedMicroRegionLocation(region),
            continent: this.getTranslatedRegionContinent(region),
            icon: this.getRegionIconFlag(region),
            country: this.getRegionCountry(region)
        };
    }
}

angular.module("managerApp").service("RegionService", RegionService);
