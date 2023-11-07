import { debounce, update } from "lodash"

interface ScrollEventDebugInfo {
  time_stamp: number
  source: EventTarget
}

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

  document_width: number
  document_height: number

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

    document_width: 0,
    document_height: 0,

    max_scroll: { x: 0, y: 0 },
    scroll_percent: { x: 0, y: 0 },
  }
}

function set_notif_item_active() {

}

function update_store(event: Event) {

  if (!event.target) {
    return
  }

  // const debug_info: ScrollEventDebugInfo = {
  //   time_stamp: event.timeStamp,
  //   source: event.target,
  // }

  const new_position = { x: scrollX, y: scrollY }

  _STORE.scroll.last_known_position = _STORE.scroll.newest_position
  _STORE.scroll.newest_position = new_position

  _STORE.scroll.last_direction.x = Math.sign(_STORE.scroll.newest_position.x
    - _STORE.scroll.last_known_position.x)
  _STORE.scroll.last_direction.y = Math.sign(_STORE.scroll.newest_position.y
    - _STORE.scroll.last_known_position.y)

  _STORE.view.max_scroll.x = _STORE.view.document_width - _STORE.view.width
  _STORE.view.max_scroll.y = _STORE.view.document_height - _STORE.view.height

  if (_STORE.view.max_scroll.x) {
    _STORE.view.scroll_percent.x = _STORE.scroll.newest_position.x
      / _STORE.view.max_scroll.x
    _STORE.view.scroll_percent.x = Math.min(
      +_STORE.view.scroll_percent.x.toFixed(2), 1.0)
  }

  if (_STORE.view.max_scroll.y) {
    _STORE.view.scroll_percent.y = _STORE.scroll.newest_position.y
      / _STORE.view.max_scroll.y
    _STORE.view.scroll_percent.y = Math.min(
      +_STORE.view.scroll_percent.y.toFixed(2), 1.0)
  }

  // console.dir(debug_info)
  // console.dir(_STORE)
}

function initialize_store(store: ScrollFeedbackStore) {

  store.scroll.last_known_position = { x: scrollX, y: scrollY }
  store.scroll.newest_position = store.scroll.last_known_position

  const html_elem = document.querySelector("html")
  if (!html_elem) {
    return
  }

  store.view.width = html_elem.clientWidth
  store.view.height = html_elem.clientHeight

  const body_elem = document.querySelector("body")
  if (!body_elem) {
    return
  }

  store.view.document_width = body_elem.clientWidth
  store.view.document_height = body_elem.clientHeight

  store.view.max_scroll.x = store.view.document_width - store.view.width
  store.view.max_scroll.y = store.view.document_height - store.view.height

  if (store.view.max_scroll.x) {
    store.view.scroll_percent.x = store.scroll.newest_position.x
      / store.view.max_scroll.x
    store.view.scroll_percent.x = Math.min(
      +store.view.scroll_percent.x.toFixed(2), 1.0)
  }

  if (store.view.max_scroll.y) {
    store.view.scroll_percent.y = store.scroll.newest_position.y
      / store.view.max_scroll.y
    store.view.scroll_percent.y = Math.min(
      +store.view.scroll_percent.y.toFixed(2), 1.0)
  }

  // console.dir(store)
}

initialize_store(_STORE)

addEventListener("scroll", debounce((event) => {

  update_store(event)
  set_notif_item_active()
}, 130, {
  maxWait: 110,
  leading: false,
  trailing: true,
}))

addEventListener("resize", debounce((event) => {

  initialize_store(_STORE)

  update_store(event)
  set_notif_item_active()
}, 130, {
  maxWait: 110,
  leading: false,
  trailing: true,
}))
