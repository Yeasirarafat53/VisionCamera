import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Button,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

function CaptureCamera() {
  const device = useCameraDevice('back');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const {hasPermission, requestPermission} = useCameraPermission();

  console.log('has permission==-=-', hasPermission);

  const handleOpenCamera = async () => {
    const permission = await requestPermission();
    console.log('permission ----', permission);

    if (permission === true) {
      // Permission granted, now you can open the camera
      setIsCameraActive(true);
    }
  };

  // Handle loading state when permission is being requested
  if (hasPermission === null) {
    return <ActivityIndicator size="large" />;
  }

  // Render the camera if permission is granted and device is available
  return (
    <SafeAreaView style={styles.container}>
      {isCameraActive ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
        
        />
      ) : (
        <Button title="Open Camera" onPress={handleOpenCamera} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    margin: 20,
    color: 'red',
  },
});

export default CaptureCamera;
