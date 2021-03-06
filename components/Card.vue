<template>
  <div class="card">
    <div class="card__image-container">
      <img
        :src="imageSrc(item.imageUrl)"
        :class="{ circular: circular }"
        @click="playTrack"
      />
      <!-- <div v-if="type === 'song'" @click="playTrack">
        <font-awesome-icon :icon="['fas', 'play']" />
      </div> -->
    </div>
    <div :class="{ 'text-center': circular }">
      <p class="text-md font-bold mt-3 mb-1">{{ item.name }}</p>
      <p class="text-sm my-1 misc">{{ miscString }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getPublicId } from '../utils/image'
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    circular: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'song',
    },
  },
  computed: {
    miscString() {
      if (this.type === 'song') {
        return this.item.artist ? this.item.artist.name : 'Unknown'
      } else if (this.type === 'artist') {
        const trackNo = this.item.songs ? this.item.songs.length : 0
        return `${trackNo} track${trackNo > 1 ? 's' : ''}`
      } else {
        return ''
      }
    },
  },

  methods: {
    ...mapActions({ setTrack: 'player/setTrack' }),
    playTrack() {
      this.setTrack(this.item)
    },
    imageSrc(url) {
      if (url) {
        return this.$cloudinary.image.url(getPublicId(url), {
          width: '400',
          height: 400,
          crop: 'fill',
        })
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.card {
  &__image-container {
    position: relative;
    height: 230px;

    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 768px) {
      height: 150px;
    }

    &:hover {
      img {
        opacity: 0.7;
      }
    }

    & > div {
      z-index: 2;
      background-color: #fff;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      color: #121216;
      font-size: 23px;

      display: flex;
      justify-content: center;
      align-items: center;

      transition: 0.1s;
      &:hover {
        transform: scale(1.15);
      }
    }

    img {
      transition: 0.3s;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
      background-color: #23232d;
      border: 0;

      &.circular {
        position: unset;
        border-radius: 50%;
        margin: 0 auto;
        width: 190px;
        height: 190px;
        @media (max-width: 768px) {
          width: 140px;
          height: 140px;
        }

        @media (max-width: 360px) {
          width: 130px;
          height: 130px;
        }
      }
    }
  }
}
</style>
