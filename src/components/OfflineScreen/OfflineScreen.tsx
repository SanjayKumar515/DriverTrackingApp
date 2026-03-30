import { StyleSheet, View } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { Colors, Images } from '../../constant';
import TextView  from '../TextView/textView';


const OfflineScreen = () => {
    return (
        <View style={ [ styles.container ] }>
            {/* <View style={{position:'absolute'}}> */ }

            {/* <Header title={'Hii5'} icon icon1 icon2 /> */ }
            {/* </View> */ }


            <LottieView
                source={ Images.offline }
                autoPlay
                loop
                style={ styles.icon }
            />
            <TextView style={ styles.text }>
                Internet connection is not available
            </TextView>

        </View>
    );
};

export default OfflineScreen;

const styles = StyleSheet.create( {
    container: {
        backgroundColor: Colors.PRIMARY[ 300 ],
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        flex: 1
    },
    icon: {
        height: 150,
        width: 150
    },
    text: {
        textAlign: 'center',
        color: Colors.PRIMARY[ 400 ],
        marginTop: 10,
        fontSize:16
    }
} );
