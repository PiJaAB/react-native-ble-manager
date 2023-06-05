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
} from "./types";


const bleManager = NativeModules.BleManager;

type EventMap = {
  BleManagerStopScan: BleStopScanEvent;
  BleManagerDidUpdateState: BleManagerDidUpdateStateEvent;
  BleManagerDiscoverPeripheral: BleDiscoverPeripheralEvent;
  BleManagerDidUpdateValueForCharacteristic: BleManagerDidUpdateValueForCharacteristicEvent;
  BleManagerConnectPeripheral: BleConnectPeripheralEvent;
  BleManagerDisconnectPeripheral: BleDisconnectPeripheralEvent;
  BleManagerPeripheralDidBond: BleBondedPeripheralEvent;
  BleManagerCentralManagerWillRestoreState: BleManagerCentralManagerWillRestoreStateEvent;
  BleManagerDidUpdateNotificationStateFor: BleManagerDidUpdateNotificationStateForEvent;
};

type Events = keyof EventMap;
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
  addListener<Ev extends Events>(
    ...args: [
      eventType: Ev,
      listener: (event: EventMap[Ev]) => void,
      context?: Object
    ]
  ): EmitterSubscription {
    return super.addListener(...args);
  }
}

const bleEventEmitter = new BleNativeEventEmitter();

export default bleEventEmitter;
