import { AdvertisingData, Peripheral, RawPeripheral } from "./types";

export function transformPeripheral<T extends RawPeripheral>(
  peripheral: T
): Omit<T, "advertising"> & {
  advertising: Omit<T["advertising"], "manufacturerData" | "serviceData"> & {
    manufacturerData?: Uint8Array;
    serviceData?: Uint8Array;
  };
} {
  const { advertising } = peripheral;
  const { manufacturerData, serviceData, ...restAdvertizing } = advertising;
  const transformedAdvertising: Omit<T["advertising"], "manufacturerData" | "serviceData"> & {
    manufacturerData?: Uint8Array;
    serviceData?: Uint8Array;
  } = restAdvertizing as Omit<T["advertising"], "manufacturerData" | "serviceData">;
  if ("manufacturerData" in advertising && advertising.manufacturerData?.bytes != null) {
    transformedAdvertising.manufacturerData = Uint8Array.from(advertising.manufacturerData.bytes);
  }
  if ("serviceData" in advertising && advertising.serviceData?.bytes != null) {
    transformedAdvertising.serviceData = Uint8Array.from(advertising.serviceData.bytes);
  }
  return {
    ...peripheral,
    advertising: transformedAdvertising,
  };
}
