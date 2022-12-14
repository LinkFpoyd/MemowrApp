import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';
import {Audio} from 'expo-av';
import { Card } from '@rneui/themed';
import { Icon } from'react-native-elements';

export default function Nauhoitin() {

  const [tallenne, setTallenne] = useState();
  const [tallenneLista, setTallenneLista] = useState([]);
  const [tallenneNimi, setTallenneNimi] = useState("");

  const db = SQLite.openDatabase('projektidb.db');

  useEffect(() => { 
    createTable();
        }, []);

  function createTable(){
    db.transaction(tx => {
      tx.executeSql('create table if not exists aanitteet (id integer primary key not null, otsikko text, kesto text, polku text, sound text);');  
     }, null, updateList); // sound on tosiasiassa päivämäärä. 
    
  } 

  function reformTable(){
    db.transaction(tx => {
      tx.executeSql('drop table aanitteet;');  
     }, null, createTable)
  } // tälle oli tarvetta debuggauksessa, nyt ei syytä pitää käytössä


  async function startRecording() {

    if (tallenneNimi != ''){
      const tallenne = new Audio.Recording();
      try {
          let { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Salli sovelluksen käyttää mikrofonia')
      } else if (status === "granted") {
        await Audio.setAudioModeAsync({allowsRecordingIOS: true, playsInSilentModeIOS: true});
      }
        await tallenne.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        await tallenne.startAsync();
      } catch (error) {
      }
    
      setTallenne(tallenne);
      }
    else {
      Alert.alert("Anna tallenteelle nimi ensin")
    }
}


  async function stopRecording() {
    console.log('lopetetaan nauhoitus');
    setTallenne(undefined);

  
    await tallenne.stopAndUnloadAsync(); 

    console.log(tallenne)

    let lisaaTallenne = [];
    const {sound, status} = await tallenne.createNewLoadedSoundAsync();
    lisaaTallenne.push({
      name: tallenneNimi,
      duration: getDurationFormatted(status.durationMillis),
      file: tallenne.getURI()
    }); // tämän... voisi kai tehdä fiksumminkin. Toimintalogiikka oli hieman erilainen projektin alkuvaiheessa, jolloin tämä kyseinen tapa oli järkevämpi
    // toimii kuitenkin nytkin, joten annoin olla. Tallennetusta äänitteestä otetaan ja sille viedään lisätietoja tietokantaan tallennusta varten.
    // lisaaTallenne array toimii välimuotona (arrayna joka sisältää yhden objektin kerrallaan) jonka tiedot viedään tietokantaan.

    lisaaListaan(lisaaTallenne[0])

    setTallenneNimi('')

    
  }

  function lisaaListaan(aanite) {
    console.log(aanite.file)
    db.transaction(tx => {
      tx.executeSql('insert into aanitteet (otsikko, kesto, polku, sound) values (?, ?, ?, ?);',
        [aanite.name.toString(), aanite.duration.toString(), aanite.file.toString(), Date().toString()]);
          }, null, updateList)
  } // sound on oikeasti päivämäärä

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay)*60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function updateList() {
    db.transaction(tx => {
          tx.executeSql('select * from aanitteet;', [], (_, { rows }) =>
                setTallenneLista(rows._array)
                        );
                         } , null, null);
    }

 async function playSound(aanite){

  const { sound: playbackObject } = await Audio.Sound.createAsync(
    { uri: aanite.polku },
    { shouldPlay: true }
  );

  await playbackObject.playAsync();

  }

  const deleteItem = (id) => {
        db.transaction(tx => {tx.executeSql('delete from aanitteet where id = ?;'
        , [id]);}, null, updateList) 
      }


    

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder='Tallenteen nimi' textAlign={'center'} onChangeText={input => setTallenneNimi(input)} value={tallenneNimi} />
      <Button 
        title={tallenne ?  'Lopeta nauhoitus' : 'Aloita nauhoitus'}
        onPress={tallenne ? stopRecording : startRecording }
      />
      <Text style={{color: '#0000ff', marginTop: 10}}>Tallenteet:</Text>
      <FlatList 
        data={tallenneLista}
        renderItem={({ item }) =>
        <Card>
          <Card.Title style={{textAlign: 'left'}}>{item.otsikko} || {item.sound}</Card.Title>
        <Card.Divider/>
        <View style={styles.list}> 
          <Text>Kesto: {item.kesto}</Text>
          <Text style={{color: '#871a2c', marginLeft: '50%', marginRight: '5%'}} onPress={() => deleteItem(item.id)} >Poista</Text>
          <Button title='Toista' onPress={() => playSound(item)} />
        </View>
        </Card>
        }
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );

  

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderRadius: 5,
    width: 200,
    height: 40,
    marginBottom: 2,
    borderColor: 'lightgray', 
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  list:{
    width: 300,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  }
});

