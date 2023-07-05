export enum BleErrorCode {
  NotSupported = 1,
  NoBluetoothSupport = 2,
  UserRefusedEnable = 4,
  CurrentActivityUnavailable = 6,
  InvalidPeripheralUuid = 8,
  MaxBondRequestsReached = 10,
  CreateBondFailed = 12,
  RemoveBondFailed = 14,
  PeripheralNotFound = 16,
  ServiceUuidOrCharacteristicUuidMissing = 18,
  BondRequestDenied = 20,
  IllegalRemoveWhileConnected = 22,
  WriteDescriptorFailed = 24,
  ReadDescriptorFailed = 25,
  MissingNotifyOrIndicateFlag = 26,
  SetNotificationFailed = 28,
  CharacteristicNotFound = 30,
  PeripheralNotConnected = 32,
  GattIsNull = 34,
  PeripheralDisconnected = 36,
  ConnectionError = 38,
  InvalidApiVersion = 40,
  ReadFailed = 42,
  RssiReadFailed = 44,
  CacheRefreshFailed = 46,
  UnknownException = 48,
  WriteFailed = 50,
  WriteInterrupted = 52,
  IOSError = 53,
  AndroidError = 54,
  GattError = 55,
  RequestMTUFailed = 56,
}

export enum IOSCBErrorCode {
  Unknown = 0,
  InvalidParameters = 1,
  InvalidHandle = 2,
  PeripheralNotConnected = 3,
  OutOfSpace = 4,
  OperationCancelled = 5,
  ConnectionTimeout = 6,
  PeripheralDisconnected = 7,
  UuidNotAllowed = 8,
  AlreadyAdvertising = 9,
  ConnectionFailed = 10,
  ConnectionLimitReached = 11,
  UnknownDevice = 12,
  OperationNotSupported = 13,
  PeerRemovedPairingInformation = 14,
  EncryptionTimedOut = 15,
  TooManyLEPairedDevices = 16,
}

export enum GattCode {
  Success = 0,
  InvalidHandle = 1,
  ReadNotPermitted = 2,
  WriteNotPermitted = 3,
  InvalidPdu = 4,
  InsufficientAuthentication = 5,
  RequestNotSupported = 6,
  InvalidOffset = 7,
  InsufficientAuthorization = 8,
  PrepareQueueFull = 9,
  AttributeNotFound = 10,
  AttributeNotLong = 11,
  InsufficientEncryptionKeySize = 12,
  InvalidAttributeValueLength = 13,
  UnlikelyError = 14,
  InsufficientEncryption = 15,
  UnsupportedGroupType = 16,
  InsufficientResources = 17,
  ConnectionCongested = 143,
  Failure = 257,
}

function isObject(o: unknown): o is Record<string, unknown> {
  return typeof o === "object" && o != null && !Array.isArray(o);
}

function getTypeName(o: unknown): string {
  if (o === null) {
    return "null";
  }
  if (Array.isArray(o)) {
    return "array";
  }
  return typeof o;
}

function isValidError(o: Record<string, unknown>): o is {
  message: string;
  iosCode?: number | null;
  iosDomain?: string | null;
  attCode?: number | null;
  minAdkVersion?: number | null;
  code?: number | null;
  peripheralUUID?: string | null;
  serviceUUID?: string | null;
  characteristicUUID?: string | null;
  descriptorUUID?: string | null;
} {
  const { message, iosCode, iosDomain, attCode, minAdkVersion, code, peripheralUUID, serviceUUID, characteristicUUID, descriptorUUID } = o;
  return (
    typeof message === "string" &&
    (iosCode == null || typeof iosCode === "number") &&
    (iosDomain == null || typeof iosDomain === "string") &&
    (attCode == null || typeof attCode === "number") &&
    (minAdkVersion == null || typeof minAdkVersion === "number") &&
    (code == null || typeof code === "number") &&
    (peripheralUUID == null || typeof peripheralUUID === "string") &&
    (serviceUUID == null || typeof serviceUUID === "string") &&
    (characteristicUUID == null || typeof characteristicUUID === "string") &&
    (descriptorUUID == null || typeof descriptorUUID === "string")
  );
}

function patchMessage(err: BleError): string {
  const keyVals: [string, string | number][] = [];
  if (err.iosCode != null) {
    keyVals.push(['iosCode', err.iosCode.code]);
    keyVals.push(['iosDomain', err.iosCode.domain]);
  }
  if (err.attCode != null) {
    keyVals.push(['attCode', err.attCode]);
  }
  if (err.minAdkVersion != null) {
    keyVals.push(['minAdkVersion', err.minAdkVersion]);
  }
  if (err.code != null) {
    keyVals.push(['customCode', err.code]);
  }
  if (err.peripheralUUID != null) {
    keyVals.push(['peripheralUUID', err.peripheralUUID]);
  }
  if (err.serviceUUID != null) {
    keyVals.push(['serviceUUID', err.serviceUUID]);
  }
  if (err.characteristicUUID != null) {
    keyVals.push(['characteristicUUID', err.characteristicUUID]);
  }
  if (err.descriptorUUID != null) {
    keyVals.push(['descriptorUUID', err.descriptorUUID]);
  }
  if (keyVals.length === 0) {
    return err.message;
  }
  if (err.message === '' || err.message.endsWith(' ')) {
    return `${err.message}[${keyVals
      .map(([key, val]) => `${key}=${val}`)
      .join(', ')}]`;
  }
  return `${err.message} [${keyVals
    .map(([key, val]) => `${key}=${val}`)
    .join(', ')}]`;
}

export default class BleError extends Error {
  raw: unknown;
  iosCode: {
    code: IOSCBErrorCode;
    domain: 'CBErrorDomain';
  } | {
    code: number
    domain: string;
  } | null;
  attCode: number | null;
  minAdkVersion: number | null;
  code: BleErrorCode | number | null;
  peripheralUUID: string | null;
  serviceUUID: string | null;
  characteristicUUID: string | null;
  descriptorUUID: string | null;

  constructor(err: unknown) {
    if (typeof err === "string") {
      super(err);
      this.name = `${this.name}(RAW_STRING_ERROR)`;
      this.raw = err;
      this.iosCode = null;
      this.attCode = null;
      this.minAdkVersion = null;
      this.code = null;
      this.peripheralUUID = null;
      this.serviceUUID = null;
      this.characteristicUUID = null;
      this.descriptorUUID = null;
    } else if (!isObject(err)) {
      super(`${getTypeName(err)} was thrown`);
      this.name = `${this.name}(NON_OBJECT_ERROR)`;
      this.raw = err;
      this.iosCode = null;
      this.attCode = null;
      this.minAdkVersion = null;
      this.code = null;
      this.peripheralUUID = null;
      this.serviceUUID = null;
      this.characteristicUUID = null;
      this.descriptorUUID = null;
    } else if (!isValidError(err)) {
      const maybeMessage = err.message;
      if (typeof maybeMessage === 'string') {
        super(maybeMessage);
      } else {
        super();
      }
      this.name = `${this.name}(INVALID_OBJECT_ERROR)`;
      this.raw = err;
      this.iosCode = null;
      this.attCode = null;
      this.minAdkVersion = null;
      this.code = null;
      this.peripheralUUID = null;
      this.serviceUUID = null;
      this.characteristicUUID = null;
      this.descriptorUUID = null;
    } else {
      super(err.message);
      Object.defineProperty(this, 'raw', {
        value: err,
        enumerable: false,
      });
      if (err.iosDomain) {
        this.name = `${this.name}(${err.iosDomain})`;
      }
      const {iosCode, iosDomain, attCode, minAdkVersion, code, peripheralUUID, serviceUUID, characteristicUUID, descriptorUUID } = err;
      this.iosCode = iosCode != null ? {
        code: iosCode,
        domain: iosDomain ?? 'UNKNOWN_DOMAIN',
      } : null;
      this.attCode = attCode ?? null;
      this.minAdkVersion = minAdkVersion ?? null;
      this.code = code ?? null;
      this.peripheralUUID = peripheralUUID ?? null;
      this.serviceUUID = serviceUUID ?? null;
      this.characteristicUUID = characteristicUUID ?? null;
      this.descriptorUUID = descriptorUUID ?? null;
    }
    this.message = patchMessage(this);
  }
}
BleError.prototype.name = BleError.name;
