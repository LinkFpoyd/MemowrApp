import React, {useState, useEffect} from 'react';
import * as SQLite from 'expo-sqlite';
import { StyleSheet, Text, View, TextInput, Button, FlatList, Alert, Modal, Pressable } from 'react-native';
import { Card } from '@rneui/themed';


export default function Muistiinpanot() {
  const [teksti, setTeksti] = useState('');
  const [otsikko, setOtsikko] = useState('');
  const [list, setList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const db = SQLite.openDatabase('projektidb.db');

  useEffect(() => { 
    db.transaction(tx => {
          tx.executeSql('create table if not exists muistiinpanot (id integer primary key not null, teksti text, otsikko text, pvm text);');  
         }, null, updateList);}, []);

  const lisaa = () => {
    db.transaction(tx => {
          tx.executeSql('insert into muistiinpanot (teksti, otsikko, pvm) values (?, ?, ?);',
            [teksti, otsikko, Date().toString()]);
              }, null, updateList)
    clean()       
    }
  
  const clean = () => {
    setTeksti('');
    setOtsikko('');
  }

  const updateList = () => {
    db.transaction(tx => {
          tx.executeSql('select * from muistiinpanot;', [], (_, { rows }) =>
                setList(rows._array)
                        );
                         } , null, null);
    }  

  const deleteItem = (id) => {
    db.transaction(tx => {tx.executeSql('delete from muistiinpanot where id = ?;'
    , [id]);}, null, updateList) 
  }

  const suljeJaTallenna = () => {
    lisaa()
    setModalVisible(!modalVisible)
  }

  function createTable(){
    db.transaction(tx => {
      tx.executeSql('create table if not exists muistiinpanot (id integer primary key not null, teksti text, otsikko text, pvm text);');  
     }, null, updateList);
    
  } 

  function reformTable(){
    db.transaction(tx => {
      tx.executeSql('drop table muistiinpanot;');
     }, null, createTable)
  } // oli käytössä debuggaustarkoitukseen

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal suljettu.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Lisää muistiinpano alle</Text>
              <TextInput style={styles.input1} placeholder='Otsikko' textAlign={'center'} onChangeText={input => setOtsikko(input)} value={otsikko}/>
              <TextInput style={styles.input} placeholder='Teksti' textAlign={'center'} onChangeText={input => setTeksti(input)} multiline={true} value={teksti}/>
              <Button style={styles.button} onPress={suljeJaTallenna} title='Lisää muistiinpanoihin'/>
            <Button style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
              title='Peru lisäys'
            />
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Lisää muistiinpano</Text>
      </Pressable>
      <FlatList 
        data={list}
        renderItem={({ item }) =>
        <Card>
          <Card.Title style={{textAlign: 'left'}}>{item.otsikko} || {item.pvm}</Card.Title>
        <Card.Divider/>
        <View style={styles.list}> 
          <Text>{item.teksti}</Text>
        </View>
          <Text style={{color: '#871a2c', marginLeft: '90%'}} onPress={() => deleteItem(item.id)} >Done</Text>
        </Card>
        }
        keyExtractor={(item, index) => index.toString()}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  input: {
    width: 200,
    height: '30%',
    marginBottom: 2,
    textAlignVertical: "top",
  },
  input1: {
    width: 200,
    height: '20%',
    marginBottom: 2,
    textAlignVertical: "top",
    textAlign: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  text: {
    color: 'blue',
    fontSize: 20,
    margin: 20,
  },
  list:{
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
