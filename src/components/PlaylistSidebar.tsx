import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { formatTimecode, type VideoItem } from '../data/playlist';
import { MIDNIGHT_CINEMA } from '../theme/midnightCinema';
import { GlassPanel } from './GlassPanel';
import { Icon } from './Icon';

export type QueueFilter = 'All' | '4K HDR' | 'Favorites' | 'Local';

const FILTERS: QueueFilter[] = ['All', '4K HDR', 'Favorites', 'Local'];

interface PlaylistSidebarProps {
  items: VideoItem[];
  activeId: string;
  isPlaying: boolean;
  favoriteIds: string[];
  activeFilter: QueueFilter;
  onSelectFilter: (filter: QueueFilter) => void;
  onSelectVideo: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onPickLocalVideo: () => void;
  isTheater: boolean;
}

export function PlaylistSidebar({
  items,
  activeId,
  isPlaying,
  favoriteIds,
  activeFilter,
  onSelectFilter,
  onSelectVideo,
  onToggleFavorite,
  onPickLocalVideo,
  isTheater,
}: PlaylistSidebarProps) {
  return (
    <GlassPanel variant="smoked" blurPx={24} style={styles.panel}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.heading}>Up Next Queue</Text>
          <Text style={styles.subheading}>
            {items.length} {items.length === 1 ? 'stream' : 'streams'} ready
          </Text>
        </View>
        <Pressable onPress={onPickLocalVideo} style={styles.addLocalBtn}>
          <Icon name="upload" size={14} color={MIDNIGHT_CINEMA.amber} />
          <Text style={styles.addLocalText}>Add File</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map(filter => {
          const selected = filter === activeFilter;
          return (
            <Pressable
              key={filter}
              onPress={() => onSelectFilter(filter)}
              style={[styles.filterPill, selected && styles.filterPillActive]}
            >
              <Text
                style={[
                  styles.filterText,
                  selected && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={[styles.listContainer, isTheater && styles.listGrid]}>
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="film" size={26} color={MIDNIGHT_CINEMA.textMuted} />
            <Text style={styles.emptyTitle}>No matching videos</Text>
            <Text style={styles.emptySubtitle}>
              Try another filter or drop a local .mp4 / .webm file onto the stage.
            </Text>
          </View>
        ) : (
          items.map((item, idx) => {
            const isActive = item.id === activeId;
            const isFav = favoriteIds.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => onSelectVideo(item.id)}
                style={[
                  styles.card,
                  isTheater && styles.cardTheater,
                  isActive && styles.cardActive,
                ]}
              >
                <View style={styles.thumbWrap}>
                  {item.posterUrl ? (
                    <Image
                      source={{ uri: item.posterUrl }}
                      resizeMode="cover"
                      style={styles.thumbImg}
                    />
                  ) : (
                    <View style={styles.thumbPlaceholder}>
                      <Icon
                        name="film"
                        size={20}
                        color={MIDNIGHT_CINEMA.crimson}
                      />
                    </View>
                  )}
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>
                      {formatTimecode(item.durationSeconds)}
                    </Text>
                  </View>
                  {isActive && (
                    <View style={styles.nowPlayingOverlay}>
                      <Icon
                        name={isPlaying ? 'pause' : 'play'}
                        size={14}
                        color="#FFFFFF"
                      />
                    </View>
                  )}
                </View>

                <View style={styles.metaCol}>
                  <View style={styles.titleLine}>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.itemTitle,
                        isActive && styles.itemTitleActive,
                      ]}
                    >
                      {idx + 1}. {item.title}
                    </Text>
                  </View>
                  <Text numberOfLines={1} style={styles.itemCreator}>
                    {item.creator}
                  </Text>
                  <View style={styles.chipRow}>
                    <View style={styles.specChip}>
                      <Text style={styles.specChipText}>
                        {item.resolution} • {item.fps}fps
                      </Text>
                    </View>
                    {isActive && (
                      <View style={styles.activeChip}>
                        <Text style={styles.activeChipText}>
                          {isPlaying ? 'PLAYING' : 'PAUSED'}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <Pressable
                  accessibilityLabel="Toggle favorite"
                  onPress={e => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  style={styles.favBtn}
                >
                  <Icon
                    name={isFav ? 'heart-filled' : 'heart'}
                    size={16}
                    color={
                      isFav ? MIDNIGHT_CINEMA.crimson : MIDNIGHT_CINEMA.textMuted
                    }
                  />
                </Pressable>
              </Pressable>
            );
          })
        )}
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: 18,
    gap: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  heading: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  subheading: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  addLocalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: MIDNIGHT_CINEMA.amberSoft,
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderAmber,
  },
  addLocalText: {
    color: MIDNIGHT_CINEMA.amber,
    fontSize: 12,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: MIDNIGHT_CINEMA.borderGlass,
  },
  filterPillActive: {
    backgroundColor: MIDNIGHT_CINEMA.crimsonSoft,
    borderColor: MIDNIGHT_CINEMA.borderCrimson,
  },
  filterText: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTextActive: {
    color: MIDNIGHT_CINEMA.textPrimary,
  },
  listContainer: {
    gap: 10,
  },
  listGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.035)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
  },
  cardTheater: {
    minWidth: 290,
    flex: 1,
  },
  cardActive: {
    backgroundColor: MIDNIGHT_CINEMA.glassActive,
    borderColor: MIDNIGHT_CINEMA.borderCrimson,
  },
  thumbWrap: {
    width: 108,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#13131A',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 46, 84, 0.12)',
  },
  durationBadge: {
    position: 'absolute',
    right: 5,
    bottom: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(10, 10, 12, 0.84)',
  },
  durationText: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 10,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  nowPlayingOverlay: {
    position: 'absolute',
    left: 6,
    top: 6,
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: MIDNIGHT_CINEMA.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaCol: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  itemTitleActive: {
    color: '#FFFFFF',
  },
  itemCreator: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 11,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  specChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  specChipText: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  activeChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 46, 84, 0.25)',
  },
  activeChipText: {
    color: '#FF859D',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  favBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  emptyState: {
    paddingVertical: 28,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    color: MIDNIGHT_CINEMA.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: MIDNIGHT_CINEMA.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
