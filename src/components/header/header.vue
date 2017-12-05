<template>	
	<div class="header">
		<div class="content-wapper">
			<div class="avatar">
				<img width="64" height="64" :src="seller.avatar"/>
			</div>
			<div class="content">
				<div class="title">
					<!-- <span class="brand"></span> -->
					<span class="name">{{ seller.name }}</span>
				</div>
				<div class="seller-desc">
					{{ seller.description }}/{{ seller.deliveryTime }}分钟送达
				</div>
				<div class="seller-support" v-if="seller.supports">
					<span class="icon" :class="classMap[seller.supports[1].type]"></span>
					<span class="support-text">{{ seller.supports[1].description }}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click="showModul">
				<span class="count">{{ seller.supports.length }}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="notice-wapper" @click="showModul">
			<div class="notice-cont">
				<p class="cont-text">{{ seller.bulletin }}</p>
				<i class="icon-keyboard_arrow_right icon-more"></i>
			</div>
		</div>
		<div class="background">
			<img :src="seller.avatar">
		</div>
		<transition name="fade">
			<div class="modul" v-show="modulShow">
				<div class="modul-wrapper clearfix">
					<div class="modul-main">
						<h1 class="name">{{ seller.name }}</h1>
						<div class="star-wapper">
							<star :score="seller.score" :size="48"></star>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="title-txt">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="supports">
							<li class="support-item" v-for="(item, index) in seller.supports">
								<span class="icon" :class="classMap[item.type]"></span>
								<span class="desc">{{ item.description }}</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="title-txt">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">
							<p class="bulletin-desc">{{ seller.bulletin }}</p>
						</div>
							
					</div>
				</div>
				<div class="modul-close">
					<i class="icon-close" @click="modulHide"></i>
				</div>
			</div>
		</transition>
	</div>

</template>

<script>
	import star from 'components/star/star.vue';

	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data() {
			return {
				modulShow: false
			};
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
		},
		methods: {
			showModul: function() {
				this.modulShow = true;
			},
			modulHide: function() {
				this.modulShow = false;
			}
		},
		components: {
			star
		}
	};
</script>

<style lang="stylus" rel="stylesheet/stylus">

	@import "../../common/stylus/minxi.styl";
	
	.header
		position: relative
		overflow: hidden
		color: #fff
		.content-wapper
			position: relative
			padding: 24px 12px 18px 24px
			overflow: hidden
			font-size: 0px
			.avatar
				width: 64px
				float: left
				margin-right: 16px
				img
					border-radius: 2px
			.content
				float: left
				.title
					padding-left: 36px
					margin: 2px 0 8px 0
					bg-image('brand')
					background-position: left center
					background-size: 30px 18px
					background-repeat: no-repeat
					font-size: 16px
					font-weight: bold
					line-height: 18px
				.seller-desc
					line-height: 12px
					font-size: 12px
				.seller-support
					margin-top: 10px
					position: relative
					padding: 0px 0px 2px 16px
					line-height: 12px
					font-size: 10px
					.icon
						display: block
						width: 12px
						height: 12px
						position: absolute
						left: 0px
						top: 0px
						background-size: cover
						background-repeat: no-repeat
						&.decrease
							bg-image('decrease_1')
						&.discount
							bg-image('discount_1')
						&.invoice
							bg-image('invoice_1')
						&.guarantee
							bg-image('guarantee_1')
						&.special
							bg-image('special_1')
			.support-count
				position: absolute
				right: 12px
				bottom: 14px
				padding: 0px 8px
				height: 24px
				line-height: 24px
				background-color: rgba(0, 0, 0, 0.2) 
				border-radius: 14px
				font-size: 10px
				color: #fff
				.icon-keyboard_arrow_right
					line-height: 24px
					margin-left: 2px
		.notice-wapper
			position: relative
			height: 28px
			line-height: 28px
			padding: 0 12px
			background: rgba(7, 17, 27, 0.2)
			.notice-cont
				padding-left: 26px
				height: 28px
				bg-image: ('bulletin')
				background-repeat: no-repeat
				background-size: 22px 12px
				background-position: left center
				.cont-text
					padding-right: 4px
					white-space:nowrap;
					overflow:hidden;
					text-overflow:ellipsis;  
					color: #fff
					font-size: 10px
				.icon-more
					position: absolute
					right: 10px
					top: 8px
					color: #fff
					font-size: 10px
		.background
			position: absolute
			left: 0px
			top: 0px
			width: 100%
			height: 100%
			filter: blur(10px)
			background-color: rgba(7, 17, 27, 0.5)
			z-index: -1
			img
				width: 100%
		.modul
			position: fixed
			left: 0px
			top: 0px
			width: 100%
			height: 100%
			z-index: 100
			overflow: auto
			backdrop-filter: blur(10px)
			background-color: rgba(7, 17, 27, .8)
			&.fade-enter-active, &.fade-leave-active {
				transition: opacity 0.5s
			}
			&.fade-enter, &.fade-leave-to
				opacity: 0
			.modul-wrapper
				min-height: 100%
				width: 100%
				.modul-main
					margin-top: 64px
					padding-bottom: 64px
					.name
						text-align: center
						line-height: 16px
						font-size: 16px
						font-weight: 700
					.star-wapper
						margin-top: 16px
						text-align: center
					.title
						display: flex
						width: 90%
						margin: 28px auto 24px
						.line
							flex: 1
							position: relative
							bottom: 6px
							border-bottom: 1px solid rgba(255, 255, 255, .2)
						.title-txt
							padding: 0 12px
							line-height: 14px
							color: #fff
							font-weight: 700
							font-size: 14px
					.supports
						width: 80%
						margin: 0 auto
						.support-item
							padding: 0 12px
							margin-bottom: 12px
							font-size: 0
							&:last-child
								margin-bottom: 0
							.icon
								display: inline-block
								width: 16px
								height: 16px
								margin-right: 6px
								vertical-align: top
								background-size: 16px 16px
								background-repeat: no-repeat
								&.decrease
									bg-image('decrease_2')
								&.discount
									bg-image('discount_2')
								&.guarantee
									bg-image('guarantee_2')
								&.invoice
									bg-image('invoice_2')
								&.special
									bg-image('special_2')
							.desc
								line-height: 16px
								font-size: 12px
								font-weight: 200
					.bulletin
						width: 80%
						margin: 0 auto
						.bulletin-desc
							padding: 0 12px
							line-height: 24px
							font-size: 12px
							font-weight: 200
			.modul-close
				position: relative
				width: 32px
				height: 32px
				margin: -64px auto 0 auto
				clear: both
				.icon-close
					font-size: 32px
					color: rgba(255, 255, 255, .5)
</style>