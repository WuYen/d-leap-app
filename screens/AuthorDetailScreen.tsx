import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';

export default function AuthorDetailScreen() {
    return (
        <View style={styles.container}>
            <Text>Author detail screen</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
    },
})