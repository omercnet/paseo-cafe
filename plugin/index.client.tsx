import type { PluginClientContext } from "@getpaseo/plugin/client"
import { DirectorySettings } from "./client/DirectorySettings"
import { DirectorySurface } from "./client/DirectorySurface"

export default function contribute(client: PluginClientContext) {
  client.addSettingsScreen({
    id: "settings",
    title: "Plugin Directory",
    icon: "Settings",
    Component: DirectorySettings,
  })
  client.addSurface("directory", DirectorySurface)
  client.addSidebarItem({
    id: "directory",
    title: "Plugin Directory",
    icon: "Store",
    surface: "directory",
  })
  client.addCommandCenterItem({
    id: "open-directory",
    title: "Browse Plugin Directory",
    icon: "Store",
    context: "global",
    onSelect({ openSurface }) {
      openSurface("directory")
    },
  })
  return () => {}
}
