import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, FlatList, Text} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const App = () => {
    const numColumns = 4;
    const [boxData, setBoxData] = useState([]);

    useEffect(() => {
        const items = [...Array(numColumns * numColumns)].map((v, i) =>
            i === 0 || i === 2 ? 2 : 0
        );
        setBoxData(items);
    }, []);

    // 1차원배열로 해보기?
    function onSwipeLeft() {
    }

    function onSwipe(gestureName, gestureState) {
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
                // setBoxData([...Array(numColumns * numColumns)].map((v, i) => 1));
                break;
            case SWIPE_DOWN:
                // setBoxData([...Array(numColumns * numColumns)].map((v, i) => 2));
                break;
            case SWIPE_LEFT:
                onSwipeLeft();
                break;
            case SWIPE_RIGHT:
                setBoxData([...Array(numColumns * numColumns)].map((v, i) => 4));
                break;
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <GestureRecognizer
                onSwipe={(direction, state) => onSwipe(direction, state)}
                config={{
                    velocityThreshold: 0.3,
                    directionalOffsetThreshold: 80,
                }}
                style={styles.gesture}>
                <FlatList
                    data={boxData}
                    renderItem={({item}) => (
                        <View style={styles.box}>
                            <Text>{item || ''}</Text>
                        </View>
                    )}
                    numColumns={numColumns}
                    keyExtractor={(item, index) => index}
                />
            </GestureRecognizer>
        </SafeAreaView>
    );
};
export default App;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: 100,
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#e9e9e9',
        margin: 1,
    },
    gesture: {
        flex: 1,
    },
});
