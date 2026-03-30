import React, { FC } from 'react';
import { LogBox } from 'react-native';
import Route from './src/routes/routes';
import { UserDataContextProvider } from './src/context/userDataContext';
import { CommonLoaderProvider } from './src/components/CommonLoader/commonLoader';
import { DriversProvider } from './src/features/drivers/driversContext';
import ErrorBoundary from './src/components/ErrorBoundary/errorBoundary';


const App: FC = () => {
  // Hiding warning logs - only used in debug mode
  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();
  return (
    <ErrorBoundary>
      <UserDataContextProvider>
        <CommonLoaderProvider>
          <DriversProvider>
            <Route />
          </DriversProvider>
        </CommonLoaderProvider>
      </UserDataContextProvider>
    </ErrorBoundary>
  );
};
export default App;
