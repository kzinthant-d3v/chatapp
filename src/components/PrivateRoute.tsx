import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {Container, Loader} from 'rsuite';
import {useProfile} from '../context/ProfileContext';

interface IPrivateRoute {
  children: React.ReactNode;
  path: string;
}

const PrivateRoute: React.FC<IPrivateRoute> = ({
  children,
  ...routeProps
}: IPrivateRoute) => {
  const {profile, isLoading} = useProfile();

  if (isLoading && !profile) {
    return (
      <Container>
        <Loader center vertical size="md" content="Loading" speed="slow" />
      </Container>
    );
  }
  if (!profile) {
    return <Redirect to="/signin" />;
  }
  return <Route {...routeProps}>{children}</Route>;
};

export default PrivateRoute;
