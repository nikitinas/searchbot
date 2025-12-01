import { useCallback, useState } from 'react';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';

const pickerOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
  selectionLimit: 1,
};

export const useImagePicker = () => {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pickImage = useCallback(async () => {
    setErrorMessage(null);
    const response = await launchImageLibrary(pickerOptions);

    if (response.didCancel) {
      return;
    }

    if (response.errorMessage) {
      setErrorMessage(response.errorMessage);
      return;
    }

    const nextAsset = response.assets?.[0] ?? null;
    setAsset(nextAsset);
  }, []);

  const reset = useCallback(() => setAsset(null), []);

  return {
    asset,
    pickImage,
    reset,
    errorMessage,
  };
};
