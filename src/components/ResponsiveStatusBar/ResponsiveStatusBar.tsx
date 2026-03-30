import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';


interface ResponsiveStatusBarProps {
  backgroundColor?: string;
  barStyle?: 'default' | 'light-content' | 'dark-content';
  translucent?: boolean;
}


const ResponsiveStatusBar: React.FC<ResponsiveStatusBarProps> = ({
  backgroundColor = 'transparent',
  barStyle = 'dark-content',
  translucent = true,
}) => {
  useEffect(() => {
    // Configure status bar on mount
    if (Platform.OS === 'android') {
      StatusBar.setBarStyle(barStyle, true);
      StatusBar.setBackgroundColor(backgroundColor, true);
      StatusBar.setTranslucent(translucent);
    } else {
      // iOS
      StatusBar.setBarStyle(barStyle, true);
    }
  }, [barStyle, backgroundColor, translucent]);

  if (Platform.OS === 'ios') {
    return (
      <StatusBar
        barStyle={barStyle}
        translucent={translucent}
        animated={true}
      />
    );
  }

  return (
    <StatusBar
      barStyle={barStyle}
      backgroundColor={backgroundColor}
      translucent={translucent}
      animated={true}
    />
  );
};

export default ResponsiveStatusBar;