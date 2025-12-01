import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppStackParamList, PriorityLevel } from '@/types';
import { CategoryChips } from '@/components/CategoryChips';
import { PrioritySelector } from '@/components/PrioritySelector';
import { ImageAttachmentPreview } from '@/components/ImageAttachmentPreview';
import { useVoiceInput } from '@/hooks/useVoiceInput';
import { useImagePicker } from '@/hooks/useImagePicker';
import { useAppDispatch } from '@/store/hooks';
import { executeSearch } from '@/store/searchSlice';
import { palette } from '@/theme/colors';

export type SearchInputProps = NativeStackScreenProps<AppStackParamList, 'SearchInput'>;

export const SearchInputScreen = ({ navigation }: SearchInputProps) => {
  const dispatch = useAppDispatch();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('DIY & Home Repair');
  const [priority, setPriority] = useState<PriorityLevel>('normal');

  const { transcript, isListening, isSupported, startListening, stopListening, errorMessage: voiceError } =
    useVoiceInput();
  const { asset, pickImage, reset, errorMessage: imageError } = useImagePicker();

  useEffect(() => {
    if (transcript) {
      setDescription(transcript);
    }
  }, [transcript]);

  const isSubmitDisabled = useMemo(() => description.trim().length < 12, [description]);

  const handleSubmit = () => {
    if (isSubmitDisabled) {
      return;
    }
    dispatch(
      executeSearch({
        description: description.trim(),
        category,
        priority,
        imageUri: asset?.uri,
        voiceTranscript: transcript || undefined,
      }),
    );
    navigation.navigate('Processing');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>What can SearchBot solve for you?</Text>
      <TextInput
        multiline
        mode="outlined"
        placeholder="Ex: Shower head leaking from connection"
        value={description}
        onChangeText={setDescription}
        style={styles.textArea}
      />
      <View style={styles.voiceRow}>
        <TouchableOpacity
          style={[
            styles.voiceButton,
            isListening && styles.voiceButtonActive,
            !isSupported && styles.voiceButtonDisabled,
          ]}
          onPress={isListening ? stopListening : startListening}
          disabled={!isSupported}
        >
          <MaterialCommunityIcons name="microphone" size={18} color="#fff" />
          <Text style={styles.voiceLabel}>{isListening ? 'Listening… tap to stop' : 'Voice-to-text'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.voiceButton} onPress={pickImage}>
          <MaterialCommunityIcons name="image" size={18} color="#fff" />
          <Text style={styles.voiceLabel}>Attach photo</Text>
        </TouchableOpacity>
      </View>
      {voiceError ? <Text style={styles.errorText}>{voiceError}</Text> : null}
      {imageError ? <Text style={styles.errorText}>{imageError}</Text> : null}
      <ImageAttachmentPreview asset={asset} onRemove={reset} />
      <CategoryChips value={category} onChange={setCategory} />
      <View style={styles.separator} />
      <PrioritySelector value={priority} onChange={setPriority} />
      <TouchableOpacity style={[styles.submit, isSubmitDisabled && styles.submitDisabled]} onPress={handleSubmit}>
        <Text style={styles.submitLabel}>Send to AI researcher</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  label: {
    color: palette.text,
    fontSize: 18,
    fontWeight: '600',
  },
  textArea: {
    backgroundColor: '#1C1C24',
    borderRadius: 18,
  },
  voiceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  voiceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2C2C37',
    padding: 12,
    borderRadius: 14,
    justifyContent: 'center',
  },
  voiceButtonDisabled: {
    opacity: 0.5,
  },
  voiceButtonActive: {
    backgroundColor: palette.primary,
  },
  voiceLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: palette.divider,
    marginVertical: 12,
  },
  submit: {
    backgroundColor: palette.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitLabel: {
    color: '#fff',
    fontWeight: '700',
  },
  errorText: {
    color: palette.danger,
    fontSize: 13,
  },
});
