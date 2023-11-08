import { debounce } from "lodash"

interface Position2D {
  x: number
  y: number
}

interface ScrollMovement {
  last_known_position: Position2D
  newest_position: Position2D
  last_direction: Position2D
}

interface CurrentViewport {
  width: number
  height: number

  list_container_top: number
  list_container_width: number
  list_container_height: number

  max_scroll: Position2D
  scroll_percent: Position2D
}

interface ScrollFeedbackStore {
  scroll: ScrollMovement
  view: CurrentViewport
}

const _STORE: ScrollFeedbackStore = {

  scroll: {
    last_known_position: { x: 0, y: 0 },
    newest_position: { x: 0, y: 0 },
    last_direction: { x: 0, y: 0 },
  },

  view: {
    width: 0,
    height: 0,

    list_container_top: 0,
    list_container_width: 0,
    list_container_height: 0,

    max_scroll: { x: 0, y: 0 },
    scroll_percent: { x: 0, y: 0 },
  }
}

function set_active_notif_item(store: ScrollFeedbackStore) {
  const notif_list = document.querySelector("main.notif-message-list") as HTMLElement
  if (!notif_list) {
    return
  }

  const notif_items = notif_list.children as HTMLCollectionOf<HTMLElement>
  const notif_items_count = notif_items.length
  if (!notif_items_count) {
    return
  }

  let set_active = false
  for (let item of notif_items) {
    item.classList.remove("active")

    if (store.scroll.newest_position.y <= item.offsetTop) {
      if (!set_active) {
        item.classList.add("active")
        set_active = true
      }
      continue
    }
  }
}

function handle_scroll_event(store: ScrollFeedbackStore, event: Event) {

  if (!event.target) {
    return
  }

  const new_position = { x: scrollX, y: scrollY }

  store.scroll.last_known_position = store.scroll.newest_position
  store.scroll.newest_position = new_position

  store.scroll.last_direction.x = Math.sign(store.scroll.newest_position.x
    - store.scroll.last_known_position.x)
  store.scroll.last_direction.y = Math.sign(store.scroll.newest_position.y
    - store.scroll.last_known_position.y)

  store.view.scroll_percent.x = 0.0
  if (store.view.max_scroll.x) {
    store.view.scroll_percent.x = store.scroll.newest_position.x
      / store.view.max_scroll.x
    store.view.scroll_percent.x = Math.min(
      +store.view.scroll_percent.x.toFixed(2), 1.0)
  }

  store.view.scroll_percent.y = 0.0
  if (store.view.max_scroll.y) {
    store.view.scroll_percent.y = store.scroll.newest_position.y
      / store.view.max_scroll.y
    store.view.scroll_percent.y = Math.min(
      +store.view.scroll_percent.y.toFixed(2), 1.0)
  }
}

function initialize_store(store: ScrollFeedbackStore, container_query: string) {

  store.scroll.last_known_position = { x: scrollX, y: scrollY }
  store.scroll.newest_position = store.scroll.last_known_position

  const html_elem = document.querySelector("html")
  if (!html_elem) {
    return
  }

  store.view.width = html_elem.clientWidth
  store.view.height = html_elem.clientHeight

  const container = document.querySelector(container_query) as HTMLElement
  if (!container) {
    return
  }

  store.view.list_container_top = container.offsetTop
  store.view.list_container_width = container.clientWidth
  store.view.list_container_height = container.clientHeight

  store.view.max_scroll.x = store.view.list_container_width - store.view.width
  store.view.max_scroll.y = store.view.list_container_height - store.view.height

  store.view.scroll_percent.x = 0.0
  if (store.view.max_scroll.x) {
    store.view.scroll_percent.x = store.scroll.newest_position.x
      / store.view.max_scroll.x
    store.view.scroll_percent.x = Math.min(
      +store.view.scroll_percent.x.toFixed(2), 1.0)
  }

  store.view.scroll_percent.y = 0.0
  if (store.view.max_scroll.y) {
    store.view.scroll_percent.y = store.scroll.newest_position.y
      / store.view.max_scroll.y
    store.view.scroll_percent.y = Math.min(
      +store.view.scroll_percent.y.toFixed(2), 1.0)
  }
}

initialize_store(_STORE, "main.notif-message-list")
set_active_notif_item(_STORE)

addEventListener("scroll", debounce((event) => {

  handle_scroll_event(_STORE, event)
  set_active_notif_item(_STORE)
}, 130, {
  maxWait: 110,
  leading: false,
  trailing: true,
}))

addEventListener("resize", debounce((event) => {

  initialize_store(_STORE, "main.notif-message-list")

  handle_scroll_event(_STORE, event)
  set_active_notif_item(_STORE)
}, 130, {
  maxWait: 110,
  leading: false,
  trailing: true,
}))
