import player from '../utils/Player'
import {
  SET_CURRENT_TIME,
  TOGGLE_FETCHING,
  TOGGLE_PLAYING,
  UP_BY_ONE_SECOND,
  SET_DURATION,
  SET_CURRENT_TRACK_INFO,
  TOGGLE_LOADING_TRACK,
  SET_ITEM,
} from './types'
export const state = () => ({
  fetching: true,
  isPlaying: false,
  isLoadingTrack: false,
  currentTrack: {
    src: '',
    name: '',
    duration: 0,
    currentTime: 0,
  },
  item: {},
})

export const actions = {
  initPlayer({ commit }) {
    function onPlay() {
      commit(TOGGLE_PLAYING, true)
    }
    function onPause() {
      commit(TOGGLE_PLAYING, false)
    }
    function onTimeUpdate() {
      const prev = Math.floor(player.getCurrentTime() || 0)
      commit(UP_BY_ONE_SECOND, prev)
    }
    player.init(onPlay, onPause, onTimeUpdate)
  },

  toggleFetching({ commit }, val) {
    commit(TOGGLE_FETCHING, val)
  },

  togglePlaying({ commit }) {
    const isPlaying = player.isPlaying
    const toggled = !isPlaying
    commit(TOGGLE_PLAYING, toggled)

    const dur = player.getDuration()
    commit(SET_DURATION, dur)
    player.toggle()
  },

  seekAction({ commit }, val) {
    player.seek(val)
    commit(SET_CURRENT_TIME, val)
  },

  checkTime({ commit }) {
    const prev = Math.floor(player.getCurrentTime() || 0)
    commit(UP_BY_ONE_SECOND, prev)
  },

  setDuration({ commit }) {
    const dur = player.getDuration()
    commit(SET_DURATION, dur)
  },

  setTrack({ commit, dispatch }, data) {
    const name = data?.name
    const src = data?.fileUrl

    function setMeta() {
      if ('mediaSession' in navigator) {
        // eslint-disable-next-line no-undef
        window.navigator.mediaSession.metadata = new MediaMetadata({
          title: name,
          artist: data.artist ? data.artist.name : 'Unknown',
          // album: "Let's yoga",
          artwork: [
            {
              src: data?.imageUrl,
              // sizes: '128x128',
              type: 'image/png',
            },
          ],
        })
      }
    }

    if (process.client) {
      setMeta()
    }

    function onDone() {
      setTimeout(() => {
        commit(TOGGLE_PLAYING, true)
        const dur = player.getDuration()
        commit(SET_DURATION, dur)
        player.play()
        commit(TOGGLE_LOADING_TRACK, false)
        dispatch(`music/addToRecent`, data, { root: true })
      }, 500)
    }

    if (name && src) {
      commit(TOGGLE_LOADING_TRACK, true)
      commit(SET_CURRENT_TRACK_INFO, { name, src })
      commit(SET_ITEM, data)
      player.play(src, onDone)
    }
  },
}

export const mutations = {
  [TOGGLE_FETCHING](state, val) {
    state.fetching = val
  },
  [TOGGLE_PLAYING](state, val) {
    state.isPlaying = val
  },
  [SET_CURRENT_TIME](state, val) {
    state.currentTrack.currentTime = val
  },
  [SET_CURRENT_TRACK_INFO](state, data) {
    state.currentTrack = { ...state.currentTrack, ...data }
  },
  [SET_DURATION](state, val) {
    state.currentTrack.duration = val
  },
  [TOGGLE_LOADING_TRACK](state, val) {
    state.isLoadingTrack = val
  },
  [SET_ITEM](state, data) {
    state.item = data
  },
  [UP_BY_ONE_SECOND](state, val) {
    if (state.isPlaying) {
      state.currentTrack.currentTime = val
    }
  },
}
