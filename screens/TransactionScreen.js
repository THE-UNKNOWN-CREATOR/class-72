import * as React from 'react';
import {ToastAndroid ,Alert, Text, View, StyleSheet, TouchableOpacity, TextInput, Image, KeyboardAvoidingView} from 'react-native'
import * as Permissions from 'expo-permissions'
import {BarCodeScanner} from 'expo-barcode-scanner'
import firebase from 'firebase';
import db from '../config';

export default class TransactionScreen extends React.Component{

  constructor()
  {
    super();

    this.state = {
      cameraPermission: null,
      scanned: false,
      scannedData: '',
      buttonState: 'normal',
      scannedBookId: "",
      scannedStudentId: "",
      transactionMessage: ""
    }
  }

  InitiateBookIssue = async() => 
  {
    db.collection("transactions").add({
      'studentId': this.state.scannedStudentId,
      'bookId': this.state.scannedBookId,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': 'issue',
    })
    db.collection("books").doc(this.state.scannedBookId).update(
      {
        'bookAvailability':false
      });
    db.collection('students').doc(this.state.scannedStudentId).update(
      {
        'no-of-books-issued': firebase.firestore.FieldValue.increment(1)
      }
    )
  }

  InitiateBookReturn = async() => 
  {
    db.collection("transactions").add({
      'studentId': this.state.scannedStudentId,
      'bookId': this.state.scannedBookId,
      'date': firebase.firestore.Timestamp.now().toDate(),
      'transactionType': 'return',
    })
    db.collection("books").doc(this.state.scannedBookId).update(
      {
        'bookAvailability':true
      });
    db.collection('students').doc(this.state.scannedStudentId).update(
      {
        'no-of-books-issued': firebase.firestore.FieldValue.increment(-1)
      }
    )
  }

  handleTransaction = async() => 
  {
    var transactionMessage = "";

    db.collection("books").doc("this.state.scannedBookId").get()
    .then(doc => 
      {
        var book = doc.data()
        if(book.bookAvailability)
        {
          this.InitiateBookIssue();
          transactionMessage = "book issued";
          ToastAndroid.show(transactionMessage, ToastAndroid.SHORT);
        }
        else
        {
          this.InitiateBookReturn();
          transactionMessage = "book return"
          ToastAndroid.show(transactionMessage, ToastAndroid.SHORT);
        }
      })
      this.setState({transactionMessage: transactionMessage});
  }

  getCameraPermissions = async(id) =>
  {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({cameraPermission: status === "granted", buttonState: id, scanned:false});
  }

  hasBarcodeScanned = async({type, data}) => 
  {
    const {buttonState} = this.state;
    if(buttonState === "bookId")
      this.setState({scanned: true,  scannedData:data, buttonState: 'normal', scannedBookId:data});
    else if(buttonState === "studentId")
      this.setState({scanned: true,  scannedData:data, buttonState: 'normal', scannedStudentId:data});
  }

  render()
  {
    const cameraPermission = this.state.cameraPermission;
    const scanned = this.state.scanned;
    const buttonState = this.state.buttonState;

    if(buttonState === "normal" && cameraPermission)
    {
      return(
        <BarCodeScanner onBarCodeScanned={ scanned ? undefined : this.hasBarcodeScanned() } />
      )
    }

    else if (buttonState === "normal")
    {
      return(
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior='padding' enabled>
          
          <Image source={require("../assets/book.jfif")} style={{width: 200, height: 200}}/>
          <Text>Wily</Text>
          <TextInput style={{width: "30%", height:35, backgroundColor: "white", borderWidth: 5}} value={this.state.scannedBookId} placeholder={"BookId"} 
          onChangeText={text => {
            this.setState({scannedBookId: text});
          }}></TextInput>

          <TouchableOpacity onPress={() => {
            this.getCameraPermissions(this.state.scannedBookId);
          }}>
            <Text> Scan </Text>
          </TouchableOpacity>

          <TextInput style={{width: "30%", height:35, backgroundColor: "white", borderWidth: 5}} value={this.state.scannedStudentId} placeholder={"StudentId"} 
          onChangeText={text => {
            this.setState({scannedStudentId: text})
          }}></TextInput>

          <TouchableOpacity onPress={() => {
            this.getCameraPermissions(this.state.scannedStudentId);
          }}>
            <Text> Scan </Text>
          </TouchableOpacity>

          <View>
            <TouchableOpacity style={styles.submitButton} onpress={
              async() =>
              {
                /*var transactionMessage = */this.handleTransaction();
                this.setState({scannedBookId: '', scannedStudentId: ''})
              }
            }>
              <Text>Submit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )
    }
  }
}

const styles = StyleSheet.create({
  buton: {
    width: 100,
    height: 20,
    borderRadius: 60
  },

  submitButton: {
    width: "100%",
    height: 15,
    backgroundColor: "crimson"
  },

  keyboardAvoidingView: {
    alignItems: 'center', 
    justifyContent: 'center', 
    flex: 1, 
    backgroundColor:'red'
  }
});