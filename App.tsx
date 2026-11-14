import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AmbientBackdrop } from './src/components/AmbientBackdrop';
import { GlassPanel } from './src/components/GlassPanel';
import { Icon } from './src/components/Icon';
import {
  LocalFilePicker,
  type LocalFilePickerHandle,
} from './src/components/LocalFilePicker';
import {
  PlaylistSidebar,
  type QueueFilter,
} from './src/components/PlaylistSidebar';
import { ShortcutsModal } from './src/components/ShortcutsModal';
import { VideoStage } from './src/components/VideoStage';
import {
  formatTimecode,
  INITIAL_PLAYLIST,
  type VideoItem,
} from './src/data/playlist';
import { usePlayerShortcuts } from './src/hooks/usePlayerShortcuts';
import {
  MIDNIGHT_CINEMA,
  PLAYBACK_SPEEDS,
  QUALITY_TIERS,
} from './src/theme/midnightCinema';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="light-content"
        backgroundColor={MIDNIGHT_CINEMA.bgVoid}
      />
      <NitroPlayerStudio />
    </SafeAreaProvider>
  );
}

function NitroPlayerStudio() {
  const safeAreaInsets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const filePickerRef = useRef<LocalFilePickerHandle | null>(null);

  const [playlist, setPlaylist] = useState<VideoItem[]>(INITIAL_PLAYLIST);
  const [activeId, setActiveId] = useState<string>(INITIAL_PLAYLIST[0].id);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['nitro-blazes']);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(
    INITIAL_PLAYLIST[0].durationSeconds,
  );
  const [bufferedPercent, setBufferedPercent] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speedIndex, setSpeedIndex] = useState<number>(2); // 1x
  const [qualityIndex, setQualityIndex] = useState<number>(0); // Auto (4K)
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isTheater, setIsTheater] = useState<boolean>(false);
  const [ambientEnabled, setAmbientEnabled] = useState<boolean>(true);
  const [shortcutsVisible, setShortcutsVisible] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<QueueFilter>('All');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const activeVideo = useMemo(
    () => playlist.find(item => item.id === activeId) ?? playlist[0],
    [playlist, activeId],
  );

  const filteredQueue = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return playlist.filter(item => {
      if (activeFilter === 'Favorites' && !favoriteIds.includes(item.id)) {
        return false;
      }
      if (activeFilter === '4K HDR' && item.category !== '4K HDR') {
        return false;
      }
      if (activeFilter === 'Local' && !item.isLocal) {
        return false;
      }
      if (!query) {
        return true;
      }
      return (
        item.title.toLowerCase().includes(query) ||
        item.creator.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query)
      );
    });
  }, [playlist, activeFilter, favoriteIds, searchQuery]);

  const showNotice = useCallback((message: string) => {
    setStatusNotice(message);
    setTimeout(() => {
      setStatusNotice(prev => (prev === message ? null : prev));
    }, 3200);
  }, []);

  const selectVideoById = useCallback(
    (id: string, autoPlay = true) => {
      const found = playlist.find(item => item.id === id);
      if (!found) {
        return;
      }
      setActiveId(found.id);
      setCurrentTime(0);
      setDuration(found.durationSeconds);
      setBufferedPercent(0);
      setIsPlaying(autoPlay);
    },
    [playlist],
  );

  const stepQueue = useCallback(
    (direction: 1 | -1) => {
      const idx = playlist.findIndex(item => item.id === activeVideo.id);
      const nextIdx = (idx + direction + playlist.length) % playlist.length;
      selectVideoById(playlist[nextIdx].id, true);
    },
    [playlist, activeVideo.id, selectVideoById],
  );

  const handleTogglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleSeek = useCallback((seconds: number) => {
    setCurrentTime(Math.max(0, seconds));
  }, []);

  const handleSkipBy = useCallback(
    (delta: number) => {
      setCurrentTime(prev => {
        const cap = duration > 0 ? duration : activeVideo.durationSeconds;
        return Math.min(cap, Math.max(0, prev + delta));
      });
    },
    [duration, activeVideo.durationSeconds],
  );

  const handleAdjustVolume = useCallback((delta: number) => {
    setIsMuted(false);
    setVolume(prev => Math.min(1, Math.max(0, Number((prev + delta).toFixed(2)))));
  }, []);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handleToggleTheater = useCallback(() => {
    setIsTheater(prev => !prev);
  }, []);

  const handleCycleSpeed = useCallback(() => {
    setSpeedIndex(prev => (prev + 1) % PLAYBACK_SPEEDS.length);
  }, []);

  const handleCycleQuality = useCallback(() => {
    setQualityIndex(prev => (prev + 1) % QUALITY_TIERS.length);
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setFavoriteIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
    );
  }, []);

  const handleLocalFiles = useCallback(
    (files: FileList) => {
      const incoming: VideoItem[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('video/') && !/\.(mp4|webm|mov|m4v|mkv)$/i.test(file.name)) {
          continue;
        }
        const objectUrl = URL.createObjectURL(file);
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
        incoming.push({
          id: `local-${Date.now()}-${i}`,
          title: cleanTitle,
          subtitle: `Local playback (${(file.size / (1024 * 1024)).toFixed(1)} MB) via Nitro Web Engine.`,
          creator: 'Local Drive',
          category: 'Local',
          durationSeconds: 0,
          resolution: 'Local HD',
          fps: 60,
          codec: file.type ? file.type.replace('video/', '').toUpperCase() : 'MP4',
          videoUrl: objectUrl,
          posterUrl: '',
          accentColor: '#FF2E54',
          secondaryGlow: '#F59E0B',
          chapters: [{ label: 'Start', timeSeconds: 0 }],
          isLocal: true,
        });
      }

      if (incoming.length === 0) {
        showNotice('Select a valid video file (.mp4, .webm, .mov).');
        return;
      }

      setPlaylist(prev => [...incoming, ...prev]);
      setActiveId(incoming[0].id);
      setCurrentTime(0);
      setDuration(0);
      setBufferedPercent(100);
      setIsPlaying(true);
      showNotice(`Loaded ${incoming.length} local video${incoming.length > 1 ? 's' : ''} into Nitro Engine.`);
    },
    [showNotice],
  );

  usePlayerShortcuts({
    onTogglePlay: handleTogglePlay,
    onSkipBy: handleSkipBy,
    onAdjustVolume: handleAdjustVolume,
    onToggleMute: handleToggleMute,
    onToggleTheater: handleToggleTheater,
    onNext: () => stepQueue(1),
    onPrev: () => stepQueue(-1),
  });

  const isWideStudio = width >= 1080 && !isTheater;
  const isCompactHeader = width < 720;
  const isFavorite = favoriteIds.includes(activeVideo.id);
  const playbackRate = PLAYBACK_SPEEDS[speedIndex];
  const qualityLabel = QUALITY_TIERS[qualityIndex];

  return (
    <View style={styles.root}>
      <AmbientBackdrop
        accentColor={activeVideo.accentColor}
        secondaryGlow={activeVideo.secondaryGlow}
        enabled={ambientEnabled}
      />

      <LocalFilePicker
        ref={filePickerRef}
        onFilesSelected={handleLocalFiles}
        onNativeUnsupported={() =>
          showNotice('Local file picker runs on Web. Native picker ready to link.')
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.pageContent,
          {
            paddingTop: Math.max(18, safeAreaInsets.top + 12),
            paddingBottom: Math.max(36, safeAreaInsets.bottom + 24),
          },
        ]}
      >
        {/* Floating Smoked-Glass Navigation Bar */}
        <GlassPanel variant="smoked" blurPx={24} style={styles.topNav}>
          <View style={styles.topNavInner}>
            <View style={styles.brandCluster}>
              <View style={styles.brandMark}>
                <Icon name="flame" size={18} color="#FFFFFF" />
              </View>
              <View>
                <View style={styles.brandTitleRow}>
                  <Text style={styles.brandName}>NITRO PLAYER</Text>
                  <View style={styles.versionPill}>
                    <Text style={styles.versionText}>RN 0.88</Text>
                  </View>
                </View>
                <Text style={styles.brandTag}>Midnight Cinema Glass Studio</Text>
              </View>
            </View>

            {!isCompactHeader && (
              <View style={styles.searchPill}>
                <Icon name="search" size={15} color={MIDNIGHT_CINEMA.textSecondary} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search streams, codecs, creators..."
                  placeholderTextColor={MIDNIGHT_CINEMA.textMuted}
                  style={styles.searchInput}
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery('')}>
                    <Icon name="close" size={14} color={MIDNIGHT_CINEMA.textMuted} />
                  </Pressable>
                )}
              </View>
            )}

            <View style={styles.navActions}>
              <Pressable
                onPress={() => setAmbientEnabled(prev => !prev)}
                style={[
                  styles.navBtn,
                  ambientEnabled && styles.navBtnAmberActive,
                ]}
              >
                <Icon
                  name="sparkles"
                  size={15}
                  color={
                    ambientEnabled
                      ? MIDNIGHT_CINEMA.amber
                      : MIDNIGHT_CINEMA.textSecondary
                  }
                />
                {!isCompactHeader && (
                  <Text
                    style={[
                      styles.navBtnText,
                      ambientEnabled && styles.navBtnAmberText,
                    ]}
                  >
                    Ambient
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => filePickerRef.current?.open()}
                style={styles.openFileBtn}
              >
                <Icon name="upload" size={15} color="#FFFFFF" />
                <Text style={styles.openFileText}>Open Video</Text>
              </Pressable>

              <Pressable
                accessibilityLabel="Keyboard shortcuts"
                onPress={() => setShortcutsVisible(true)}
                style={styles.iconSquareBtn}
              >
                <Icon name="keyboard" size={16} />
              </Pressable>
            </View>
          </View>

          {isCompactHeader && (
            <View style={styles.mobileSearchWrap}>
              <Icon name="search" size={15} color={MIDNIGHT_CINEMA.textSecondary} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search queue..."
                placeholderTextColor={MIDNIGHT_CINEMA.textMuted}
                style={styles.searchInput}
              />
            </View>
          )}
        </GlassPanel>

        {statusNotice && (
          <GlassPanel variant="accent" blurPx={20} style={styles.toastBanner}>
            <Icon name="check" size={15} color={MIDNIGHT_CINEMA.amber} />
            <Text style={styles.toastText}>{statusNotice}</Text>
          </GlassPanel>
        )}

        {/* Main Studio Grid */}
        <View style={[styles.studioGrid, isWideStudio && styles.studioGridWide]}>
          <View style={[styles.primaryCol, isWideStudio && styles.primaryColWide]}>
            <VideoStage
              video={activeVideo}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              bufferedPercent={bufferedPercent}
              volume={volume}
              isMuted={isMuted}
              playbackRate={playbackRate}
              quality={qualityLabel}
              isLooping={isLooping}
              isTheater={isTheater}
              ambientEnabled={ambientEnabled}
              onTogglePlay={handleTogglePlay}
              onSeek={handleSeek}
              onSkipBy={handleSkipBy}
              onPrev={() => stepQueue(-1)}
              onNext={() => stepQueue(1)}
              onVolumeChange={nextVol => {
                setIsMuted(nextVol === 0);
                setVolume(nextVol);
              }}
              onToggleMute={handleToggleMute}
              onCyclePlaybackRate={handleCycleSpeed}
              onCycleQuality={handleCycleQuality}
              onToggleLoop={() => setIsLooping(prev => !prev)}
              onToggleTheater={handleToggleTheater}
              onTimeUpdate={setCurrentTime}
              onDurationChange={setDuration}
              onBufferedChange={setBufferedPercent}
              onEnded={() => {
                if (isLooping) {
                  setCurrentTime(0);
                  setIsPlaying(true);
                } else {
                  stepQueue(1);
                }
              }}
              onPlayStateSync={setIsPlaying}
              onDropFiles={handleLocalFiles}
            />

            {/* Smoked Glass Details & Chapter Strip */}
            <GlassPanel variant="smoked" blurPx={24} style={styles.detailsCard}>
              <View style={styles.detailsHeader}>
                <View style={styles.detailsTitleCol}>
                  <View style={styles.badgesRow}>
                    <View style={styles.crimsonBadge}>
                      <Text style={styles.crimsonBadgeText}>
                        {activeVideo.category}
                      </Text>
                    </View>
                    <View style={styles.glassSpecBadge}>
                      <Text style={styles.glassSpecText}>
                        {activeVideo.codec} • {activeVideo.resolution} •{' '}
                        {activeVideo.fps} FPS
                      </Text>
                    </View>
                    <View style={styles.glassSpecBadge}>
                      <Text style={styles.amberMetaText}>
                        {Platform.OS === 'web' ? 'WEB HARDWARE' : 'NATIVE'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.videoTitle}>{activeVideo.title}</Text>
                  <Text style={styles.videoSubtitle}>
                    {activeVideo.creator} — {activeVideo.subtitle}
                  </Text>
                </View>

                <View style={styles.detailsActions}>
                  <Pressable
                    onPress={() => handleToggleFavorite(activeVideo.id)}
                    style={[
                      styles.actionChip,
                      isFavorite && styles.actionChipActive,
                    ]}
                  >
                    <Icon
                      name={isFavorite ? 'heart-filled' : 'heart'}
                      size={16}
                      color={
                        isFavorite
                          ? MIDNIGHT_CINEMA.crimson
                          : MIDNIGHT_CINEMA.textPrimary
                      }
                    />
                    <Text style={styles.actionChipText}>
                      {isFavorite ? 'Saved' : 'Save'}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleToggleTheater}
                    style={[
                      styles.actionChip,
                      isTheater && styles.actionChipAmber,
                    ]}
                  >
                    <Icon
                      name="theater"
                      size={16}
                      color={
                        isTheater
                          ? MIDNIGHT_CINEMA.amber
                          : MIDNIGHT_CINEMA.textPrimary
                      }
                    />
                    <Text style={styles.actionChipText}>
                      {isTheater ? 'Standard' : 'Theater'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Clickable Chapters */}
              <View style={styles.chaptersWrap}>
                <Text style={styles.chaptersLabel}>CHAPTER MARKERS</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chaptersRow}
                >
                  {activeVideo.chapters.map((chapter, index) => {
                    const nextChapter = activeVideo.chapters[index + 1];
                    const isCurrentChapter =
                      currentTime >= chapter.timeSeconds &&
                      (!nextChapter || currentTime < nextChapter.timeSeconds);
                    return (
                      <Pressable
                        key={chapter.label}
                        onPress={() => {
                          setCurrentTime(chapter.timeSeconds);
                          setIsPlaying(true);
                        }}
                        style={[
                          styles.chapterPill,
                          isCurrentChapter && styles.chapterPillActive,
                        ]}
                      >
                        <Text style={styles.chapterTime}>
                          {formatTimecode(chapter.timeSeconds)}
                        </Text>
                        <Text
                          style={[
                            styles.chapterTitle,
                            isCurrentChapter && styles.chapterTitleActive,
                          ]}
                        >
                          {chapter.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </GlassPanel>
          </View>

          <View style={[styles.sideCol, isWideStudio && styles.sideColWide]}>
            <PlaylistSidebar
              items={filteredQueue}
              activeId={activeVideo.id}
              isPlaying={isPlaying}
              favoriteIds={favoriteIds}
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
              onSelectVideo={id => selectVideoById(id, true)}
              onToggleFavorite={handleToggleFavorite}
              onPickLocalVideo={() => filePickerRef.current?.open()}
              isTheater={!isWideStudio}
            />
          </View>
        </View>
      </ScrollView>

      <ShortcutsModal
        visible={shortcutsVisible}
        onClose={() => setShortcutsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: MIDNIGHT_CINEMA.bgVoid,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  pageContent: {
    width: '100%',
    maxWidth: 1460,
    alignSelf: 'center',
    paddingHorizontal: 20,
    gap: 18,
  },
  topNav: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    gap: 10,
  },
  topNavInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  brandCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: MIDNIGHT_CINEMA.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.1,
  },
  versionPill: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: MIDNIGHT_CINEMA.amberSoft,
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderAmber,
  },
  versionText: {
    color: MIDNIGHT_CINEMA.amber,
    fontSize: 10,
    fontWeight: '700',
  },
  brandTag: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  searchPill: {
    flex: 1,
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderGlass,
  },
  mobileSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderGlass,
  },
  searchInput: {
    flex: 1,
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 13,
    paddingVertical: 0,
  },
  navActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderGlass,
  },
  navBtnAmberActive: {
    backgroundColor: MIDNIGHT_CINEMA.amberSoft,
    borderColor: MIDNIGHT_CINEMA.borderAmber,
  },
  navBtnText: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  navBtnAmberText: {
    color: MIDNIGHT_CINEMA.amber,
  },
  openFileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: MIDNIGHT_CINEMA.crimson,
  },
  openFileText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  iconSquareBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderGlass,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  toastText: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  studioGrid: {
    flexDirection: 'column',
    gap: 18,
  },
  studioGridWide: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  primaryCol: {
    gap: 16,
  },
  primaryColWide: {
    flex: 1,
    minWidth: 0,
  },
  sideCol: {
    width: '100%',
  },
  sideColWide: {
    width: 380,
    flexShrink: 0,
  },
  detailsCard: {
    padding: 20,
    gap: 16,
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 14,
  },
  detailsTitleCol: {
    flex: 1,
    minWidth: 260,
    gap: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },
  crimsonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: MIDNIGHT_CINEMA.crimsonSoft,
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderCrimson,
  },
  crimsonBadgeText: {
    color: '#FF7C95',
    fontSize: 11,
    fontWeight: '700',
  },
  glassSpecBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderGlass,
  },
  glassSpecText: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  amberMetaText: {
    color: MIDNIGHT_CINEMA.amber,
    fontSize: 11,
    fontWeight: '700',
  },
  videoTitle: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 28,
  },
  videoSubtitle: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  detailsActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderGlass,
  },
  actionChipActive: {
    backgroundColor: MIDNIGHT_CINEMA.crimsonSoft,
    borderColor: MIDNIGHT_CINEMA.borderCrimson,
  },
  actionChipAmber: {
    backgroundColor: MIDNIGHT_CINEMA.amberSoft,
    borderColor: MIDNIGHT_CINEMA.borderAmber,
  },
  actionChipText: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  chaptersWrap: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: MIDNIGHT_CINEMA.borderDivider,
  },
  chaptersLabel: {
    color: MIDNIGHT_CINEMA.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  chaptersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chapterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderGlass,
  },
  chapterPillActive: {
    backgroundColor: MIDNIGHT_CINEMA.crimsonSoft,
    borderColor: MIDNIGHT_CINEMA.borderCrimson,
  },
  chapterTime: {
    color: MIDNIGHT_CINEMA.amber,
    fontSize: 11,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  chapterTitle: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chapterTitleActive: {
    color: MIDNIGHT_CINEMA.textPrimary,
  },
});

export default App;
