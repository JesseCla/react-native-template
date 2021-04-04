import * as React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

import * as SecureStore from 'expo-secure-store';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props)

    // Initialize our login state
    this.state = {
      email: '',
      password: ''
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
      console.log(`Logging in with session token: ${json.token}`);

      // enter login logic here
      SecureStore.setItemAsync('session', json.token).then(() => {
        this.props.route.params.onLoggedIn();
      });
    })
    .catch(exception => {
        console.log("Error occured", exception);
        // Do something when login fails
    })
  }
  render() {
    const { email, password } = this.state

    // this could use some error handling!
    // the user will never know if the login failed.
    return (
      <View style={styles.container}>
        <Text style={styles.loginText}>Login</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ email: text })}
          value={email}
          textContentType="emailAddress"
        />
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ password: text })}
          value={password}
          textContentType="password"
          secureTextEntry={true}
        />
        <Button title="Submit" onPress={() => this.onSubmit()} />
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
    color: "#010423",
    textAlign: "center",
    marginBottom: 30
  },
  input: {
    height: 40,
    backgroundColor: '#ffff',
    borderColor: 'white',
    borderWidth: 1,
    marginBottom: 20
  }
});