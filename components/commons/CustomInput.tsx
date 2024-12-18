import { View, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Control, Controller } from 'react-hook-form';
import { Match } from '@/database/types';
import { useTheme } from '@/context/ThemeProvider';

type MatchFormData = Omit<Match, 'id'>;

interface Props {
    name: string;
    color: string;
    control: Control<MatchFormData>;
    fieldName: keyof MatchFormData;
}

const CustomInput = ({ name, color, control, fieldName }: Props) => {

    const { theme } = useTheme();

    return (
        <Controller
            control={control}
            name={fieldName}
            render={({ field: { value, onChange } }) => {
                // Assicuriamoci che value sia sempre un numero
                const numericValue = Number(value) || 0;
                
                const handleSubtract = () => {
                    if (numericValue > 0) {
                        onChange(numericValue - 1);
                    }
                };

                const handleAdd = () => {
                    onChange(numericValue + 1);
                };

                return (
                    <View style={[styles.mainContainer, {backgroundColor: theme.cardBackground}]}>
                        <View style={styles.labelContainer}>
                            <Text style={[styles.label, {color: '#ccc'}]}>{name}</Text>
                            <Ionicons name='ellipse' color={color} size={18} />
                        </View>
                        <View style={styles.inputContainer}>
                            <TouchableOpacity 
                                style={[styles.button]} 
                                onPress={handleSubtract}
                            >
                                <Text style={[styles.buttonLabel, {color: '#ccc'}]}>-</Text>
                            </TouchableOpacity>
                            <Text style={[styles.inputText, {color: '#ccc'}]}>{numericValue}</Text>
                            <TouchableOpacity 
                                style={[styles.button]} 
                                onPress={handleAdd}
                            >
                                <Text style={[styles.buttonLabel, {color: '#ccc'}]}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        borderRadius: 10,
        paddingHorizontal: 15, 
        paddingVertical: 5,
        marginVertical: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        flex: 1, 
        margin: 5
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 4,
    },
    inputContainer: {
        padding: 5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
    },
    inputText: {
        fontSize: 18,
        fontFamily: 'RobotoMono-Bold', 
        textAlign: 'center',
    },
    button: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    buttonLabel: {
        fontSize: 21,
        fontFamily: 'RobotoMono-Bold'
    } 
});

export default CustomInput;