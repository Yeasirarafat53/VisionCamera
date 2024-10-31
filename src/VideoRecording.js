import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Video, {VideoRef} from 'react-native-video';

const VideoRecording = () => {
  const camera = useRef(null);
  const [cameraPermission, setCameraPermission] = useState();
  const [videoPath, setVideoPath] = useState();
  const {hasPermission, requestPermission} = useCameraPermission();

  const videoRef = useRef(null);

  console.log('this is video result', videoPath);

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await requestPermission();
      setCameraPermission(cameraPermissionStatus);
    })();
  }, []);

  // Retrieve available camera devices

  const cameraDevice = useCameraDevice('back'); // Choose back or front camera as needed

  const handleRecordVideo = async () => {
    await camera.current.startRecording({
      onRecordingFinished: video => {
        // setVideoPath(video.path)
        setVideoPath(`file://${video.path}`);
      },
      onRecordingError: error => console.error(error),
    });
  };

  const handleStopVideo = async () => {
    try {
      await camera.current.stopRecording();
    } catch (e) {
      console.log(e);
    }
  };

  const renderRecordingVideo = () => {
    return (
      <View>
        <Camera
          style={[styles.camera, styles.photoAndVideoCamera]}
          ref={camera}
          device={cameraDevice}
          isActive
          video
        />

        <View style={styles.btnGroup}>
          <TouchableOpacity style={styles.btn} onPress={handleRecordVideo}>
            <Text style={styles.captureText}>Record Video</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{...styles.btn}} onPress={handleStopVideo}>
            <Text style={styles.captureText}>Stop Video</Text>
          </TouchableOpacity>
        </View>

        {videoPath ? (
          <View style={styles.videoContainer}>
            <Video
              source={{uri: videoPath}} // Use the recorded video path
              style={styles.video}
              controls // Show video controls
              resizeMode="contain"
              onEnd={() => setVideoPath('')} // Clear the video path when done
            />
          </View>
        ) : null}
      </View>
    );
  };

  const renderContent = () => {
    if (cameraDevice == null) {
      return <ActivityIndicator size="large" color={'#1C6758'} />;
    }

    if (cameraPermission == 'authorized') {
      return null;
    }

    return renderRecordingVideo();
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.saveArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>React native camera</Text>
        </View>
      </SafeAreaView>

      <View style={styles.caption}>
        <Text style={styles.captionText}>
          Welcome to react Native vision camera.
        </Text>
      </View>

      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF2E6',
  },
  saveArea: {
    backgroundColor: '#3D8361',
  },
  header: {
    height: 50,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
  },
  caption: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionText: {
    color: '#100F0F',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    height: 460,
    width: '92%',
    alignSelf: 'center',
  },
//   photoAndVideoCamera: {
//     height: 360,
//   },
  barcodeText: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    textAlign: 'center',
    color: '#100F0F',
    fontSize: 24,
  },
  pickerSelect: {
    paddingVertical: 12,
  },
  image: {
    marginHorizontal: 16,
    paddingTop: 8,
    width: 80,
    height: 80,
  },
  dropdownPickerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 9,
  },
  btnGroup: {
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btn: {
    backgroundColor: '#63995f',
    margin: 13,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
  videoContainer: {
    width: 200,
    height: 300, // Set the height as needed
  },
  video: {
    width: '100%',
    height: 250,
    // marginTop: 50,
    // borderWidth:1
  },
});

export default VideoRecording;
