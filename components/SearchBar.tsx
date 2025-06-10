import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type SearchBarProps = {
  onDebouncedTextChange?: (text: string) => void;
  onSearch?: (text: string) => void;
  loading?: boolean;
  placeholder: string;
};

export default function SearchBar({ onDebouncedTextChange, onSearch, loading, placeholder }: SearchBarProps) {
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
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          placeholder={placeholder}
          value={text}
          onChangeText={handleChangeText}
          style={styles.input}
          returnKeyType='search'
          onSubmitEditing={handleSearchPress}
        />
        {!!text && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => setText('')} activeOpacity={0.7}>
            <Ionicons name='close-circle' size={20} color='#bbb' />
          </TouchableOpacity>
        )}
      </View>
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
  clearBtn: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    padding: 2,
  },
});
