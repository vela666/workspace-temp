<template>
  <div class="main">
    <!-- 滚动内容 -->
    <section class="content" v-for="item in menu" :key="item.name" :id="item.id">
      <header class="header">
        {{ item.name }}
      </header>
    </section>

    <!-- 侧边栏 -->
    <ul class="sidebar">
      <li v-for="item in menu" :key="item.name" :class="{active: active.name === item.name}">
        <a href="javascript:;" @click="clickSideBar(item)">{{ item.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script setup>
// https://juejin.cn/post/7172346127860105247
import {
  ref,
  onMounted,
  onBeforeUnmount,
  computed,
} from 'vue';

const menu = ref([
  {
    name: '前言',
    id: 'main1',
    intersectionRatio: 0,
  },
  {
    name: '简介',
    id: 'main2',
    intersectionRatio: 0,
  },
  {
    name: '主要功能',
    id: 'main3',
    intersectionRatio: 0,
  },
  {
    name: '阅读提示',
    id: 'main4',
    intersectionRatio: 0,
  },
  {
    name: '开始编写',
    id: 'main5',
    intersectionRatio: 0,
  },
  {
    name: '结语',
    id: 'main6',
    intersectionRatio: 0,
  },
])

function clickSideBar(item) {
  const dom = document.getElementById(item.id)
  const prevDom = document.getElementById(active.value.id)
  if (dom) {
    const isDown = dom?.offsetTop - (prevDom?.offsetTop || 0) >= 0// 目標元素距離當前激活目標的距離 > 0，表示向下滾動
    let prevScrollY = window.scrollY
    dom.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
   /* const timer = setInterval(() => {
      window.scrollBy(0, isDown ? 20 : -20) // 滾動的距離（可能正負）和時間間隔一致，代表滾動是勻速的。

      // 如果滾動后距離等於上傳滾動的距離，說明滾動失敗了，停止滾動
      if (prevScrollY === window.scrollY) {
        clearInterval(timer)
      } else {
        prevScrollY = window.scrollY
      }

      if (isDown) { // 向下滾動時，頁面滾動距離大於目標元素距離時，停止滾動，反之同理
        if (prevScrollY >= dom.offsetTop - 20) {
          clearInterval(timer)
        }
      } else {
        if (prevScrollY <= dom.offsetTop - 20) {
          clearInterval(timer)
        }
      }
    }, 10) // 間隔越短，滾動越流暢，滾動的準確率就越高*/
  }
}

const observers = []
onMounted(() => {
  menu.value.forEach((el) => {
    const observer = new IntersectionObserver(([{intersectionRatio}]) => {
      el.intersectionRatio = intersectionRatio
    }, {
      rootMargin: '-100px',
      threshold: [0.1, 0.5, 0.8, 1],
    })

    observer.observe(document.getElementById(el.id))
    observers.push(observer)
  })
})

onBeforeUnmount(() => {
  observers.forEach((observer) => {
    observer.disconnect()
  })
})

// 屏幕中显示元素面积最大的为侧边栏选中的菜单
const active = computed(() => {
  return [...menu.value].sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
})
</script>

<style lang="scss">
.main {
  padding: 30px;
  padding-right: 240px;

  .content {
    height: 600px;
    background: #eee;
    border-radius: 8px;
    margin-bottom: 15px;
  }

  .header {
    padding: 15px;
    font-size: 20px;
    font-weight: bold;
  }
}

.sidebar {
  position: fixed;
  top: 50%;
  right: 50px;
  width: 168px;
  overflow: hidden;
  background-color: #fff;
  border-radius: 8px;
  padding: 0;
  transform: translateY(-50%);
  box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.05), 0px 3px 5px 0px rgba(0, 0, 0, 0.06), 0px 2px 4px -1px rgba(0, 0, 0, 0.04);

  li {
    line-height: 40px;
    text-align: center;
    list-style: none;
    color: #333;

    &:not(:last-child) {
      border-bottom: #f5f5f5 solid 1px;
    }

    &.active {
      color: #fff;
      background-color: #ff8000;
    }

    a {
      display: block;
      width: 100%;
      height: 100%;
      color: inherit;
      text-decoration: none;
    }
  }
}
</style>
