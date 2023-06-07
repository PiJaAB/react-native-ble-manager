package it.innove;

import android.bluetooth.BluetoothGattCharacteristic;
import android.bluetooth.BluetoothGattDescriptor;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;

public class Helper {

	public static WritableArray decodeProperties(BluetoothGattCharacteristic characteristic) {

		// NOTE: props strings need to be consistent across iOS and Android
		WritableArray props = Arguments.createArray();
		int properties = characteristic.getProperties();

		if ((properties & BluetoothGattCharacteristic.PROPERTY_BROADCAST) != 0x0 ) {
			props.pushString("Broadcast");
		}

		if ((properties & BluetoothGattCharacteristic.PROPERTY_READ) != 0x0 ) {
			props.pushString("Read");
		}

		if ((properties & BluetoothGattCharacteristic.PROPERTY_WRITE_NO_RESPONSE) != 0x0 ) {
			props.pushString("WriteWithoutResponse");
		}

		if ((properties & BluetoothGattCharacteristic.PROPERTY_WRITE) != 0x0 ) {
			props.pushString("Write");
		}

		if ((properties & BluetoothGattCharacteristic.PROPERTY_NOTIFY) != 0x0 ) {
			props.pushString("Notify");
		}

		if ((properties & BluetoothGattCharacteristic.PROPERTY_INDICATE) != 0x0 ) {
			props.pushString("Indicate");
		}

		if ((properties & BluetoothGattCharacteristic.PROPERTY_SIGNED_WRITE) != 0x0 ) {
			// Android calls this "write with signature", using iOS name for now
			props.pushString("AuthenticateSignedWrites");
		}

		if ((properties & BluetoothGattCharacteristic.PROPERTY_EXTENDED_PROPS) != 0x0 ) {
			props.pushString("ExtendedProperties");
		}

//      iOS only?
//
//            if ((p & CBCharacteristicPropertyNotifyEncryptionRequired) != 0x0) {  // 0x100
//                [props addObject:@"NotifyEncryptionRequired"];
//            }
//
//            if ((p & CBCharacteristicPropertyIndicateEncryptionRequired) != 0x0) { // 0x200
//                [props addObject:@"IndicateEncryptionRequired"];
//            }

		return props;
	}

	public static WritableArray decodePermissions(BluetoothGattCharacteristic characteristic) {

		// NOTE: props strings need to be consistent across iOS and Android
		WritableArray props = Arguments.createArray();
		int permissions = characteristic.getPermissions();

		if ((permissions & BluetoothGattCharacteristic.PERMISSION_READ) != 0x0 ) {
			props.pushString("Read");
		}

		if ((permissions & BluetoothGattCharacteristic.PERMISSION_WRITE) != 0x0 ) {
			props.pushString("Write");
		}

		if ((permissions & BluetoothGattCharacteristic.PERMISSION_READ_ENCRYPTED) != 0x0 ) {
			props.pushString("ReadEncrypted");
		}

		if ((permissions & BluetoothGattCharacteristic.PERMISSION_WRITE_ENCRYPTED) != 0x0 ) {
			props.pushString("WriteEncrypted");
		}

		if ((permissions & BluetoothGattCharacteristic.PERMISSION_READ_ENCRYPTED_MITM) != 0x0 ) {
			props.pushString("ReadEncryptedMITM");
		}

		if ((permissions & BluetoothGattCharacteristic.PERMISSION_WRITE_ENCRYPTED_MITM) != 0x0 ) {
			props.pushString("WriteEncryptedMITM");
		}

		if ((permissions & BluetoothGattCharacteristic.PERMISSION_WRITE_SIGNED) != 0x0 ) {
			props.pushString("WriteSigned");
		}

		if ((permissions & BluetoothGattCharacteristic.PERMISSION_WRITE_SIGNED_MITM) != 0x0 ) {
			props.pushString("WriteSignedMITM");
		}

		return props;
	}

	public static WritableArray decodePermissions(BluetoothGattDescriptor descriptor) {

		// NOTE: props strings need to be consistent across iOS and Android
		WritableArray props = Arguments.createArray();
		int permissions = descriptor.getPermissions();

		if ((permissions & BluetoothGattDescriptor.PERMISSION_READ) != 0x0 ) {
			props.pushString("Read");
		}

		if ((permissions & BluetoothGattDescriptor.PERMISSION_WRITE) != 0x0 ) {
			props.pushString("Write");
		}

		if ((permissions & BluetoothGattDescriptor.PERMISSION_READ_ENCRYPTED) != 0x0 ) {
			props.pushString("ReadEncrypted");
		}

		if ((permissions & BluetoothGattDescriptor.PERMISSION_WRITE_ENCRYPTED) != 0x0 ) {
			props.pushString("WriteEncrypted");
		}

		if ((permissions & BluetoothGattDescriptor.PERMISSION_READ_ENCRYPTED_MITM) != 0x0 ) {
			props.pushString("ReadEncryptedMITM");
		}

		if ((permissions & BluetoothGattDescriptor.PERMISSION_WRITE_ENCRYPTED_MITM) != 0x0 ) {
			props.pushString("WriteEncryptedMITM");
		}

		if ((permissions & BluetoothGattDescriptor.PERMISSION_WRITE_SIGNED) != 0x0 ) {
			props.pushString("WriteSigned");
		}

		if ((permissions & BluetoothGattDescriptor.PERMISSION_WRITE_SIGNED_MITM) != 0x0 ) {
			props.pushString("WriteSignedMITM");
		}

		return props;
	}

}