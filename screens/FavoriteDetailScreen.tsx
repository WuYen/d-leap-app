import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';

export default function FavoriteDetailScreen() {
    return (
        <View style={styles.container}>
            <Text>Favorite detail screen</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
})