<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click="decreaseCart">
        <i class="icon-remove_circle_outline"></i>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
    <div class="cart-add" @click="addCart">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart: function (event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count ++;
        }
        this.$emit('cart-add', event.target);
      },
      decreaseCart: function (event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count --;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0px
    .cart-decrease, .cart-add
      display: inline-block
      padding: 6px
      transition: all 0.3s linear
      .icon-remove_circle_outline
        display: inline-block
        font-size: 24px
        line-height: 24px
        color: rgb(0, 160, 220)
        transition: all 0.3s linear
        transform: rotate(0)
      &.move-enter, &.move-leave-to
        opacity: 0
        transform: translate3d(0px, 0, 0)
        .icon-remove_circle_outline
          transform: rotate(180deg)
      &.move-enter-active, &.move-leave-active
        opacity: 1
        transform: translate3d(24px, 0, 0)
        .icon-remove_circle_outline
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      height: 24px
      padding-top: 6px
      line-height: 24px
      text-align: center
      color: rgb(147, 153, 159)
      font-size: 10px
    .cart-add
      .icon-add_circle
        line-height: 24px
        font-size: 24px
        color: rgb(0, 160, 220)
</style>