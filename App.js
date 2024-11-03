import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CaptureCamera from './src/CaptureCamera';
import VideoRecording from './src/VideoRecording';

const App = () => {
  return (
    <View style={{backgroundColor: '#ffffff', flex: 1}}>
      {/* <CaptureCamera/> */}
      <VideoRecording />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
