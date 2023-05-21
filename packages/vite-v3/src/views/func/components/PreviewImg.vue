<template>
  <div
    v-if="mask"
    class="preview-pic">
    <div class="preview-pic-mask"></div>
    <div
      v-click-away="onClickAway"
      class="preview-pic-content">
      <div class="model">
        <div class="model-content">
          <img
            :src="data.src"
            class="model-img">
        </div>
      </div>
      <div class="model-desc" style="position: absolute;">
        <h4>{{ data.name }}</h4>
      </div>
    </div>
  </div>
  <!--  不需要蒙版-->
  <div
    v-show="isNoMask"
    :class="{'preview-pic-content': isPosition}"
  >
    <div class="model">
      <div class="model-content">
        <img
          :src="data.src"
          class="model-img">
      </div>
    </div>
    <div class="model-desc">
      <h4 style="color:#1f1f1f">{{ data.name }}</h4>
    </div>
  </div>
</template>

<script>
import {
  watch,
  computed,
} from 'vue'

export default {
  name: 'PreviewImg',
  props: {
    // 蒙版的
    isMask: {
      type: Boolean,
      default: false
    },
    // 不需要蒙版
    isNoMask: {
      type: Boolean,
      default: false
    },
    // 没有蒙版的需不需定位
    isPosition: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: {
        src: null,
        name: null
      }
    }
  },
  emits: ['update:isMask'],
  setup(props, {emit, attrs}) {
    const mask = computed({
      get() {
        return props.isMask
      },
      set(val) {
        emit('update:isMask', val)
      }
    })

    // 点其他地方关闭
    const onClickAway = () => {
      mask.value = false
    }
    return {
      mask,
      onClickAway,
    }
  }
}
</script>

<style lang="scss" scoped>
.preview-pic {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 6666;
}

.preview-pic-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: .5;
  background: #000;
}

.preview-pic-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.model {
  padding: 10px;
  width: 320px;
  height: 587px;
  background: #ffffff;
  border-radius: 27px;
  box-shadow: 0px 3px 6px 0px rgba(28, 39, 80, 0.16);

  .model-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow-y: overlay;
    border-radius: 20px;

    .model-img {
      max-width: 100%;
      max-height: 100%;
      border-radius: 20px;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.model-desc {
  margin-top: 5px;
  width: 100%;

  h4 {
    position: relative;
    font-size: 14px;
    color: #ffffff;
    text-align: center;
  }
}

</style>
