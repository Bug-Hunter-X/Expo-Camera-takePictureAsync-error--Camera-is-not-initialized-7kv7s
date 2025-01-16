The solution involves using a `ref` to access the `Camera` component and checking if it's ready before calling `takePictureAsync`.  We also add a loading indicator to provide feedback to the user.

```javascript
import * as React from 'react';
import { Camera, CameraType } from 'expo-camera';
import { View, Button, Image, ActivityIndicator } from 'react-native';

const App = () => {
  const [hasPermission, setHasPermission] = React.useState(null);
  const [type, setType] = React.useState(CameraType.back);
  const [photo, setPhoto] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const cameraRef = React.useRef(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      setIsLoading(false); // Set loading to false after permissions are granted
    })();
  }, []);

if (hasPermission === null) {
    return <View />; // Placeholder while permission is being requested
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    setIsLoading(true); // Show loading indicator
    if (cameraRef.current) {
      try {
        let photo = await cameraRef.current.takePictureAsync();
        setPhoto(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
      } finally {
        setIsLoading(false); // Hide loading indicator
      }
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? <ActivityIndicator size="large" /> : (
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <Button title="Take Picture" onPress={takePicture} />
          </View>
        </Camera>
      )}
      {photo && <Image source={{ uri: photo }} style={styles.photo} />}
    </View>
  );
};
```