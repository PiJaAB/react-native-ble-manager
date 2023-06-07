package it.innove;

import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import android.bluetooth.BluetoothGattService;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import javax.annotation.Nullable;

public class ErrorHelper {
    public static final String MESSAGE_KEY = "message";
    public static final String CODE_KEY = "code";
    public static final String ATT_STATUS_KEY = "attStatus";

    public static final String PERIPHERAL_KEY = "peripheralUUID";
    public static final String SERVICE_KEY = "serviceUUID";
    public static final String CHARACTERISTIC_KEY = "characteristicUUID";
    public static final String DESCRIPTOR_KEY = "descriptorUUID";

    public static WritableMap makeCustomError(String message, BleErrorCode code, @Nullable BluetoothDevice device) {
        WritableMap map = Arguments.createMap();
        map.putString(MESSAGE_KEY, message);
        map.putInt(CODE_KEY, code.getNumVal());
        if (device != null) {
            map.putString(PERIPHERAL_KEY, device.getAddress());
        }
        return map;
    }

    public static WritableMap makeCustomError(String message, BleErrorCode code) {
        return makeCustomError(message, code, (BluetoothDevice) null);
    }

    public static WritableMap makeCustomError(String message, BleErrorCode code, @Nullable BluetoothDevice device, @Nullable BluetoothGattService service) {
        WritableMap map = makeCustomError(message, code, device);
        if (service != null) {
            map.putString(SERVICE_KEY, service.getUuid().toString());
        }
        return map;
    }

    public static WritableMap makeCustomError(String message, BleErrorCode code, @Nullable BluetoothGattService service) {
        return makeCustomError(message, code, null, service);
    }

    public static WritableMap makeCustomError(String message, BleErrorCode code, @Nullable BluetoothDevice device, @Nullable BluetoothGattCharacteristic characteristic) {
        if (characteristic == null) {
            return makeCustomError(message, code, device);
        }
        BluetoothGattService service = characteristic.getService();
        WritableMap map = makeCustomError(message, code, device, service);
        map.putString(CHARACTERISTIC_KEY, characteristic.getUuid().toString());
        return map;
    }

    public static WritableMap makeCustomError(String message, BleErrorCode code, @Nullable BluetoothGattCharacteristic characteristic) {
        return makeCustomError(message, code, null, characteristic);
    }

    public static WritableMap makeCustomError(String message, BleErrorCode code, @Nullable BluetoothDevice device, @Nullable BluetoothGattDescriptor descriptor) {
        if (descriptor == null) {
            return makeCustomError(message, code, device);
        }
        BluetoothGattCharacteristic characteristic = descriptor.getCharacteristic();
        WritableMap map = makeCustomError(message, code, device, characteristic);
        map.putString(DESCRIPTOR_KEY, descriptor.getUuid().toString());
        return map;
    }

    public static WritableMap makeCustomError(String message, BleErrorCode code, @Nullable BluetoothGattDescriptor descriptor) {
        return makeCustomError(message, code, null, descriptor);
    }

}
