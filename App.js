import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    FlatList,
    Text,
    Button,
} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

// TODO: 게임오버 체크
const App = () => {
    const newInitBox = value => {
        return Array.from(Array(value), () => Array(value).fill(0));
    };

    // 랜덤으로 띄우기
    const generate = (num, array) => {
        const emptyIdx = [];
        array.forEach((a, i) =>
            a.forEach((b, j) => {
                if (!b) emptyIdx.push([i, j]);
            })
        );

        const box = array.slice();
        // 랜덤으로 num개 2로 채워주기
        for (let i = 0; i < num; i++) {
            const randIdx = Math.floor(Math.random() * emptyIdx.length);
            const [v] = emptyIdx.splice(randIdx, 1);
            box[v[0]][v[1]] = 2;
        }
        return box;
    };

    const [numColumns, setNumColumns] = useState(4);
    const [boxData, setBoxData] = useState(generate(2, newInitBox(numColumns)));

    const changeNumColumns = value => {
        setNumColumns(value);
        setBoxData(generate(2, newInitBox(value)));
    };

    function change(value) {
        return {
            // 왼쪽으로 붙이기
            move() {
                value = value.reduce((acc, cur) => {
                    const tmp = cur.filter(v => v > 0);
                    acc.push(tmp.concat(Array(numColumns - tmp.length).fill(0)));
                    return acc;
                }, []);
                return this;
            },

            // 왼쪽으로 합치기
            combine() {
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
                return this;
            },

            rotateLeft() {
                const result = [];
                value.forEach((a, i) => {
                    a.forEach((b, j) => {
                        result[a.length - j - 1] = result[a.length - j - 1] || [];
                        result[a.length - j - 1][i] = b;
                    });
                });
                value = result;
                return this;
            },
            
            rotateRight() {
                const result = [];
                value.forEach((a, i) => {
                    a.forEach((b, j) => {
                        result[j] = result[j] || [];
                        result[j][value.length - i - 1] = b;
                    });
                });
                value = result;
                return this;
            },

            reverse2d() {
                value = value.map(v => v.slice().reverse()).reverse();
                return this;
            },

            swipeFn() {
                // 하나도 안 바뀌었으면 새로 생성하지 않는다
                if (!checkEqual2d(boxData, value)) {
                    setBoxData(generate(1, value));
                }
            },
        };
    }

    const checkEqual2d = (originArr, afterArr) => {
        for (let i = 0; i < numColumns; i++) {
            for (let j = 0; j < numColumns; j++) {
                if (originArr[i][j] !== afterArr[i][j]) return false;
            }
        }
        return true;
    };

    const onSwipe = (gestureName, gestureState) => {
        const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
        switch (gestureName) {
            case SWIPE_UP:
                // TODO: 붙일게 있는지 체크해서 게임오버 체크
                // 왼쪽으로 돌리기 -> 왼쪽으로 붙이기 -> 합치기 -> 왼쪽으로 붙이기 -> 오른쪽으로 돌리기
                change(boxData)
                    .rotateLeft()
                    .move()
                    .combine()
                    .move()
                    .rotateRight()
                    .swipeFn();
                break;
            case SWIPE_DOWN:
                change(boxData)
                    .rotateRight()
                    .move()
                    .combine()
                    .move()
                    .rotateLeft()
                    .swipeFn();
                break;
            case SWIPE_LEFT:
                // 왼쪽으로 붙이기 -> 합치기 -> 왼쪽으로 붙이기
                change(boxData)
                    .move()
                    .combine()
                    .move()
                    .swipeFn();
                break;
            case SWIPE_RIGHT:
                change(boxData)
                    .reverse2d()
                    .move()
                    .combine()
                    .move()
                    .reverse2d()
                    .swipeFn();
                break;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <GestureRecognizer
                onSwipe={(direction, state) => onSwipe(direction, state)}
                config={{
                    velocityThreshold: 0.01,
                    directionalOffsetThreshold: 80,
                }}
                style={styles.gesture}>
                <FlatList
                    data={boxData.reduce((acc, cur) => acc.concat(cur))}
                    renderItem={({item}) => (
                        <View style={styles.box}>
                            <Text style={styles.boxText}>{item || ''}</Text>
                        </View>
                    )}
                    numColumns={numColumns}
                    keyExtractor={(item, index) => item + index}
                    key={numColumns}
                />
            </GestureRecognizer>
            <View style={styles.buttonGroup}>
                <Button
                    style={styles.button}
                    color="#1FB963"
                    title="4X4"
                    onPress={() => changeNumColumns(4)}
                />
                <Button
                    style={styles.button}
                    color="#1FB963"
                    title="5X5"
                    onPress={() => changeNumColumns(5)}
                />
            </View>
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
    boxText: {
        fontSize: 30,
        fontWeight: '400',
    },
    gesture: {
        flex: 1,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
