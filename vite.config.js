import { cwd } from "node:process"
import {
  resolve as resolve_path,
  basename as basename_path,
  sep as path_sep,
} from "node:path"
import { glob } from "glob"
import { defineConfig as define_config } from "vite"
import un_icons from "unplugin-icons/vite"

const dir = {
  input: "src",
  static: "../static",  // relative to `dir.input`
  output: "../dist",  // relative to `dir.input`
  assets: "assets",  // relative to `dir.output`
}

const input = (await glob(`${dir.input}/**/*.html`)).reduce(
  (acc, file_path) => {
    const absolute_path = resolve_path(cwd(), file_path)
    const file_name = basename_path(file_path)

    if (file_name === "index.html") {
      acc["main"] = absolute_path
      return acc
    }

    const name = file_path
      .split(`${dir.input}${path_sep}`)[1]
      .replace(path_sep, "/")
      .split(".")
      .slice(0, -1)
      .join(".")

    acc[name] = absolute_path
    return acc
  },
  {}
)

export default define_config({
  root: resolve_path(process.cwd(), dir.input),
  publicDir: dir.static,
  base: "/web-layout-timeline",
  build: {
    outDir: dir.output,
    emptyOutDir: true,
    assetsDir: "assets",
    rollupOptions: {
      input,
    },
  },
  server: {
    host: "127.0.0.1",
    port: process.env.PORT ? Number(process.env.PORT) : 8080,
    strictPort: true,
  },
  plugins: [
    un_icons({
      compiler: "web-components",
      webComponents: {
        autoDefine: true,
      },
    }),
  ],
})
