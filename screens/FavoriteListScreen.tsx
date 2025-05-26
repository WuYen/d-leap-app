import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';

export default function FavoriteListScreen() {
    return (
        <View style={styles.container}>
            <Text>Favorite List screen</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
})
