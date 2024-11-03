import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import Video from 'react-native-video';
import Modal from 'react-native-modal';

const VideoRecording = () => {
  const cameraRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState();
  const [videoPath, setVideoPath] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false); // New state for recording status
  const [recordingTime, setRecordingTime] = useState(0); // Timer state
  // const {hasPermission, requestPermission} = useCameraPermission();
  // Use hooks to get permissions
  const {requestPermission: requestCameraPermission} = useCameraPermission();
  const {requestPermission: requestMicrophonePermission} =
    useMicrophonePermission();

  const cameraDevice = useCameraDevice('front');

  // Timer logic
  useEffect(() => {
    let timer;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000); // Increment time every second
    } else {
      clearInterval(timer); // Clear timer when recording stops
    }

    return () => clearInterval(timer); // Cleanup on unmount or when recording stops
  }, [isRecording]);

  // const handlePermissionAndOpenCamera = async () => {
  //   const permission = await requestPermission();
  //   setCameraPermission(permission);

  //   if (permission === true || cameraPermission === true) {
  //     setRecordingTime(0); // Reset timer when camera is opened

  //     setIsCameraActive(true);
  //   }
  // };

  const handlePermissionAndOpenCamera = async () => {
    const cameraPermission = await requestCameraPermission();
    const microphonePermission = await requestMicrophonePermission();

    if (cameraPermission === true && microphonePermission === true) {
      setRecordingTime(0); // Reset timer when camera is opened
      setIsCameraActive(true); // Open camera
    } else {
      // Handle permission denied case
      console.log('Permissions denied');
    }
  };

  // Start recording
  const handleRecordVideo = async () => {
    setIsRecording(true); // Set recording status to true
    setRecordingTime(0); // Reset timer before starting

    await cameraRef.current.startRecording({
      onRecordingFinished: video => {
        setVideoPath(`file://${video.path}`);

        setIsCameraActive(false);
        setIsRecording(false); // Reset recording status
      },
      onRecordingError: error => console.error(error),
    });
  };

  // Stop recording
  const handleStopVideo = async () => {
    try {
      await cameraRef.current.stopRecording();

      setIsRecording(false); // Reset recording status
      setIsCameraActive(false); // Close camera
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerText}>React Native Camera</Text>
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.recorderButton}
          onPress={handlePermissionAndOpenCamera}>
          <Text style={styles.recorderText}>Recorder</Text>
        </TouchableOpacity>

        {/* {isCameraActive && cameraDevice ? (
          <View style={styles.cameraContainer}>
            <Camera
              style={styles.camera}
              ref={cameraRef}
              device={cameraDevice}
              isActive={isCameraActive}
              video
            />
          
            <View style={styles.buttonOverlay}>
              <TouchableOpacity
                style={styles.recordButton}
                onPress={handleRecordVideo}>
                <Text style={styles.recordButtonText}>Record</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.recordButton}
                onPress={handleStopVideo}>
                <Text style={styles.recordButtonText}>Stop</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null} */}

        {isCameraActive && (
          <Modal
            transparent={true}
            visible={isCameraActive}
            onRequestClose={() => setIsCameraActive(false)}
            style={styles.modal}>
            <Camera
              style={styles.camera}
              ref={cameraRef}
              device={cameraDevice}
              isActive={isCameraActive}
              video
              audio
            />

            {/* record time count */}
            <View style={styles.overlay}>
              <Text style={styles.timerText}>{recordingTime}s</Text>
            </View>

            {/* Start & Stop button */}
            <View style={styles.captureButtonContainer}>
              {/* <TouchableOpacity
                 onPress={handleRecordVideo}
                style={styles.captureButton}></TouchableOpacity>

              
              <TouchableOpacity
                onPress={handleStopVideo}
                style={styles.captureButton2}>
                <View style={styles.innerCaptureButton2} />
              </TouchableOpacity>  */}

              {!isRecording ? (
                // Show "Start" button when not recording
                <TouchableOpacity
                  onPress={handleRecordVideo}
                  style={styles.captureButton}>
                  <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
              ) : (
                // Show "Stop" button when recording
                <TouchableOpacity
                  onPress={handleStopVideo}
                  style={styles.captureButton2}>
                  <View style={styles.innerCaptureButton2} />
                  <Text style={styles.buttonText}>Stop</Text>
                </TouchableOpacity>
              )}
            </View>
          </Modal>
        )}

        {/* recorded video showing */}
        {videoPath && !isCameraActive ? (
          <View style={styles.videoContainer}>
            <Video
              source={{uri: videoPath}}
              style={styles.video}
              controls
              resizeMode="contain"
              onEnd={() => setVideoPath(null)}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#EEF2E6',
  },
  safeArea: {
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recorderButton: {
    backgroundColor: '#63995f',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  recorderText: {
    color: '#ffffff',
    fontSize: 18,
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonOverlay: {
    position: 'absolute',
    bottom: 30,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  recordButton: {
    backgroundColor: '#FF6347',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonText: {
    color: '#FFF',
    fontSize: 14,
  },
  videoContainer: {
    marginTop: 20,
    width: '90%',
    height: 300,
  },
  video: {
    width: '100%',
    height: '100%',
  },

  // camera kit
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    alignItems: 'center',
  },

  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 5,
    borderColor: '#ffffff',
  },
  // innerCaptureButton: {
  //   width: 60,
  //   height: 60,
  //   borderRadius: 30,
  //   // backgroundColor: 'red',
  //   borderWidth: 5,
  //   borderColor: '#ffffff',
  // },

  captureButton2: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCaptureButton2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    position: 'absolute',
    fontWeight: 'bold',
  },

  // timer
  overlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },

  timerText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'red',
    paddingHorizontal: 10,
    borderRadius: 10,
    width: 50,
    textAlign: 'center',
  },
});

export default VideoRecording;
