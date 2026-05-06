# 水波纹效果

```vue
<!--  -->
<template>
  <view class="liquid-fill" :style="{ borderColor: option.bgColor }">
    <view class="text"> {{ option.number + '%' }}</view>
    <view class="water_waves">
      <view
        class="water-model water_waves1"
        :style="{ background: option.bgColor, top: top }"
      />
      <view
        class="water-model water_waves2"
        :style="{ background: option.bgColor, top: top }"
      />
      <view class="water-under" :style="{ background: option.bgColor }" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'LiquidFill',
  props: {
    option: {
      type: Object,
      default: () => {
        return {
          bgColor: '#29b3f3',
          number: 50,
        };
      },
    },
  },
  data() {
    return {};
  },
  computed: {
    top() {
      return `${102 - this.option.number}%`;
    },
  },
};
</script>
<style lang="scss" scoped>
.liquid-fill {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-width: 4rpx;
  border-style: solid;
  border-radius: 50%;
  position: relative;
}
.text {
  position: absolute;
  z-index: 99;
  font-size: 28rpx;
  font-weight: bold;
}
.water_waves {
  width: 95%;
  height: 95%;
  border-radius: 50%;
  position: relative;
  animation: water-waves linear infinite;
  overflow: hidden;
  transform: translate3d(0, 0, 0);
}
@keyframes water-waves {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.water-under {
  width: 100%;
  height: 100%;
  opacity: 0.1;
  border-radius: 50%;
}
.water-model {
  position: absolute;
  width: 200%;
  height: 200%;
  animation: inherit;
}
.water_waves1 {
  left: -60%;
  opacity: 0.7;
  border-radius: 40%;
  animation-duration: 5s;
}
.water_waves2 {
  left: -40%;
  border-radius: 35%;
  opacity: 0.5;
  animation-duration: 7s;
}
</style>
```
