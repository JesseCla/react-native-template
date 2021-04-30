import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Modal,Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import * as SecureStore from 'expo-secure-store';

export default class HomeScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      isLoaded: false,
      error: null,
      posts: [],
      session: null,
      user: null,
      modalVisible: false,
      addValue: "",
    }
  }

  checkSessionToken = () => {
    SecureStore.getItemAsync('session').then(token => {
      if(token){
        this.setState({
          session: token
        });
        console.log("Session Token " + token + " Set");
      }
      else{
        console.log("Token Not Found");
      }
      this.loadPosts();
    });

    SecureStore.getItemAsync('user').then(token => {
      if(token){
        this.setState({
          user: token
        });
        console.log("User ID " +  token  + " Set");
      }
      else{
        console.log("User Not Found");
      }
      this.loadPosts();
    });

  }

  loadPosts(){
    if(this.state.session != null && this.state.user != null)
    {
      console.log("Fetching Posts...")
      let urls=[]; 
      urls[0]="https://webdev.cse.buffalo.edu/hci/gme/api/api/posts?sort=newest&type=Post&authorID=" + this.state.user;
      urls[1]="https://webdev.cse.buffalo.edu/hci/gme/api/api/posts?sort=newest&type=Mobile&authorID=" + this.state.user;
      if(urls)
    {
      var headerOptions = {
        method: "get",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ this.state.session}
        };

      

        Promise.all(urls.map(url => fetch(url,headerOptions)))
        .then(resp => Promise.all( resp.map(r => r.json())))
        .then(result => {
          var postList = [];
          var val;
          for(var key in result){
            if (result.hasOwnProperty(key)) {
              if(key != 0)
              {
                val = result[0][0].concat(result[key][0]);
              }
              else{
                val = result[0][0];
              }
              postList[0] = val;
            }
          
          }
          this.setState({
            isLoaded: true,
            posts: postList[0]
          });
          console.log("Got Posts");
          console.log(this.state.posts);
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
          console.log("ERROR loading Posts")
        }
        );
    }
    }
    else{
      console.log("Session and ID not set yet")
    }
  }

  componentDidMount(){
    this.checkSessionToken();
  }

  postDisplay(){
    return this.state.posts.map(function(posts, i){
      return(
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{posts.author.email}</Text>
          <View>
            <Text style={styles.cardDescription}>{posts.content}</Text>
            <Text style={styles.cardDescription}>{posts.createdAt}</Text>
          </View>
        </View>
      );
    });
  }

  toggleModal(){
    var val = this.state.modalVisible;
    val = !val;
    this.setState({ modalVisible: val });
  }

  makeNewPost(){
    var searchOptions = {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '+ this.state.session
      },
      body: JSON.stringify({
          authorID: this.state.user,
          content: this.state.addValue,
          type: "Mobile",
      })
    };
    if(this.state.addValue != ""){
      console.log("Making POST request to add " + this.state.addValue + " as a post.");
      fetch("https://webdev.cse.buffalo.edu/hci/gme/api/api/posts/", searchOptions)
      .then(res => res.json())
      .then(
          result => {
            console.log(result);
            this.setState({
              modalVisible: false
            });
            this.loadPosts();
          },
          error => {
              alert("error!");
          }
      )
      .then(() => this.setState({ redirect: true }));
    }
  }
  
  //Modal rendering code is sourced from
  //https://www.geeksforgeeks.org/how-to-create-custom-dialog-box-with-text-input-react-native/
  render() {
    const {inputValue} = this.state
    return (
      
      <View style={styles.container}>
        <Modal animationType="slide" 
        transparent visible={this.state.modalVisible} 
        presentationStyle="overFullScreen" 
        onDismiss={() => this.toggleModal()}>
          <View style={styles.viewWrapper}>
            <View style={styles.modalView}>
              <TextInput placeholder="Insert Post Text Here..." 
                value={inputValue} style={styles.textInput} 
                onChangeText={(value) => this.setState({addValue: value})}/>
              <TouchableOpacity onPress={() => this.makeNewPost()} style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}>{"Submit"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.toggleModal()} style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}>{"Close"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        {this.postDisplay()}

        </ScrollView>
        <TouchableOpacity onPress={() => this.toggleModal()} style={styles.appButtonContainer}>
          <Text style={styles.appButtonText}>{"Add Post"}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010423',
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: '#1db954',
    padding: 10,
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 20,
    color: '#ffff',
    marginBottom: 10
  },
  cardDescription: {
    fontSize: 12,
    color: '#ffff',
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#1db954",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 12
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase"
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    width: "100%",
    elevation: 5,
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 7,
  },


});