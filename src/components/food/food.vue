<template>
  <transition name="move">
    <div class="food" ref="food" v-show="showFlag">
      <div class="food-content">
        <div class="header-img">
          <img :src="food.image">
          <div @click="hide" class="back">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="desc">
            <span>月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="food-price">
            <span class="now-price">￥<span class="price">{{ food.price }}</span></span>
            <span class="old-price" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
          </div>
          <transition name="fade">
            <div class="buy-icon" @click.stop.prevnt="addFirst" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
          <div class="cartcontrol-wapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
        </div>
        <div class="food-info-wapper" v-show="food.info">
          <split></split>
          <div class="food-info">
            <h1 class="title">商品介绍</h1>
            <p class="info">{{food.info}}</p>
          </div>
        </div>
        <split></split>
        <div class="ratings">
          <h1 class="title">商品评价</h1>
        </div>
      </div> 
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll';
  import Vue from 'vue';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import split from 'components/split/split';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false
      };
    },
    methods: {
      show: function () {
        this.showFlag = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide: function () {
        this.showFlag = false;
      },
      addFirst: function (event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('cart-add', event.target);
        Vue.set(this.food, 'count', 1);
      }
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    width: 100%
    z-index: 9
    background: #fff
    &.move-enter-active, &.move-leave-active
      transition: all 0.5s linear
      transform: translate3d(0,0,0)
    &.move-leave-to, &.move-enter
      transform: translate3d(100%,0,0)
    .header-img
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        left: 0
        top: 18px
        .icon-arrow_lift
          padding: 18px
          color: #fff
          font-size: 14px
    .content
      padding: 18px
      position: relative
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        font-weight: 700
        color: rgb(7,17,27)
      .desc
        margin-bottom: 18px
        font-size: 10px
        line-height: 10px
        color: rgb(147,153,159)
        .rating
          margin-left: 12px
      .food-price
        line-height: 24px
        font-size: 10px
        .now-price
          margin-right: 8px
          color: rgb(240, 20, 20)
          .price
            font-size: 14px
            font-weight: 700
        .old-price
          color: rgb(147, 153, 159)
          text-decoration: line-through
          font-weight: 700
      .buy-icon
        position: absolute
        right: 18px
        bottom: 18px
        width: 74px
        height: 24px
        line-height: 24px
        text-align: center
        border-radius: 12px
        font-size: 10px
        color: #fff
        background: rgb(0, 160, 220)
        z-index: 10
        &.fade-enter-to,&.fade-leave
          opactity: 0
        &.fade-enter-active,&.fade-leave-active
          transition: all 0.2s
          opactity: 1
      .cartcontrol-wapper
        position: absolute
        right: 12px
        bottom: 12px
    .food-info
      padding: 12px
      .title
        line-height: 14px
        margin-bottom: 6
        font-size: 14px
        color: rgb(7, 17, 27)
      .info
        padding: 0 8px
        line-height: 24px
        color: rgb(77, 85, 93)
        font-weight: 200
        font-size: 12px
    .ratings
      padding: 18px
      .title
        line-height: 14px
        margin-bottom: 6
        font-size: 14px
        color: rgb(7, 17, 27)
</style>