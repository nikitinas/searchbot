import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Asset } from 'react-native-image-picker';
import { palette } from '@/theme/colors';

interface Props {
  asset: Asset | null;
  onRemove: () => void;
}

export const ImageAttachmentPreview = ({ asset, onRemove }: Props) => {
  if (!asset) {
    return null;
  }

  return (
    <View style={styles.container}>
      {asset.uri ? <Image source={{ uri: asset.uri }} style={styles.image} /> : null}
      <View style={styles.meta}>
        <Text style={styles.title}>Reference image attached</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {asset.fileName ?? 'photo.jpg'}
        </Text>
      </View>
      <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F1F24',
    borderRadius: 16,
    padding: 12,
    marginTop: 12,
    gap: 12,
  },
  image: {
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  meta: {
    flex: 1,
  },
  title: {
    color: palette.text,
    fontWeight: '600',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
  },
  removeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.divider,
  },
  removeText: {
    color: palette.muted,
    fontSize: 12,
  },
});
