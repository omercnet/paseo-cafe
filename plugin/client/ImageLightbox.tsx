import type { PluginTheme } from "@getpaseo/plugin"
import { Icon, Modal } from "@getpaseo/plugin/client/react-native"
import { useMemo } from "react"
import { Image, Pressable, Text, View } from "react-native"

interface ImageLightboxProps {
  images: string[]
  index: number | null
  title: string
  theme: PluginTheme
  onIndexChange(index: number): void
  onClose(): void
}

/**
 * Single large image + prev/next — not a pinch-to-zoom viewer (that needs a
 * gesture library this plugin doesn't depend on). The Modal's own frame size
 * is fixed by the host (no width/height prop exists on this API), so rather
 * than sizing the image to its own aspect ratio — which just leaves empty
 * space around it whenever the modal's fixed frame is a different shape —
 * the image is flex-filled and left to `resizeMode="contain"` to do the
 * letterboxing, using as much of whatever frame the host gives us.
 */
export function ImageLightbox({ images, index, title, theme, onIndexChange, onClose }: ImageLightboxProps) {
  const styles = useMemo(
    () => ({
      body: { flex: 1 },
      image: { flex: 1, width: "100%" as const },
      navRow: {
        flexDirection: "row" as const,
        alignItems: "center" as const,
        justifyContent: "space-between" as const,
        paddingTop: 12,
      },
      navButton: { padding: 8, borderRadius: 8, backgroundColor: theme.colors.surface2 },
      counter: { color: theme.colors.foregroundMuted, fontSize: 12 },
    }),
    [theme]
  )

  if (index === null) return null
  const image = images[index]
  if (!image) return null

  return (
    <Modal title={title} open onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <Modal.Content scrollable={false} style={styles.body} contentContainerStyle={styles.body}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
        {images.length > 1 ? (
          <View style={styles.navRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous screenshot"
              style={styles.navButton}
              disabled={index === 0}
              onPress={() => onIndexChange(index - 1)}
            >
              <Icon
                name="ChevronLeft"
                size={18}
                color={index === 0 ? theme.colors.foregroundMuted : theme.colors.foreground}
              />
            </Pressable>
            <Text style={styles.counter}>
              {index + 1} / {images.length}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next screenshot"
              style={styles.navButton}
              disabled={index === images.length - 1}
              onPress={() => onIndexChange(index + 1)}
            >
              <Icon
                name="ChevronRight"
                size={18}
                color={index === images.length - 1 ? theme.colors.foregroundMuted : theme.colors.foreground}
              />
            </Pressable>
          </View>
        ) : null}
      </Modal.Content>
    </Modal>
  )
}
