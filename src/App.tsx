import {Switch} from 'react-router-dom';
import 'rsuite/dist/styles/rsuite-default.css';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import {ProfileProvider} from './context/ProfileContext';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import './styles/main.scss';
import './styles/utility.scss';

function App() {
  return (
    <ProfileProvider>
      <Switch>
        <PublicRoute path="/signin">
          <SignIn />
        </PublicRoute>
        <PrivateRoute path="/">
          <Home />
        </PrivateRoute>
      </Switch>
    </ProfileProvider>
  );
}

export default App;
