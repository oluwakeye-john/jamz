<template>
  <div class="mb-10">
    <div class="flex justify-between items-center mb-10">
      <h1 class="mb-0 text-2xl font-bold">{{ title }}</h1>
      <div>
        <button class="swiper-nav" @click="handlePrev">
          <font-awesome-icon :icon="['fas', 'chevron-left']" />
        </button>
        <button class="swiper-nav" @click="handleNext">
          <font-awesome-icon :icon="['fas', 'chevron-right']" />
        </button>
      </div>
    </div>
    <div v-swiper="swiperOption">
      <div class="swiper-wrapper">
        <div v-for="(item, index) in data" :key="index" class="swiper-slide">
          <div v-if="type === 'song'">
            <card :type="type" :item="item" :circular="circular" />
          </div>
          <div v-else-if="type === 'artist'">
            <nuxt-link :to="getArtistLink(item._id)">
              <card :type="type" :item="item" :circular="circular" />
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: () => '',
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
  data() {
    return {
      swiperOption: {
        slidesPerView: 2,
        spaceBetween: 30,
        slidesPerGroup: 2,
        freeMode: true,
        // speed: 600,
        breakpoints: {
          768: {
            slidesPerView: 2.5,
            slidesPerGroup: 2.5,
          },
          992: {
            slidesPerView: 4,
            slidesPerGroup: 2,
          },
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
    }
  },
  methods: {
    handleNext() {
      this.$swiper.slideNext()
    },
    handlePrev() {
      this.$swiper.slidePrev()
    },
    getArtistLink(id) {
      return `/artist/${id}`
    },
  },
}
</script>

<style lang="scss" scoped>
.swiper-nav {
  margin: 0 8px;
  color: #92929d;
  &:focus {
    outline: 0;
  }

  transition: 0.3s;
  &:hover {
    color: #fff;
  }
}
</style>
