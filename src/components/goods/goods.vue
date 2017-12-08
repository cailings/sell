<template>
	<div class="goods">
    <div class="menu-wapper" ref="menuWapper">
      <ul>
        <li v-for="(item, index) in goods" class="goods-item" :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)"> 
          <span class="text border-bottom-1px">
            <span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{ item.name }}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wapper" ref="foodsWapper">
      <ul>
        <li class="foods-list food-list-hook" v-for="item in goods">
          <h1 class="title">{{ item.name }}</h1>
          <ul>
            <li @click="selectFood(food,$event)" class="food-item border-bottom-1px" v-for="food in item.foods">
              <div class="food-icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="food-cont">
                <h2 class="food-tit">{{ food.name}}</h2>
                <p class="food-desc">{{ food.description }}</p>
                <div class="extra">
                  <span class="sell-count">月售{{ food.sellCount }}份</span>
                  <span>好评率{{ food.rating }}%</span>
                </div>
                <div class="food-price">
                  <span class="now-price">￥<span class="price">{{ food.price }}</span></span>
                  <span class="old-price" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
                </div>
                <div class="cartcontrol-wapper">
                  <cartcontrol :food="food" v-on:cart-add="cartAdd"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :select-foods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
    <food ref="food" :food="selectedFood"></food>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';
  const ERR_OK = 0;
	export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      currentIndex: function () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods: function () {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created: function () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then(response => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            this.refresh1();
            this.refresh2();
          });
        }
      });
    },
    mounted() {
      setTimeout(() => {
        this._initScroll();
        this._calculateHeight();
      }, 200);
    },
    methods: {
      selectMenu: function (index, event) {
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodsWapper.getElementsByClassName('food-list-hook');
        let ref = foodList[index];
        this.foodsScroll.scrollToElement(ref, 300);
      },
      selectFood: function (food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },
      _initScroll: function () {
        this.menuScroll = new BScroll(this.$refs.menuWapper, {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs.foodsWapper, {
          click: true,
          probeType: 3
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      refresh1() {
        this.menuScroll && this.menuScroll.refresh();
      },
      refresh2() {
        this.foodsScroll && this.foodsScroll.refresh();
      },
      _calculateHeight: function () {
        let foodList = this.$refs.foodsWapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      cartAdd: function (target) {
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/minxi.styl";
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 47px
    width: 100%
    left: 0px
    overflow: hidden
    .menu-wapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .goods-item
        display: table
        height: 54px
        width: 80px
        padding: 0 12px
        &.current
          position: relative
          margin-top: -1px
          background: #fff
          font-weight: 700
          z-index: 100
          .text
            border-none()
        .icon
          display: inline-block
          width: 12px
          height: 12px
          vertical-align: top
          margin-right: 2px
          background-repeat: no-repeat
          background-size: 12px 12px
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          vertical-align: middle
          font-size: 12px
          color: rgb(77, 85, 93)
          line-height: 14px
          border-bottom-1px(rgba(7, 17, 27, .1))
          font-weight: 200
    .foods-wapper
      flex: 1
      .foods-list
        .title
          padding-left: 14px
          height: 26px
          line-height: 26px
          border-left: 2px solid #d9dde1
          background: #f3f5f7
          font-size: 12px
          color: rgb(147, 153, 159)
        .food-item
          display: flex
          margin: 18px
          padding-bottom: 18px
          border-bottom-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            margin-bottom: 0px
            border-none()
          .food-icon
            flex: 0 0 57px
            width: 57px
            margin-right: 10px
          .food-cont
            flex: 1
            width: 0
            .food-tit
              margin: 2px 0 8px 0
              line-height: 14px
              color: rgb(7, 17, 27)
              font-size: 14px
            .food-desc, .extra
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
            .food-desc
              display: block
              margin-bottom: 8px
              line-height: 10px
              overflow: hidden
              text-overflow: ellipsis
              white-space: nowrap
            .extra
              .sell-count
                margin-right: 12px
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
            .cartcontrol-wapper
              position: absolute
              right: 0px
              bottom: 12px
              
</style>