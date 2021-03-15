import React from 'react';
import {Container, Grid, Col, Panel, Row, Button, Icon, Alert} from 'rsuite';
import {auth, database} from '../misc/firebase';
import firebase from 'firebase/app';

const SignIn: React.FC = () => {
  const signInWithProvider = async (
    provider:
      | firebase.auth.GoogleAuthProvider
      | firebase.auth.FacebookAuthProvider
  ) => {
    try {
      const {additionalUserInfo, user} = await auth.signInWithPopup(provider);

      if (additionalUserInfo.isNewUser) {
        await database.ref(`/profiles/${user.uid}`).set({
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }
      Alert.success('Signed In', 4000);
    } catch (e) {
      Alert.info(e.message, 4000);
    }
  };

  const onFacebookSignIn = () => {
    signInWithProvider(new firebase.auth.FacebookAuthProvider());
  };

  const onGoogleSignIn = () => {
    signInWithProvider(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <Container>
      <Grid className="mt-page">
        <Row>
          <Col xs={24} md={12} mdOffset={6}>
            <Panel>
              <div className="text-center">
                <h2>Welcome to kztchat</h2>
                <p>Progressive chat platform</p>
              </div>
              <div className="mt-3">
                <Button block color="blue" onClick={onFacebookSignIn}>
                  <Icon icon="facebook" /> Coninue with Facebook
                </Button>
                <Button block color="red" onClick={onGoogleSignIn}>
                  <Icon icon="google" /> Coninue with Google
                </Button>
              </div>
            </Panel>
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};

export default SignIn;
