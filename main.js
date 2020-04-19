'use strict';

/*
 * Created with @iobroker/create-adapter v1.20.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require('@iobroker/adapter-core');

// Load modules here, e.g.:
const vbus = require('resol-vbus');
const _ = require('lodash');
// Variable definitions

const spec = vbus.Specification.getDefaultSpecification();
const ctx = {
    headerSet: vbus.HeaderSet(),
    hsc: vbus.HeaderSetConsolidator(),
    connection: vbus.Connection()
};

class MyVbus extends utils.Adapter {

    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: 'myvbus',
        });
        this.on('ready', this.onReady.bind(this));
        //this.on('objectChange', this.onObjectChange.bind(this));
        //this.on('stateChange', this.onStateChange.bind(this));
        // this.on('message', this.onMessage.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    // Is called when databases are connected and adapter received configuration.
    async onReady() {
        try {
            // Initialize adapter here

            // Reset the connection indicator during startup
            this.setState('info.connection', false, true);

            // Get system language
            let language = '';
            await this.getForeignObjectAsync('system.config').then(sysConf => {
                if (sysConf) {
                    // Get proper file of system language to avoid errors
                    language = sysConf.common.language;
                    if (!(language == 'en' || language == 'de' || language == 'fr')) {
                        language = 'en';
                    }
                } else {
                    language = 'en';
                }
            }).catch(err => {
                this.log.info(JSON.stringify(err));
            });

            // The adapters config (in the instance object everything under the attribute "native") is accessible via
            // this.config:
            let connectionDevice;
            let connectionIdentifier;
            let connectionPort;
            let vbusPassword;
            let vbusChannel;
            let vbusDataOnly;
            let vbusViaTag;
            let vbusInterval;
            let forceReInit;

            await this.getForeignObjectAsync('system.adapter.' + this.namespace).then(conf => {
                if (conf && conf.native) {
                    // Get proper file of system language to avoid errors
                    connectionDevice = conf.native.connectionDevice;
                    connectionIdentifier = conf.native.connectionIdentifier;
                    connectionPort = conf.native.connectionPort;
                    vbusPassword = conf.native.vbusPassword;
                    vbusChannel = conf.native.vbusChannel;
                    vbusDataOnly = conf.native.vbusDataOnly;
                    vbusViaTag = conf.native.vbusViaTag;
                    vbusInterval = conf.native.vbusInterval;
                    forceReInit = conf.native.forceReInit;
                } /*else {
                    connectionDevice = this.config.connectionDevice;
                    connectionIdentifier = this.config.connectionIdentifier;
                    connectionPort = this.config.connectionPort;
                    vbusPassword = this.config.vbusPassword;
                    vbusChannel = this.config.vbusChannel;
                    vbusDataOnly = this.config.vbusDataOnly;
                    vbusViaTag = this.config.vbusViaTag;
                    vbusInterval = this.config.vbusInterval;
                    forceReInit = this.config.forceReInit;
                }*/
            }).catch(err => {
                this.log.info(JSON.stringify(err));
            });
/*
            const connectionDevice = this.config.connectionDevice;
            const connectionIdentifier = this.config.connectionIdentifier;
            const connectionPort = this.config.connectionPort;
            let vbusPassword = this.config.vbusPassword;
            const vbusChannel = this.config.vbusChannel;
            const vbusDataOnly = this.config.vbusDataOnly;
            const vbusViaTag = this.config.vbusViaTag;
            const vbusInterval = this.config.vbusInterval;
            let forceReInit = this.config.forceReInit;
*/
            this.log.info(`Language: ${language}`);
            this.log.info(`Connection Type: ${connectionDevice}`);
            this.log.info(`Connection Identifier: ${connectionIdentifier}`);
            this.log.info(`Connection Port: ${connectionPort}`);
            this.log.info(`VBus Password: ${vbusPassword}`);
            this.log.info(`VBus Channel: ${vbusChannel}`);
            this.log.info(`VBus Via Tag: ${vbusViaTag}`);
            this.log.info(`VBus Interval: ${vbusInterval}`);
            this.log.info(`Force ReInit: ${forceReInit}`);

            // Check if credentials are not empty and decrypt stored password
            if (vbusPassword && vbusPassword !== '') {
                await this.getForeignObjectAsync('system.config').then(obj => {
                    if (obj && obj.native && obj.native.secret) {
                        //noinspection JSUnresolvedVariable
                        vbusPassword = this.decrypt(obj.native.secret, vbusPassword);
                        //this.log.info(`VBus Password decrypted: ${vbusPassword}`);
                    } else {
                        //noinspection JSUnresolvedVariable
                        vbusPassword = this.decrypt('Zgfr56gFe87jJOM', vbusPassword);
                        //this.log.info(`VBus Password decrypted: ${vbusPassword}`);
                    }
                }).catch(err => {
                    this.log.info(JSON.stringify(err));
                });

            } else {
                this.log.info('*** Adapter deactivated, credentials missing in Adaptper Settings !!!  ***');
                this.setForeignState('system.adapter.' + this.namespace + '.alive', false);
            }
            
            // in this vbus adapter all states changes inside the adapters namespace are subscribed
            // this.subscribeStates('*'); // Not needed now, in current version adapter only receives data

 
            const ipformat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            const serialformat = /^(COM|com)[0-9][0-9]?$|^\/dev\/tty.*$/;
            const vbusioformat = /vbus.io|vbus.net$/;
            const urlformat = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
            const fqdnformat = /^(?!:\/\/)(?=.{1,255}$)((.{1,63}\.){1,127}(?![0-9]*$)[a-z0-9-]+\.?)$/;


            switch (connectionDevice) {
                case 'lan':
                    if (connectionIdentifier.match(ipformat) || connectionIdentifier.match(fqdnformat)) {
                        ctx.connection = new vbus.TcpConnection({
                            host: connectionIdentifier,
                            port: connectionPort,
                            password: vbusPassword
                        });
                        this.log.info('TCP Connection selected');
                    } else {
                        this.log.warn('Host-address not valid. Should be IP-address or FQDN');
                    }
                    break;

                case 'serial':
                    if (connectionIdentifier.match(serialformat)) {
                        ctx.connection = new vbus.SerialConnection({
                            path: connectionIdentifier
                        });
                        this.log.info('Serial Connection selected');
                    } else {
                        this.log.warn('Serial port ID not valid. Should be like /dev/tty.usbserial or COM9');
                    }
                    break;

                case 'langw':
                    if (connectionIdentifier.match(ipformat) || connectionIdentifier.match(fqdnformat)) {
                        ctx.connection = new vbus.TcpConnection({
                            host: connectionIdentifier,
                            rawVBusDataOnly: vbusDataOnly
                        });
                        this.log.info('TCP Connection selected');
                    } else {
                        this.log.warn('Host-address not valid. Should be IP-address or FQDN');
                    }
                    break;

                case 'dl2':
                    if (connectionIdentifier.match(ipformat) || connectionIdentifier.match(fqdnformat)) {
                        if (connectionIdentifier.match(vbusioformat)) {
                            ctx.connection = new vbus.TcpConnection({
                                host: connectionIdentifier,
                                password: vbusPassword,
                                viaTag: vbusViaTag
                            });
                            this.log.info('VBus.net Connection via ' + vbusViaTag + ' selected');
                        } else {
                            ctx.connection = new vbus.TcpConnection({
                                host: connectionIdentifier,
                                password: vbusPassword
                            });
                            this.log.info('TCP Connection selected');
                        }
                    } else {
                        this.log.warn('Host-address not valid. Should be IP-address or FQDN');
                    }
                    break;

                case 'dl3':
                    if (connectionIdentifier.match(ipformat) || connectionIdentifier.match(fqdnformat)) {
                        if (connectionIdentifier.match(vbusioformat)) {
                            ctx.connection = new vbus.TcpConnection({
                                host: connectionIdentifier,
                                password: vbusPassword,
                                viaTag: vbusViaTag,
                                channel: vbusChannel
                            });
                            this.log.info('VBus.net Connection via ' + vbusViaTag + ' selected');
                        } else {
                            ctx.connection = new vbus.TcpConnection({
                                host: connectionIdentifier,
                                password: vbusPassword,
                                channel: vbusChannel
                            });
                            this.log.info('TCP Connection selected');
                        }
                    } else {
                        this.log.warn('Host-address not valid. Should be IP-address or FQDN');
                    }
            }

            ctx.connection.on('connectionState', (connectionState) => {
                this.log.info('Connection state changed to ' + connectionState);
            });

            ctx.hsc = new vbus.HeaderSetConsolidator({
                interval: vbusInterval * 1000,
                timeToLive: (vbusInterval * 1000) + 1000
            });

            ctx.headerSet = new vbus.HeaderSet();
            let hasSettled = false;
            let settledCountdown = 0;
 
            ctx.connection.on('packet', (packet) => {
                if (!hasSettled) {
                    const headerCountBefore = ctx.headerSet.getHeaderCount();
                    ctx.headerSet.addHeader(packet);
                    ctx.hsc.addHeader(packet);
                    const headerCountAfter = ctx.headerSet.getHeaderCount();
        
                    if (headerCountBefore !== headerCountAfter) {
                        if (forceReInit) {
                            ctx.hsc.emit('headerSet', ctx.hsc);
                        }
                        settledCountdown = headerCountAfter * 2;
                    } else if (settledCountdown > 0) {
                        settledCountdown -= 1;
                    } else {
                        hasSettled = true;
                        if (forceReInit) {
                            this.extendForeignObject('system.adapter.' + this.namespace, {
                                native: {
                                    forceReInit: false
                                }
                            }); 
                            forceReInit = false;
                        }
                    }
                } else {
                    ctx.headerSet.addHeader(packet);
                    ctx.hsc.addHeader(packet);
                }
            });

            this.log.info('Wait for Connection...');
            await ctx.connection.connect();
            this.log.info('Connection established!');
            this.setState('info.connection', true, true);
            ctx.hsc.startTimer();

            ctx.hsc.on('headerSet', () => {
                const packetFields = spec.getPacketFieldsForHeaders(ctx.headerSet.getSortedHeaders());
                const data = _.map(packetFields, function (pf) {
                    const precision = pf.packetFieldSpec.type.precision;
                    return {
                        id: pf.id,
                        name: _.get(pf, ['packetFieldSpec', 'name', language]),
                        value: pf.rawValue.toFixed(precision),
                        deviceName: pf.packetSpec.sourceDevice.fullName,
                        deviceId: pf.packetSpec.sourceDevice.deviceId,
                        addressId: pf.packetSpec.sourceDevice.selfAddress,
                        unitId: pf.packetFieldSpec.type.unit.unitId,
                        unitText: pf.packetFieldSpec.type.unit.unitText,
                        typeId: pf.packetFieldSpec.type.typeId,
                        rootTypeId: pf.packetFieldSpec.type.rootTypeId
                    };
                });
                //this.log.info('received data: ' + JSON.stringify(data));
                _.forEach(data, (item) => {
                    const deviceId = item.deviceId.replace(/_/g, '');
                    const channelId = deviceId + '.' + item.addressId;
                    const objectId = channelId + '.' + item.id.replace(/_/g, '');

                    if (forceReInit) {
                        this.initDevice(deviceId, channelId, objectId, item);
                    }
                    this.setState(objectId, item.value, true);
                });
            });
        } catch (error) {
            this.log.error(`[OnReady] error: ${error.message}, stack: ${error.stack}`);
        }
    }

    async initDevice(deviceId, channelId, objectId, item) {

        await this.setObjectNotExistsAsync(deviceId, {
            type: 'device',
            common: {
                name: item.deviceName
            },
            native: {}
        });

        await this.setObjectNotExistsAsync(channelId, {
            type: 'channel',
            common: {
                name: channelId
            },
            native: {}
        });

        const common = {
            name: item.name,
            type: 'number',
            unit: item.unitText,
            read: true,
            write: false
        };

        switch (item.unitId) {
            case 'DegreesCelsius':
                common.min = -100;
                common.max = +300;
                common.role = 'value.temperature';
                break;
            case 'Percent':
                common.min = 0;
                common.max = 100;
                common.role = 'level.volume';
                break;
            case 'Hours':
                common.role = 'value';
                break;
            case 'WattHours':
                common.role = 'value.power.generation';
                break;
            case 'None':
                common.role = 'value';
                break;
            default:
                common.role = 'value';
                break;
        }

        await this.setObjectNotExistsAsync(objectId, {
            type: 'state',
            common: common,
            native: {}
        });

    }

    // Function to decrypt passwords
    decrypt(key, value) {
        let result = '';
        for (let i = 0; i < value.length; ++i) {
            result += String.fromCharCode(key[i % key.length].charCodeAt(0) ^ value.charCodeAt(i));
        }
        //this.log.info('client_secret decrypt ready: '+ result);
        return result;
    }

    onUnload(callback) {
        try {
            ctx.connection.disconnect();
            this.setState('info.connection', false, true);
            this.log.info('cleaned everything up...');
            callback();
        } catch (e) {
            callback();
        }
    }

}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<ioBroker.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new MyVbus(options);
} else {
    // otherwise start the instance directly
    new MyVbus();
}