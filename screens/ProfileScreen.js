import * as React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';

import * as SecureStore from 'expo-secure-store';

export default class ProfileScreen extends React.Component {
  constructor(props) {
    super(props)

    // Initialize our login state
    this.state = {
        email: "",
        username: "",
        firstName: "",
        lastName: "",
        status: "",
        session: null,
        user: null,
        error: null,
    }
  }

  componentDidMount(){
    this.checkSessionToken();
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
      this.loadProfile();
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
      this.loadProfile();
    });

  }

  loadProfile(){
        if(this.state.session != null && this.state.user != null)
        {
            let urls=[]; 
            //urls[0]="https://webdev.cse.buffalo.edu/hci/gme/api/api/users/" + this.state.user;
            urls[0] = "https://webdev.cse.buffalo.edu/hci/gme/api/api/users/69";
            if(urls){
                var headerOptions = {
                    method: "get",
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer '+ this.state.session}
                    }; 

                fetch(urls[0], headerOptions)
                    .then(res => res.json())
                    .then(
                        result => {
                        if (result) {
                            console.log(result);              
                            this.setState({
                            // IMPORTANT!  You need to guard against any of these values being null.  If they are, it will
                            // try and make the form component uncontrolled, which plays havoc with react
                            email: result.email || "",
                            username: result.username || "",
                            firstName: result.firstName || "",
                            lastName: result.lastName || "",
                            status: result.status || "",
                            });
                        }
                        },
                        error => {
                        alert("error!");
                        }
                    );                
            }
        }
        else
        {
            console.log("Waiting on Session + User ID")
        }
    }
  render() {

    // this could use some error handling!
    // the user will never know if the login failed.
    return (
      <View style={styles.container}>
          <Text style={styles.profileText}>Email: {this.state.email}</Text>
          <Text style={styles.profileText}>Username: {this.state.username}</Text>
          <Text style={styles.profileText}>First Name: {this.state.firstName}</Text>
          <Text style={styles.profileText}>Last Name: {this.state.lastName}</Text>
          <Text style={styles.profileText}>Status: {this.state.status}</Text>
      </View>
    );
  }
}

// Our stylesheet, referenced by using styles.container or styles.loginText (style.property)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#010423',
    padding: 30
  },
  profileText: {
    fontSize: 20,
    color: '#ffff',
  },
});