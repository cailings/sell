<template>
  <div class="shopcart">
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <i class="icon-shopping_cart"></i>
          </div>
          <div class="num" v-show="totalCount > 0">{{ totalCount }}</div>
        </div>
        <div class="price" :class="{'highlight': totalPrice > 0}">￥{{ totalPrice }}</div>
        <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
      </div>
      <div class="content-right" @click.stop.prevent="pay" :class="payClass">
        {{ payDesc }}
      </div>
    </div>
    <div class="ball-container">
      <transition name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter" v-for="ball in balls" :key="ball.key">
        <div class="ball" v-show="ball.show">
          <div class="inner inner-hook"></div>
        </div>
      </transition>
    </div>
    <transition name="fold">
      <div class="shopcart-list" v-show="listShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="empty">清空</span>
      </div>
      <div class="list-content" ref="listContent">
        <ul>
          <li class="food" v-for="food in selectFoods">
            <span class="name">{{food.name}}</span>
            <div class="price">
              ￥<span class="total">{{food.price*food.count}}</span>
            </div>
            <div class="cartcontrol-wapper">
              <cartcontrol :food="food"></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="list-task" @click="listHide" v-show="listShow"></div>
    </transition>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import cartcontrol from 'components/cartcontrol/cartcontrol';

  export default {
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {
            show: false,
            key: 'ball1'
          },
          {
            show: false,
            key: 'ball2'
          },
          {
            show: false,
            key: 'ball3'
          },
          {
            show: false,
            key: 'ball4'
          },
          {
            show: false,
            key: 'ball5'
          }
        ],
        dropsBalls: [],
        fold: true
      };
    },
    computed: {
      totalPrice: function () {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount: function () {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc: function () {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass: function () {
        if (this.totalPrice >= this.minPrice) {
          return 'enough';
        } else {
          return 'not-enough';
        }
      },
      listShow: function () {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
        return show;
      }
    },
    methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropsBalls.push(ball);
            return;
          }
        }
      },
      empty: function () {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      listHide: function () {
        this.fold = true;
      },
      pay: function () {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`您将要支付${this.totalPrice}元`);
      },
      beforeEnter: function (el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
      enter: function (el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter: function (el) {
        let ball = this.dropsBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList: function () {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/minxi.styl";

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    height: 48px
    z-index: 10
    .content
      display: flex
      background: #141d27
      color: rgba(255, 255, 255, .4)
      font-size: 0
      .content-left
        flex: 1
        .logo-wapper
          display: inline-block
          margin: 0px 12px
          top: -10px
          position: relative
          padding: 6px
          height: 56px
          width: 56px
          vertical-align: top
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            text-align: center
            border-radius: 50%
            background: #2b343d
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
            &.highlight
              .icon-shopping_cart
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            background: rgb(240, 20, 20)
            font-weight: 700
            color: #fff
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4)
        .price
          display: inline-block
          vertical-align: top
          line-height: 24px;
          margin: 12px 0px
          padding-right: 12px
          font-weight: 700
          font-size: 16px
          border-right: 1px solid rgba(255, 255, 255, .1)
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin-left: 12px
          line-height: 48px
          font-size: 10px
          font-weight: 100
      .content-right
        flex: 0 0 105px
        width: 105px
        height: 48px
        text-align: center
        line-height: 48px
        background: #2b343b
        font-weight: 700
        font-size: 12px
        &.not-enough
          background: #2b343b
        &.enough
          background: #00b43c
          color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 10000
        &.drop-enter-active, &.drop-leave-active
          transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
        .inner
          width: 16px
          height: 16px
          background: rgb(0, 160, 220)
          border-radius: 50%
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      width: 100%
      z-index: -1
      transition: all 0.5s
      transform: translate3d(0,-100%,0)
      &.fold-enter,&.fold-leave
        transform: translate3d(0,0,0)
      .list-header
        height: 40px
        width: 100%
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, .1)
        .title
          float: left
          font-size: 14px
          font-weight: 200
          color: rgb(7, 17, 27)
        .empty
          float: right
          color: rgb(0, 160, 220)
          font-size: 12px
      .list-content
        padding: 0 18px
        max-height: 217px
        background: #fff
        overflow: hidden
        .food
          position: relative
          padding: 12px 0
          border-bottom-1px(rgba(7, 17, 27, .1))
          .name
            line-height: 24px
            color: rgb(7, 17, 27)
            font-size: 14px
          .price
            position: absolute
            right: 90px
            top: 12px
            line-height: 24px
            font-size: 10px
            color: rgb(240, 20, 20)
            .total
              font-size: 14px
              font-weight: 700
          .cartcontrol-wapper
            position: absolute
            right: 0px
            top: 6px
  .list-task
    position: fixed
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: -10
    background: rgba(7, 17, 27, .6)
    transition: all 0.5s
    backdrop-filter: blur(10px)
    &.fade-enter-active,&.fade-leave-active
      opacity: 1
      background: rgba(7, 17, 27, .6)
      transition: all 0.5s
    &.fade-enter,&.fade-leave
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>