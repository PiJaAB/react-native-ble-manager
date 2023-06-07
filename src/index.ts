import { NativeModules } from 'react-native';
import BleError from './BleError';
import {
  BleScanCallbackType,
  BleScanMatchCount,
  BleScanMatchMode,
  BleScanMode,
  BleState,
  ConnectOptions,
  ConnectionPriority,
  Peripheral,
  PeripheralInfo,
  ScanOptions,
  StartOptions
} from './types';

export * from './types';
export { default as BleEventEmitter } from './emitter';
export { default as BleError } from './BleError';

var bleManager = NativeModules.BleManager;

class BleManager {
  constructor() {
    this.isPeripheralConnected = this.isPeripheralConnected.bind(this);
  }

  /**
   * Read the current value of the specified characteristic, you need to call {@link retrieveServices} method before.
   *
   * @param peripheralId - The id/mac address of the peripheral.
   * @param serviceUUID - Thq UUID of the service.
   * @param characteristicUUID - The UUID of the characteristic.
   * @returns A {@link Promise} that resolves to the data as an Uint8Array
   */
  read(peripheralId: string, serviceUUID: string, characteristicUUID: string) {
    return new Promise<Uint8Array>((fulfill, reject) => {
      bleManager.read(
        peripheralId,
        serviceUUID,
        characteristicUUID,
        (error: unknown, data: number[] | Uint8Array) => {
          if (error != null) {
            reject(new BleError(error));
          } else {
            if (Array.isArray(data)) {
              const orgData = data;
              data = Uint8Array.from(data);
              orgData.length = 0;
            }
            fulfill(data);
          }
        }
      );
    });
  }

  /**
   * Read the value from a descriptor.
   * @param peripheralId - The id/mac address of the peripheral.
   * @param serviceUUID - The UUID of the service.
   * @param characteristicUUID - The UUID of the characteristic.
   * @param descriptorUUID - The UUID of the descriptor.
   * @returns A {@link Promise} that resolves to the data as an Uint8Array
   */
  readDescriptor(peripheralId: string, serviceUUID: string, characteristicUUID: string, descriptorUUID: string) {
    return new Promise<Uint8Array>((fulfill, reject) => {
      bleManager.readDescriptor(
        peripheralId,
        serviceUUID,
        characteristicUUID,
        descriptorUUID,
        (error: unknown, data: number[] | Uint8Array) => {
          if (error != null) {
            reject(new BleError(error));
          } else {
            if (Array.isArray(data)) {
              const orgData = data;
              data = Uint8Array.from(data);
              orgData.length = 0;
            }
            fulfill(data);
          }
        }
      );
    });
  }

  /**
   * Read the current value of the RSSI.
   * @param peripheralId - The id/mac address of the peripheral.
   * @returns a promise resolving with the updated RSSI (`number`) if it succeeds.
   */
  readRSSI(peripheralId: string) {
    return new Promise<number>((fulfill, reject) => {
      bleManager.readRSSI(peripheralId, (error: unknown, rssi: number) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          fulfill(rssi);
        }
      });
    });
  }

  /**
   * [Android only] Refreshes the peripheral's services and characteristics cache.
   * @param peripheralId - The id/mac address of the peripheral.
   * @returns A {@link Promise} that resolves to a boolean indicating if gatt was successfully refreshed or not.
   */
  refreshCache(peripheralId: string) {
    return new Promise<boolean>((fulfill, reject) => {
      bleManager.refreshCache(peripheralId, (error: unknown, result: boolean) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          fulfill(result);
        }
      });
    });
  }

  /**
   * Retrieve the peripheral's services and characteristics.
   * @param peripheralId - The id/mac address of the peripheral.
   * @param serviceUUIDs [iOS only] Optional filter of services to retrieve.
   * @returns A {@link Promise} that resolves to the {@link PeripheralInfo} object.
   */
  retrieveServices(peripheralId: string, serviceUUIDs: string[] = []) {
    return new Promise<PeripheralInfo>((fulfill, reject) => {
      bleManager.retrieveServices(
        peripheralId,
        serviceUUIDs,
        (error: unknown, peripheral: PeripheralInfo) => {
          if (error != null) {
            reject(new BleError(error));
          } else {
            fulfill(peripheral);
          }
        }
      );
    });
  }

  /**
   * Write with response to the specified characteristic, you need to call {@link retrieveServices} method before.
   * @param peripheralId - The id/mac address of the peripheral.
   * @param serviceUUID - The UUID of the service.
   * @param characteristicUUID - The UUID of the characteristic.
   * @param data - Data to write.
   * @param maxByteSize - The max byte size before splitting message. Defaults to 20 if not specified.
   * @returns A {@link Promise} that resolves if the write was successful.
   */
  write(
    peripheralId: string,
    serviceUUID: string,
    characteristicUUID: string,
    data: number[] | Uint8Array,
    maxByteSize: number = 20
  ) {

    return new Promise<void>((fulfill, reject) => {
      data = data instanceof Uint8Array ? [...data] : data;
      bleManager.write(
        peripheralId,
        serviceUUID,
        characteristicUUID,
        data,
        maxByteSize,
        (error: unknown) => {
          if (error != null) {
            reject(new BleError(error));
          } else {
            fulfill();
          }
        }
      );
    });
  }

  /**
   * Write without response to the specified characteristic, you need to call {@link retrieveServices} method before.
   * @param peripheralId - The id/mac address of the peripheral.
   * @param serviceUUID - The UUID of the service.
   * @param characteristicUUID - The UUID of the characteristic.
   * @param data - Data to write.
   * @param maxByteSize - The max byte size before splitting message. Defaults to 20 if not specified.
   * @param queueSleepTime - Specify the wait time before each write if the data is greater than maxByteSize. Defaults to 10 if not specified.
   * @returns A {@link Promise} that resolves when all write operations has been sent to the operating System.
   */
  writeWithoutResponse(
    peripheralId: string,
    serviceUUID: string,
    characteristicUUID: string,
    data: number[] | Uint8Array,
    maxByteSize: number = 20,
    queueSleepTime: number = 10
  ) {

    return new Promise<void>((fulfill, reject) => {
      data = data instanceof Uint8Array ? [...data] : data;
      bleManager.writeWithoutResponse(
        peripheralId,
        serviceUUID,
        characteristicUUID,
        data,
        maxByteSize,
        queueSleepTime,
        (error: unknown) => {
          if (error != null) {
            reject(new BleError(error));
          } else {
            fulfill();
          }
        }
      );
    });
  }

  /**
   * Attempts to connect to a peripheral. In many case if you can't connect you have to scan for the peripheral before.
   *
   * > In iOS, attempts to connect to a peripheral do not time out (please see
   * [Apple's doc](https://developer.apple.com/documentation/corebluetooth/cbcentralmanager/1518766-connect)),
   * so you might need to set a timer explicitly if you don't want this behavior.
   *
   * @param peripheralId - The id/mac address of the peripheral to connect.
   * @returns A {@link Promise}.
   */
  connect(peripheralId: string, options?: ConnectOptions) {
    return new Promise<void>((fulfill, reject) => {
      if (!options) {
        options = {};
      }
      bleManager.connect(peripheralId, options, (error: unknown) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          fulfill();
        }
      });
    });
  }

  /**
   * [Android only]
   * Start the bonding (pairing) process with the remote device. If you pass peripheralPin (optional), bonding will be auto(without manual entering pin).
   * @param peripheralId - The id/mac address of the peripheral to connect.
   * @param peripheralPin - Will be used to auto-bond if possible.
   * @returns A {@link Promise} that is resolved with true if `new bond successfully created` or false if `bond already existed`.
   */
  createBond(peripheralId: string, peripheralPin: string | null = null) {
    return new Promise<boolean>((fulfill, reject) => {
      bleManager.createBond(peripheralId, peripheralPin, (error: unknown, created: boolean) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          fulfill(Boolean(created));
        }
      });
    });
  }

  /**
   * [Android only] Remove a paired device.
   * @param peripheralId - The id/mac address of the peripheral to connect.
   * @returns A {@link Promise}.
   */
  removeBond(peripheralId: string) {
    return new Promise<void>((fulfill, reject) => {
      bleManager.removeBond(peripheralId, (error: unknown) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          fulfill();
        }
      });
    });
  }

  /**
   * Disconnect from a peripheral.
   * @param peripheralId - The id/mac address of the peripheral to disconnect.
   * @param force - [Android only] If true force closes gatt connection and send the
   * BleManagerDisconnectPeripheral event immediately to JavaScript, else disconnects
   * the connection and waits for [`disconnected state`](https://developer.android.com/reference/android/bluetooth/BluetoothProfile#STATE_DISCONNECTED)
   * to [`close the gatt connection`](https://developer.android.com/reference/android/bluetooth/BluetoothGatt#close())
   * and then sends the BleManagerDisconnectPeripheral to the Javascript
   * @returns A {@link Promise}.
   */
  disconnect(peripheralId: string, force: boolean = true) {
    return new Promise<void>((fulfill, reject) => {
      bleManager.disconnect(peripheralId, force, (error: unknown) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          fulfill();
        }
      });
    });
  }

  /**
   * Start the notification on the specified characteristic, you need to call {@link retrieveServices} method before.
   * @param peripheralId - The id/mac address of the peripheral.
   * @param serviceUUID - The UUID of the service.
   * @param characteristicUUID - The UUID of the characteristic.
   * @returns A {@link Promise}.
   */
  startNotification(peripheralId: string, serviceUUID: string, characteristicUUID: string) {
    return new Promise<void>((fulfill, reject) => {
      bleManager.startNotification(
        peripheralId,
        serviceUUID,
        characteristicUUID,
        (error: unknown) => {
          if (error != null) {
            reject(new BleError(error));
          } else {
            fulfill();
          }
        }
      );
    });
  }

  /**
   * [Android only] Start the notification on the specified characteristic, you need to call {@link retrieveServices} method before.
   * The buffer will collect a number or messages from the server and then emit once the buffer count it reached.
   * Helpful to reducing the number or js bridge crossings when a characteristic is sending a lot of messages.
   * @param peripheralId - The id/mac address of the peripheral. 
   * @param serviceUUID - The UUID of the service.
   * @param characteristicUUID - The UUID of the characteristic.
   * @param buffer - The capacity of the buffer (bytes) stored before emitting the data for the characteristic.
   * @returns A {@link Promise}.
   */
  startNotificationUseBuffer(
    peripheralId: string,
    serviceUUID: string,
    characteristicUUID: string,
    buffer: number
  ) {
    return new Promise<void>((fulfill, reject) => {
      bleManager.startNotificationUseBuffer(
        peripheralId,
        serviceUUID,
        characteristicUUID,
        buffer,
        (error: unknown) => {
          if (error != null) {
            reject(new BleError(error));
          } else {
            fulfill();
          }
        }
      );
    });
  }

  /**
   * Stop the notification on the specified characteristic.
   * @param peripheralId the id/mac address of the peripheral.
   * @param serviceUUID the UUID of the service.
   * @param characteristicUUID the UUID of the characteristic.
   * @returns A {@link Promise}.
   */
  stopNotification(peripheralId: string, serviceUUID: string, characteristicUUID: string) {
    return new Promise<void>((fulfill, reject) => {
      bleManager.stopNotification(
        peripheralId,
        serviceUUID,
        characteristicUUID,
        (error: unknown) => {
          if (error != null) {
            reject(new BleError(error));
          } else {
            fulfill();
          }
        }
      );
    });
  }

  /**
   * Force the module to check the state of BLE and trigger a BleManagerDidUpdateState event.
   * @returns A {@link Promise} that resolves with the current BLE state.
   */
  checkState() {
    return new Promise<BleState>((fulfill, _) => {
      bleManager.checkState((state: BleState) => {
        fulfill(state);
      });
    });
  }

  /**
   * Init the module. Returns a Promise object. Don't call this multiple times.
   * @param options Init options
   * @param options.showAlert [iOS only] Show or hide the alert if the bluetooth is turned off during initialization
   * @param options.restoreIdentifierKey [iOS only] Unique key to use for CoreBluetooth state restoration
   * @param options.queueIdentifierKey [iOS only] Unique key to use for a queue identifier on which CoreBluetooth events will be dispatched
   * @param options.forceLegacy [Android only] Force to use the LegacyScanManager
   * @returns A {@link Promise}.
   */
  start(options?: StartOptions) {
    return new Promise<void>((fulfill, reject) => {
      if (options == null) {
        options = {};
      }
      bleManager.start(options, (error: unknown) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          fulfill();
        }
      });
    });
  }

  /**
   * Scan for availables peripherals.
   * @param serviceUUIDs 
   * @param seconds amount of seconds to scan. if set to 0 or less, will scan until you call stopScan() or the OS stops the scan (background etc).
   * @param allowDuplicates [iOS only]
   * @param scanningOptions [Android only] after Android 5.0, user can control specific ble scan behaviors
   * @param scanningOptions.numberOfMatches corresponding to
   * [`setNumOfMatches`](https://developer.android.com/reference/android/bluetooth/le/ScanSettings.Builder#setNumOfMatches(int))
   * @param scanningOptions.matchMode corresponding to
   * [`setMatchMode`](https://developer.android.com/reference/android/bluetooth/le/ScanSettings.Builder.html#setMatchMode(int))
   * @param scanningOptions.scanMode corresponding to
   * [`setScanMode`](https://developer.android.com/reference/android/bluetooth/le/ScanSettings.Builder.html#setScanMode(int))
   * @param scanningOptions.reportDelay corresponding to
   * [`setReportDelay`](https://developer.android.com/reference/android/bluetooth/le/ScanSettings.Builder.html#setReportDelay(long))
   * @returns A {@link Promise}.
   */
  scan(
    serviceUUIDs: string[],
    seconds: number,
    allowDuplicates?: boolean,
    scanningOptions: ScanOptions = {}
  ) {

    return new Promise<void>((fulfill, reject) => {
      if (allowDuplicates == null) {
        allowDuplicates = false;
      }

      // (ANDROID) Match as many advertisement per filter as hw could allow
      // depends on current capability and availability of the resources in hw.
      if (scanningOptions.numberOfMatches == null) {
        scanningOptions.numberOfMatches = BleScanMatchCount.MaxAdvertisements;
      }

      // (ANDROID) Defaults to MATCH_MODE_AGGRESSIVE
      if (scanningOptions.matchMode == null) {
        scanningOptions.matchMode = BleScanMatchMode.Aggressive;
      }

      // (ANDROID) Defaults to SCAN_MODE_LOW_POWER
      if (scanningOptions.scanMode == null) {
        scanningOptions.scanMode = BleScanMode.LowPower;
      }

      // (ANDROID) Defaults to CALLBACK_TYPE_ALL_MATCHES 
      // WARN: sometimes, setting a scanSetting instead of leaving it untouched might result in unexpected behaviors.
      // https://github.com/dariuszseweryn/RxAndroidBle/issues/462
      if (scanningOptions.callbackType == null) {
        scanningOptions.callbackType = BleScanCallbackType.AllMatches;
      }

      // (ANDROID) Defaults to 0ms (report results immediately).
      if (scanningOptions.reportDelay == null) {
        scanningOptions.reportDelay = 0;
      }

      // (ANDROID) ScanFilter used to restrict search to devices with a specific advertising name.
      // https://developer.android.com/reference/android/bluetooth/le/ScanFilter.Builder#setDeviceName(java.lang.String)
      if (!scanningOptions.exactAdvertisingName
        || typeof scanningOptions.exactAdvertisingName !== 'string') {
        delete scanningOptions.exactAdvertisingName;
      }

      bleManager.scan(
        serviceUUIDs,
        seconds,
        allowDuplicates,
        scanningOptions,
        (error: unknown) => {
          if (error != null) {
            reject(new BleError(error));
          } else {
            fulfill();
          }
        }
      );
    });
  }

  /**
   * Stop the scanning.
   * @returns A {@link Promise}.
   */
  stopScan() {
    return new Promise<void>((fulfill, reject) => {
      bleManager.stopScan((error: unknown) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          fulfill();
        }
      });
    });
  }

  /**
   * [Android only] triggers an ENABLE_REQUEST intent to the end-user to enable bluetooth.
   * @returns A {@link Promise}.
   */
  enableBluetooth() {
    return new Promise<void>((fulfill, reject) => {
      bleManager.enableBluetooth((error: unknown) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          fulfill();
        }
      });
    });
  }

  /**
   * Return the connected peripherals.
   * @param serviceUUIDs - [iOS only] The UUIDs of the services to looking for.
   * @returns A {@link Promise}.
   */
  getConnectedPeripherals(serviceUUIDs: string[] = []) {
    return new Promise<Peripheral[]>((fulfill, reject) => {

      bleManager.getConnectedPeripherals(serviceUUIDs, (error: unknown, result: Peripheral[] | null) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          if (result) {
            fulfill(result);
          } else {
            fulfill([]);
          }
        }
      });
    });
  }

  /**
   * [Android only] Return the bonded peripherals.
   * @returns A {@link Promise}.
   */
  getBondedPeripherals() {
    return new Promise<Peripheral[]>((fulfill, reject) => {
      bleManager.getBondedPeripherals((error: unknown, result: Peripheral[] | null) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          if (result) {
            fulfill(result);
          } else {
            fulfill([]);
          }
        }
      });
    });
  }

  /**
   * Return the discovered peripherals after a scan.
   * @returns A {@link Promise}.
   */
  getDiscoveredPeripherals() {
    return new Promise<Peripheral[]>((fulfill, reject) => {
      bleManager.getDiscoveredPeripherals((error: unknown, result: Peripheral[] | null) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          if (result) {
            fulfill(result);
          } else {
            fulfill([]);
          }
        }
      });
    });
  }

  /**
   * [Android only] Removes a disconnected peripheral from the cached list. It is useful if the device is turned off, because it will be re-discovered upon turning on again. 
   * @param peripheralId - The id/mac address of the peripheral.
   * @returns A {@link Promise}.
   */
  removePeripheral(peripheralId: string) {
    return new Promise<void>((fulfill, reject) => {
      bleManager.removePeripheral(peripheralId, (error: unknown) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          fulfill();
        }
      });
    });
  }

  /**
   * Check whether a specific peripheral is connected and return true or false
   * @param serviceUUIDs - [iOS only] The UUIDs of the services to looking for.
   * @returns A {@link Promise}.
   */
  isPeripheralConnected(peripheralId: string, serviceUUIDs: string[] = []) {
    return this.getConnectedPeripherals(serviceUUIDs).then(result => {
      if (result.find(p => p.id === peripheralId)) {
        return true;
      } else {
        return false;
      }
    });
  }

  /**
   * [Android only, API 21+] Request a connection parameter update.
   * @param peripheralId - The id/mac address of the peripheral.
   * @param connectionPriority - The connection priority to be requested
   * @returns A {@link Promise} that resolves with a boolean indicating of the connection priority was changed successfully, or rejects with an error message..
   */
  requestConnectionPriority(peripheralId: string, connectionPriority: ConnectionPriority) {
    return new Promise<boolean>((fulfill, reject) => {
      bleManager.requestConnectionPriority(
        peripheralId,
        connectionPriority,
        (error: unknown, status: boolean) => {
          if (error != null) {
            reject(new BleError(error));
          } else {
            fulfill(status);
          }
        }
      );
    });
  }


  /**
   * [Android only, API 21+] Request an MTU size used for a given connection.
   * @param peripheralId - The id/mac address of the peripheral.
   * @param mtu - Size to be requested, in bytes.
   * @returns A {@link Promise} promise resolving with the negotiated MTU if it succeeded. Beware that it might not be the one requested due to device's BLE limitations on both side of the negotiation.
   */
  requestMTU(peripheralId: string, mtu: number) {
    return new Promise<number>((fulfill, reject) => {
      bleManager.requestMTU(peripheralId, mtu, (error: unknown, mtu: number) => {
        if (error != null) {
          reject(new BleError(error));
        } else {
          fulfill(mtu);
        }
      });
    });
  }

  /**
   * [Android only] Create the request to set the name of the bluetooth adapter.
   * @param name - The name to set.
   * @returns A {@link Promise}.
   */
  setName(name: string) {
    bleManager.setName(name);
  }

  /**
   * [iOS only]
   * @param peripheralId 
   * @returns 
   */
  getMaximumWriteValueLengthForWithoutResponse(peripheralId: string) {
    return new Promise<number>((fulfill, reject) => {
      bleManager.getMaximumWriteValueLengthForWithoutResponse(peripheralId, (error: string | null, max: number) => {
        if (error) {
          reject(error);
        } else {
          fulfill(max);
        }
      });
    });
  }

  /**
   * [iOS only]
   * @param peripheralId 
   * @returns 
   */
  getMaximumWriteValueLengthForWithResponse(peripheralId: string) {
    return new Promise<number>((fulfill, reject) => {
      bleManager.getMaximumWriteValueLengthForWithResponse(peripheralId, (error: string | null, max: number) => {
        if (error) {
          reject(error);
        } else {
          fulfill(max);
        }
      });
    });
  }

}



export default new BleManager();
