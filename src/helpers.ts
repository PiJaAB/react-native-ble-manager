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
  if ("manufacturerData" in advertising) {
    transformedAdvertising.manufacturerData =
      manufacturerData && Uint8Array.from(manufacturerData.bytes);
  }
  if ("serviceData" in advertising) {
    transformedAdvertising.serviceData =
      serviceData && Uint8Array.from(serviceData.bytes);
  }
  return {
    ...peripheral,
    advertising: transformedAdvertising,
  };
}
