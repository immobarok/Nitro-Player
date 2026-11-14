import { AppRegistry } from 'react-native';
import App from '../App';
import { name as appName } from '../app.json';
import './index.css';

AppRegistry.registerComponent(appName, () => App);

const rootTag = document.getElementById('root');
if (rootTag) {
  // react-native-web expects an HTMLElement rootTag while RN's RootTag type is opaque
  AppRegistry.runApplication(appName, {
    rootTag: rootTag as unknown as Parameters<
      typeof AppRegistry.runApplication
    >[1]['rootTag'],
    initialProps: {},
  });
}
