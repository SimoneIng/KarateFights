import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeProvider';

interface SearchBarProps extends Omit<TextInputProps, 'style'> {
  onSearch: (query: string) => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  containerStyle,
  inputStyle,
  placeholder = 'Cerca...',
  ...textInputProps
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { theme } = useTheme(); 

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <View style={[styles.searchContainer, containerStyle, {borderColor: theme.textPrimary, backgroundColor: 'trasparent'}]}>
      <Ionicons name="search" size={20} color={theme.textPrimary} />
      <TextInput
        style={[styles.input, inputStyle, {color: theme.textPrimary}]}
        placeholder={placeholder}
        placeholderTextColor={theme.textPrimary}
        value={searchQuery}
        onChangeText={handleSearch}
        clearButtonMode="while-editing"
        {...textInputProps}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <Ionicons name="close-circle" size={20} color={theme.textPrimary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 0.5
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
});

export default SearchBar;