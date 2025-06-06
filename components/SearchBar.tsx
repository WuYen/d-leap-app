import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';

export type SearchBarProps = {
  onDebouncedTextChange?: (text: string) => void;
  onSearch?: (text: string) => void;
  loading?: boolean;
};

export default function SearchBar({ onDebouncedTextChange, onSearch, loading }: SearchBarProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onDebouncedTextChange?.(text);
    }, 300);
    return () => clearTimeout(handler);
  }, [text, onDebouncedTextChange]);

  const handleChangeText = (t: string) => {
    setText(t);
    if (t === '') {
      onDebouncedTextChange?.('');
    }
  };

  const handleSearchPress = () => {
    onSearch?.(text);
  };

  return (
    <View style={styles.row}>
      <TextInput
        placeholder='搜尋文章標題'
        value={text}
        onChangeText={handleChangeText}
        style={styles.input}
        returnKeyType='search'
        onSubmitEditing={handleSearchPress}
      />
      {/* <Button title='搜尋' onPress={handleSearchPress} disabled={loading} /> */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.5 }]}
        onPress={handleSearchPress}
        activeOpacity={0.7}
        disabled={loading}
      >
        <Text style={styles.buttonText}>搜尋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12, // match PostCard
    paddingHorizontal: 8,
    marginRight: 8,
    height: 40,
  },
  button: {
    borderRadius: 12,
    backgroundColor: '#2196f3', // 較淺且接近原生 Button 藍色
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
