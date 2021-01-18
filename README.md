# ioBroker.resol

![Logo](admin/resol.svg)

 
## ioBroker Adapter for Resol VBus

This adapter connects various VBus-based devices to ioBroker supporting various connection types. 

It's using resol-vbus, a JavaScript library provided by Daniel Wippermann.
Please visit <https://github.com/danielwippermann/resol-vbus> and <https://www.npmjs.com/package/resol-vbus> if you're interested in a deeper dive. 

## Features

* Enables reading of the measurement data from various RESOL(R) VBus(R) devices - preferably solar and system controllers from the DeltaSol(R) series including built-in heat quantity meters (HQM) - using DL3 or DL2 data loggers, KM2 communication modules, VBus/LAN interface adapters or serial/LAN gateways locally via TCP/IP.
* Device access using the VBus/USB serial interface adapter or via VBus.net(R) using DLx/KMx is also supported.
* Processes live VBus data streams and makes them available as ioBroker states.
* Values are updated with a configurable cycle time.
* Reading or setting the VBus device configuration parameters is not supported. The tools provided by Resol should be used for this, e.g. via VBus.net or the parameterization tool RPT.
* Reading DL3 channel 0 (sensors directly connected to the DL3 device) is not supported due to limitations of the DL3 interface.

## Configuration hints

* The default setting for the connection type is VBus/LAN, but it must be explicitly selected even for VBus/LAN, otherwise no connection will be established.
* The correct settings for direct LAN access for VBus/LAN, DL3, DL2, KM2 are:
  * Connection type: VBus/LAN or KM2 or DL2 or DL3
  * Connection identifier: IP address (e.g. 192.168.178.188) or FullyQualifiedHostName (e.g. host1.example.com)
  * VBus password: YourVBusPassword (default: vbus)
  * Connection port: Default setting 7053 should not be changed
  * DL3 channel: Only relevant for DL3 (values 1-6, channel 0 can not be read out)
  * Update interval: Time between updates of the measured values (default 30s)
* The correct settings for the DL3, DL2, KM2 access via VBus.net are:
  * Connection type: vbus.net
  * Connection identifier: leave blank
  * Connection port: Default setting 7053 should not be changed
  * VBus password: YourVBusPassword (default: vbus)
  * DL3 channel: Only relevant for DL3 (values: 1-6, channel 0 cannot be read out)
  * Via identifier: Your Via-tag (e.g. d1234567890.vbus.io) - without http:// before
  * Update interval: Time between the update of the measured values (default 30s)

### Examples:
#### Connection via USB/Serial

| Operating System | Connectiondevice | Device-address | Port | DL3-Channel | Via-Tag |   
|------------------|------------------|----------------|------|-------------|---------|
| Windows          | USB/Serial       | COMx           |      | None        |         |
| Linux            |                  | /dev/tty.usbserial/ | | None        |          |

#### Connection via LAN 
This includes: 
  * LAN
  * KM2 Devices
  * DL2 Devices 
  * DL3 Devices (Selection of Channel is important, Channel 0 is not supported)
  * Serial to LAN Gateways

|  | Connectiondevice | Device-address | Port | DL3-Channel | Via-Tag |   
|------------------|------------------|----------------|------|-------------|---------|
|           | select your Device from List | IP-Address of your Device | TCP Port | DL3 Channel to use, when applicable | leave blank |
| Example | KM2 | 192.168.178.xxx | 7053 (Default) | None | | 
| Example | DL2 | 192.168.178.xxx | 7053 (Default) | None | | 
| Example | DL3 | 192.168.178.xxx | 7053 (Default) | Channel x | | 

#### Connection via vbus.net by Resol
You'll find your personal per device Via-tag on the vbus.net homepage under: My VBus.net - My devices.
Best is to copy/paste it from there - **without http://**
 
|    | Connectiondevice | Device-address | Port | DL3-Channel | Via-Tag |   
|------------------|------------------|----------------|------|-------------|---------|
|           | select vbus.net from List | leave blank | TCP Port | None | your Via-tag from resol vbus.net |
| Example KM2 / DL2 | vbus.net |  | 7053 (Default) | None | d01234567890.vbus.net | 
| Example KM2 / DL2| vbus.net |  | 7053 (Default) | None | d01234567890.vbus.io | 
| Example Dl3| vbus.net |  | 7053 (Default) | Channel x | d01234567890.vbus.io | 
 

## Todo
* Make use of adapter internal decrypt function (req. at least js-controller >= 3.0)
* Log connection losts as info
* add snyk
* add 
  

## Changelog

### 0.2.0 (2021-01-18)
* (grizzelbee) New: New Icon
* (grizzelbee) Upd: Update resol-Bus lib to V0.21.0 
* (grizzelbee) Upd: Security-Update to lodash lib 
* (grizzelbee) Upd: Reorganized configuration to get it more intuitive  
* (grizzelbee) Upd: Config-page translated via gulp
* (grizzelbee) New: Changed the way to configure access via vbus.net to be more intuitive
* (grizzelbee) New: Extended documentation
* (grizzelbee) Fix: Adapter doesn't crash on connection losts anymore

### 0.1.0 (2020-03-29)
* (grizzelbee) Fix: config page shows current settings now (not default anymore) **May raise the need to reenter the password!**
* (grizzelbee) Fix: "Connected" state is updated correctly now if connection is disrupted.
* (grizzelbee) New: Added Badge for latest(npm) version to readme
* (grizzelbee) Fix: removed default password from config to ensure it's encrypted on first config
* (grizzelbee) Fix: removed Force-ReInit
* (grizzelbee) Fix: sensor maintenance indicators are working booleans now
* (grizzelbee) New: added new activity indicator states for each relais.
* (grizzelbee) New: testing configuration to avoid start with invalid config

### 0.0.6
* (pdbjjens) alpha 6 release updated dependencies

### 0.0.5
* (pdbjjens) alpha 5 release improved type and role mapping of adapter values

### 0.0.4
* (pdbjjens) alpha 4 release updated dependency on resol-vbus library to 0.21.0

### 0.0.3
* (pdbjjens) alpha 3 release tested with DL3 over local LAN and VBus.net and DeltaSol SLT (0x1001) incl. HQM (0x1011)

### 0.0.2
* (pdbjjens) alpha 2 release tested with VBus/LAN, KM2, VBus.net and DeltaSol E (0x7721 & 0x7722), DeltaSol M (0x7311 & 0x716), DeltaSol CS Plus (0x2211), Oventrop RQXXL (0x7541)

### 0.0.1

* (pdbjjens) initial release tested only with VBus/USB (Serial) and DeltaSol(R) BS2009 (0x427B)

## Legal Notices

RESOL, VBus, VBus.net, DeltaSol and others are trademarks or registered trademarks of RESOL - Elektronische Regelungen GmbH
<https://www.resol.de/en>

All other trademarks are the property of their respective owners.



## License

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Copyright (c) 2020 Hanjo Hingsen <hanjo@hingsen.de>
