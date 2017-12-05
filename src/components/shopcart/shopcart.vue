<template>
  <div class="shopcart">
    <div class="content">
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
      <div class="content-right" :class="payClass">
        {{ payDesc }}
      </div>
    </div>
    <div class="ball-container">
      <transition-group tag="div" name="drop" v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
        <div class="ball" v-show="ball.show" v-for="ball in balls" :key="ball.key">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
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
      enter: function (el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
        done();
      },
      afterEnter: function (el) {
        let ball = this.dropsBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
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
        transition: all 0.4s
        &.drop-enter-active, &.drop-leave-active
          transition: all 0.4s
        .inner
          width: 16px
          height: 16px
          background: rgb(0, 160, 220)
          border-radius: 50%
          transition: all 0.4s
        
</style>