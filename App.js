import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View, FlatList, Text} from 'react-native';

const App = () => {
    const numColumns = 4;
    const [boxData, setBoxData] = useState([]);

    useEffect(() => {
        const items = [...Array(numColumns * numColumns)].map((v, i) => i + 1);
        setBoxData(items);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={boxData}
                renderItem={({item}) => (
                    <View style={styles.box}>
                        <Text>{item}</Text>
                    </View>
                )}
                numColumns={numColumns}
                keyExtractor={(item, index) => index}
            />
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
});
