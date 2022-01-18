import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, FlatList, Text} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

// TODO: 랜덤으로 숫자 생성, 게임오버 여부, numColumns 선택
const App = () => {
    const numColumns = 4;
    const [boxData, setBoxData] = useState([]);

    useEffect(() => {
        // const items = Array.from(Array(numColumns), () => Array(numColumns).fill(0));
        // const items = [...Array(numColumns * numColumns)].map((v, i) =>
        //     i === 0 || i === 2 ? 2 : 0
        // );
        const items = [
            [0, 2, 2, 0],
            [0, 0, 0, 0],
            [2, 2, 2, 2],
            [0, 0, 0, 0],
        ];
        setBoxData(items);
    }, []);

    // 왼쪽으로 붙이기
    const move = value => {
        return value.reduce((acc, cur) => {
            const tmp = cur.filter(v => v > 0);
            acc.push(tmp.concat(Array(numColumns - tmp.length).fill(0)));
            return acc;
        }, []);
    };

    // 왼쪽으로 합치기
    const combine = value => {
        value.forEach((v, i) => {
            v.some((cur, j) => {
                if (cur === 0) return true;
                if (j > 0 && v[j - 1] === cur) {
                    v[j - 1] = v[j - 1] * 2;
                    v[j] = 0;
                }
                return false;
            });
        });
        return value;
    };

    const rotateLeft = value => {
        const result = [];
        value.forEach((a, i) => {
            a.forEach((b, j) => {
                result[a.length - j - 1] = result[a.length - j - 1] || [];
                result[a.length - j - 1][i] = b;
            });
        });
        return result;
    };

    const rotateRight = value => {
        const result = [];
        value.forEach((a, i) => {
            a.forEach((b, j) => {
                result[j] = result[j] || [];
                result[j][value.length - i - 1] = b;
            });
        });
        return result;
    };

    const reverse2d = value => value.map(v => v.slice().reverse()).reverse();

    const onSwipe = (gestureName, gestureState) => {
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
                // 왼쪽으로 돌리기 -> 왼쪽으로 붙이기 -> 합치기 -> 왼쪽으로 붙이기 -> 오른쪽으로 돌리기
                setBoxData(
                    rotateRight(move(combine(move(rotateLeft(boxData)))))
                );
                break;
            case SWIPE_DOWN:
                setBoxData(
                    rotateLeft(move(combine(move(rotateRight(boxData)))))
                );
                break;
            case SWIPE_LEFT:
                // 왼쪽으로 붙이기 -> 합치기 -> 왼쪽으로 붙이기
                setBoxData(move(combine(move(boxData))));
                break;
            case SWIPE_RIGHT:
                setBoxData(reverse2d(move(combine(move(reverse2d(boxData))))));
                break;
        }
    };

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
                    data={(boxData || []).reduce((acc, cur) => acc.concat(cur))}
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
