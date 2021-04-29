import * as React from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';

import * as SecureStore from 'expo-secure-store';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)

    // Initialize our login state
    this.state = {
      email: '',
      password: '',
      errorMsg: ""
    }
  }
  // On our button press, attempt to login
  // this could use some error handling!
  onSubmit = () => {
    const { email, password } = this.state;

    fetch("https://webdev.cse.buffalo.edu/hci/gme/api/api/auth/login", {
      method: "POST",
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
      body: JSON.stringify({
        email,
        password
      })
    })
    .then(response => response.json())
    .then(json => {
      //If the json.token exists, store and handle it. Else display error.
      if(json.token)
      {
        console.log(json);
        console.log(`Logging in with session token: ${json.token}`);

        SecureStore.setItemAsync('user', json.userID.toString()).then(() => {
          this.props.route.params.onLoggedIn();
        });

        SecureStore.setItemAsync('session', json.token).then(() => {
          this.props.route.params.onLoggedIn();
        });
      }
      else{
        console.log("Token exception");
        this.setState({errorMsg: "Invalid Login, Please Try Again."});
      }
    })
    .catch(exception => {
        console.log("Error occured", exception);
        // Do something when login fails
        this.setState({errorMsg: "Unable to Contact Server, Please Restart the App."});

    })
  }
  render() {
    const { email, password } = this.state

    // this could use some error handling!
    // the user will never know if the login failed.
    return (
      <View style={styles.container}>
        <Text style={styles.loginText}>Log-in</Text>
        <Text style={styles.errorText}>{this.state.errorMsg}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={text => this.setState({ email: text })}
          value={email}
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={text => this.setState({ password: text })}
          value={password}
          textContentType="password"
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={() => this.onSubmit()} style={styles.appButtonContainer}>
          <Text style={styles.appButtonText}>{"Submit"}</Text>
        </TouchableOpacity>
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
  loginText: {
    fontSize: 30,
    color: "#ffff",
    textAlign: "center",
    marginBottom: 30
  },
  errorText: {
    fontSize: 30,
    color: "#ff0000",
    textAlign: "center"
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
  input: {
    height: 40,
    backgroundColor: '#ffff',
    borderRadius: 50,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15
  },
});