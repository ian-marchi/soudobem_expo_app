import React, { useState, useCallback } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  ViewStyle,
} from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';
import { Brand } from '../constants/Colors';
import { Shadows } from '../constants/Shadows';

interface YoutubePlayerProps {
  videoId: string;
  width: number;
  height?: number;
  style?: ViewStyle;
}

export function YoutubePlayer({ videoId, width, height, style }: YoutubePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [errored, setErrored] = useState(false);
  const h = height ?? Math.round((width * 9) / 16);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const onChangeState = useCallback((state: string) => {
    if (state === 'ended') setPlaying(false);
  }, []);

  return (
    <View style={[styles.container, { width, height: h }, style]}>
      {playing ? (
        <>
          <YoutubeIframe
            height={h}
            width={width}
            videoId={videoId}
            play
            onReady={() => setReady(true)}
            onError={() => setErrored(true)}
            onChangeState={onChangeState}
            webViewProps={{ allowsInlineMediaPlayback: true }}
            initialPlayerParams={{ modestbranding: true, rel: false }}
          />
          {!ready && !errored && (
            <View style={styles.overlayFill}>
              <ActivityIndicator size="large" color={Brand.orange} />
            </View>
          )}
          {errored && (
            <View style={styles.overlayFill}>
              <Ionicons name="alert-circle-outline" size={32} color="#FFFFFF" />
              <Text style={styles.errorText}>Não foi possível carregar o vídeo.</Text>
            </View>
          )}
        </>
      ) : (
        <TouchableOpacity
          style={styles.thumbWrapper}
          activeOpacity={0.9}
          onPress={() => setPlaying(true)}
        >
          <Image source={{ uri: thumbnail }} style={styles.thumb} resizeMode="cover" />
          <View style={styles.overlay}>
            <View style={styles.playCircle}>
              <Ionicons name="play" size={30} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
    ...Shadows.card,
  } as ViewStyle,
  overlayFill: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  errorText: { color: '#FFFFFF', fontFamily: 'Nunito_600SemiBold', fontSize: 13 },
  thumbWrapper: { flex: 1 },
  thumb: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Brand.orange,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.cardLarge,
  },
});
