import { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';

let VoiceModule: typeof import('@react-native-voice/voice').default | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  VoiceModule = require('@react-native-voice/voice').default;
} catch (error) {
  console.warn('Voice input not available in this build. Falling back to manual text input.');
}

export const useVoiceInput = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!VoiceModule) {
      return undefined;
    }

    const onSpeechResults = (event: { value?: string[] }) => {
      const text = event.value?.[0];
      if (text) {
        setTranscript(text);
      }
    };

    const onSpeechError = (event: { error?: { message?: string } }) => {
      setErrorMessage(event.error?.message ?? 'Unable to process voice input');
      setIsListening(false);
    };

    VoiceModule.onSpeechResults = onSpeechResults;
    VoiceModule.onSpeechError = onSpeechError;

    return () => {
      VoiceModule?.destroy().then(VoiceModule.removeAllListeners);
    };
  }, []);

  const startListening = useCallback(async () => {
    if (!VoiceModule) {
      setErrorMessage('Voice input is not supported on this platform.');
      return;
    }

    try {
      setErrorMessage(null);
      setTranscript('');
      await VoiceModule.start('en-US');
      setIsListening(true);
    } catch (error) {
      setErrorMessage('Failed to access microphone.');
    }
  }, []);

  const stopListening = useCallback(async () => {
    if (!VoiceModule) {
      return;
    }

    try {
      await VoiceModule.stop();
    } finally {
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => setTranscript(''), []);

  const isSupported = useMemo(() => Platform.OS !== 'web' && !!VoiceModule, []);

  return {
    transcript,
    isListening,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    resetTranscript,
  };
};
