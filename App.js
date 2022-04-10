import * as React from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import * as Location from 'expo-location';
const axios = require('axios');

export default function App() {
  const [initialRegion, setInitialRegion] = React.useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [markers, setMarkers] = React.useState([])
  const [loaded, setLoaded] = React.useState(false)

    React.useEffect(() => {
      (async () => {
        axios.get('https://cockroachapp.herokuapp.com/')
        .then(function (response) {
          let marks=[]
          response.data.forEach(element=>{
            marks.push({title:"Router at", description: element.latitude+", "+element.longitude, coord:{latitude: element.latitude, longitude: element.longitude}})
          })
          setMarkers(marks)
        })
        .catch(function (error) {
          console.log("error",error);
        })
        .then(function () {
          console.log(markers)
        });
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLoaded(true)
          setErrorMsg('Permission to access location was denied');
          console.log("not granted")
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLoaded(true)
        console.log("granted")
        setInitialRegion({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,})
       // setLocation(location);
      })();
    }, []);
  return (
    <View style={styles.container}>
      {
        (loaded)?
              <MapView style={styles.map} region={initialRegion} onRegionChangeComplete={(region)=>{setInitialRegion(region)}}>
              {markers.map((marker, index) => (
                <Marker
                  key={index}
                  coordinate={marker.coord}
                  title={marker.title}
                  description={marker.description}
                />
              ))}
            </MapView> : <View>
              <Text style={{fontSize:20, textAlign: 'center', paddingBottom: '5%'}}>Loading...</Text>

              <Text style={{}}>Made with ♥, powered by CockroachDB</Text>
            </View>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});