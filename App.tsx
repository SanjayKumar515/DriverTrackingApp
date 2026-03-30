import React, { FC } from 'react';
import { LogBox } from 'react-native';
import Route from './src/routes/routes';
import { UserDataContextProvider } from './src/context/userDataContext';
import { CommonLoaderProvider } from './src/components/CommonLoader/commonLoader';
import { DriversProvider } from './src/features/drivers/driversContext';


const App: FC = () => {
  // Hiding warning logs - only used in debug mode
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
  return (
    <UserDataContextProvider>
      <CommonLoaderProvider>
        <DriversProvider>
          <Route />
        </DriversProvider>
      </CommonLoaderProvider>
    </UserDataContextProvider>
  );
};
export default App;
