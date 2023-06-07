import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from "react-native";
import {
  BleBondedPeripheralEvent,
  BleConnectPeripheralEvent,
  BleDisconnectPeripheralEvent,
  BleDiscoverPeripheralEvent,
  BleManagerCentralManagerWillRestoreStateEvent,
  BleManagerDidUpdateNotificationStateForEvent,
  BleManagerDidUpdateStateEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleStopScanEvent,
  TransformedAdvertizingData,
  TransformedBleDiscoverPeripheralEvent,
  TransformedBleManagerDidUpdateValueForCharacteristicEvent,
} from "./types";


const bleManager = NativeModules.BleManager;

type EventMap = {
  BleManagerStopScan: BleStopScanEvent;
  BleManagerDidUpdateState: BleManagerDidUpdateStateEvent;
  BleManagerDiscoverPeripheral: TransformedBleDiscoverPeripheralEvent;
  BleManagerDidUpdateValueForCharacteristic: TransformedBleManagerDidUpdateValueForCharacteristicEvent;
  BleManagerConnectPeripheral: BleConnectPeripheralEvent;
  BleManagerDisconnectPeripheral: BleDisconnectPeripheralEvent;
  BleManagerPeripheralDidBond: BleBondedPeripheralEvent;
  BleManagerCentralManagerWillRestoreState: BleManagerCentralManagerWillRestoreStateEvent;
  BleManagerDidUpdateNotificationStateFor: BleManagerDidUpdateNotificationStateForEvent;
};

function wrapDiscoveredPeripheral(listener: (data: TransformedBleDiscoverPeripheralEvent) => void) {
  return function handleDicoveredPeripheral(this: unknown, ...args: [BleDiscoverPeripheralEvent]) {
    const [data, ...restArgs] = args;
    const { advertising } = data;
    const { manufacturerData, serviceData, ...restAdvertizing } = advertising;
    const transformedAdvertising: TransformedAdvertizingData = restAdvertizing;
    if ('manufacturerData' in advertising) {
      transformedAdvertising.manufacturerData = manufacturerData && Uint8Array.from(manufacturerData.bytes);
    }
    if ('serviceData' in advertising) {
      transformedAdvertising.serviceData = serviceData && Uint8Array.from(serviceData.bytes);
    }
    const transformedData: TransformedBleDiscoverPeripheralEvent = {
      ...data,
      advertising: transformedAdvertising,
    };
    return listener.call(this, transformedData, ...restArgs);
  }
}

function wrapUpdateValueForCharacteristic(listener: (data: TransformedBleManagerDidUpdateValueForCharacteristicEvent) => void) {
  return function handleUpdateValueForcharacteristic(this: unknown, ...args: [BleManagerDidUpdateValueForCharacteristicEvent]) {
    const [data, ...restArgs] = args;
    const { value, ...restData } = data;
    const transformedData: TransformedBleManagerDidUpdateValueForCharacteristicEvent = {
      ...restData,
      value: Uint8Array.from(value),
    };
    return listener.call(this, transformedData, ...restArgs);
  }
}

type Events = keyof EventMap;

type EventListenerArgs = {
  [K in Events]: [eventType: K, listener: (arg: EventMap[K]) => void, context?: Object];
}[Events];
class BleNativeEventEmitter extends NativeEventEmitter {
  constructor() {
    super(bleManager);
  }

  /**
   * The scanning for peripherals is ended.
   *
   * @param eventType — name of the event for which we are registering listener
   * @param listener — the listener function
   * @param context — context of the listener
   */
  addListener(
    eventType: "BleManagerStopScan",
    listener: (arg: EventMap[typeof eventType]) => void,
    context?: Object
  ): EmitterSubscription;
  /**
   * The BLE change state.
   *
   * @param eventType — name of the event for which we are registering listener
   * @param listener — the listener function
   * @param context — context of the listener
   */
  addListener(
    eventType: "BleManagerDidUpdateState",
    listener: (arg: EventMap[typeof eventType]) => void,
    context?: Object
  ): EmitterSubscription;
  /**
   * The scanning found a new peripheral.
   *
   * @param eventType — name of the event for which we are registering listener
   * @param listener — the listener function
   * @param context — context of the listener
   */
  addListener(
    eventType: "BleManagerDiscoverPeripheral",
    listener: (arg: EventMap[typeof eventType]) => void,
    context?: Object
  ): EmitterSubscription;
  /**
   * A characteristic notify a new value.
   *
   * @param eventType — name of the event for which we are registering listener
   * @param listener — the listener function
   * @param context — context of the listener
   */
  addListener(
    eventType: "BleManagerDidUpdateValueForCharacteristic",
    listener: (arg: EventMap[typeof eventType]) => void,
    context?: Object
  ): EmitterSubscription;
  /**
   * A peripheral was connected.
   *
   * @param eventType — name of the event for which we are registering listener
   * @param listener — the listener function
   * @param context — context of the listener
   */
  addListener(
    eventType: "BleManagerConnectPeripheral",
    listener: (arg: EventMap[typeof eventType]) => void,
    context?: Object
  ): EmitterSubscription;
  /**
   * A peripheral was disconnected.
   *
   * @param eventType — name of the event for which we are registering listener
   * @param listener — the listener function
   * @param context — context of the listener
   */
  addListener(
    eventType: "BleManagerDisconnectPeripheral",
    listener: (arg: EventMap[typeof eventType]) => void,
    context?: Object
  ): EmitterSubscription;
  /**
   * A bond with a peripheral was established
   *
   * @param eventType — name of the event for which we are registering listener
   * @param listener — the listener function
   * @param context — context of the listener
   */
  addListener(
    eventType: "BleManagerPeripheralDidBond",
    listener: (arg: EventMap[typeof eventType]) => void,
    context?: Object
  ): EmitterSubscription;
  /**
   * [iOS only] This is fired when [`centralManager:WillRestoreState:`](https://developer.apple.com/documentation/corebluetooth/cbcentralmanagerdelegate/1518819-centralmanager) is called (app relaunched in the background to handle a bluetooth event).
   *
   * @param eventType — name of the event for which we are registering listener
   * @param listener — the listener function
   * @param context — context of the listener
   */
  addListener(
    eventType: "BleManagerCentralManagerWillRestoreState",
    listener: (arg: EventMap[typeof eventType]) => void,
    context?: Object
  ): EmitterSubscription;
  /**
   * [iOS only] The peripheral received a request to start or stop providing notifications for a specified characteristic's value.
   *
   * @param eventType — name of the event for which we are registering listener
   * @param listener — the listener function
   * @param context — context of the listener
   */
  addListener(
    eventType: "BleManagerDidUpdateNotificationStateFor",
    listener: (arg: EventMap[typeof eventType]) => void,
    context?: Object
  ): EmitterSubscription;
  addListener(
    ...args: EventListenerArgs
  ): EmitterSubscription {
    switch (args[0]) {
      case 'BleManagerStopScan':
        return super.addListener(...args);
      case 'BleManagerDidUpdateState':
        return super.addListener(...args);
      case 'BleManagerDiscoverPeripheral': {
        return super.addListener(args[0], wrapDiscoveredPeripheral(args[1]), ...args.slice(2));
      }
      case 'BleManagerDidUpdateValueForCharacteristic':
        return super.addListener(args[0], wrapUpdateValueForCharacteristic(args[1]), ...args.slice(2));
      case 'BleManagerConnectPeripheral':
        return super.addListener(...args);
      case 'BleManagerDisconnectPeripheral':
        return super.addListener(...args);
      case 'BleManagerPeripheralDidBond':
        return super.addListener(...args);
      case 'BleManagerCentralManagerWillRestoreState':
        return super.addListener(...args);
      case 'BleManagerDidUpdateNotificationStateFor':
        return super.addListener(...args);
      default:
        throw new Error(`Unknown event type ${args[0]}`);
    }
  }
}

const bleEventEmitter = new BleNativeEventEmitter();

export default bleEventEmitter;
