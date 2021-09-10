<template>
	<view class="">
		<view class="u-m-p-50">
			<view class="u-demo-area u-flex u-row-center">
				<u-dropdown :close-on-click-mask="mask" ref="uDropdown" :activeColor="activeColor" :borderBottom="borderBottom">
					<u-dropdown-item @change="change" v-model="value1" title="排序" :options="options1"></u-dropdown-item>
					<u-dropdown-item @change="change" v-model="value2" title="地点" :options="options2"></u-dropdown-item>
					<u-dropdown-item @change="change" v-model="value3" title="操作人" :options="options3"></u-dropdown-item>
				</u-dropdown>
			</view>
		</view>
		
		<view class="wrap">
			<u-time-line>
				<u-time-line-item nodeTop="2">
					<template v-slot:node>
						<view class="u-node" style="background: #19be6b;">
							<u-icon name="lock-fill" color="#fff" :size="24"></u-icon>
						</view>
					</template>
					<template v-slot:content>
						<view>
							<view class="u-order-title">已锁门</view>
							<view class="u-order-desc">[扫码]用户xx 将 xxx707 扫码锁门记录。</view>
							<view class="u-order-time">2019-05-08 12:12</view>
						</view>
					</template>
				</u-time-line-item>
				
				<u-time-line-item nodeTop="2">
					<template v-slot:node>
						<view class="u-node" style="background: #19be6b;">
							<u-icon name="lock-fill" color="#fff" :size="24"></u-icon>
						</view>
					</template>
					<template v-slot:content>
						<view>
							<view class="u-order-title">已锁门</view>
							<view class="u-order-desc">[扫码]用户xx 将 xxx707 扫码锁门记录。</view>
							<view class="u-order-time">2019-05-08 12:12</view>
						</view>
					</template>
				</u-time-line-item>
				
				
				
				
				
	
			</u-time-line>
		</view>
		
		
		
	</view>
</template>

<script>
	export default {
		data() { 
			return {
				value1: '',
				value2: '2',
				value3: '3',
				mask: true,
				options1: [{
						label: '默认排序',
						value: 1,
					},
					{
						label: '时间倒序',
						value: 2,
					},
					{
						label: '价格优先',
						value: 3,
					}
				],
				options2: [{
						label: 'ycy707',
						value: 1,
					},
					{
						label: '番禺区',
						value: 2,
					},
			    ],
				options3: [{
						label: 'pzt',
						value: 1,
					},
					{
						label: 'lzh',
						value: 2,
					},
				],
				
				borderBottom: false,
				activeColor: '#2979ff'
			}
		},
		methods: {
			borderChange(index) {
				this.borderBottom = !index;
			},
			activeColorChange(index) {
				this.activeColor = ['#2979ff', '#ff9900', '#19be6b'][index];
			},
			change(index) {
				this.$u.toast(`点击了第${index}项`);
			},
			closeDropdown() {
				this.$refs.uDropdown.close();
			},
			tagClick(index) {
				this.list[index].active = !this.list[index].active;
			},
			maskChange(index) {
				this.mask = !index;
			}
		}
	}
</script>

<style scoped lang="scss">
	.u-config-wrap {
		padding: 40rpx;
	}
	
	.slot-content {
		background-color: #FFFFFF;
		padding: 24rpx;
		
		.item-box {
			margin-bottom: 50rpx;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			
			.item {
				border: 1px solid $u-type-primary;
				color: $u-type-primary;
				padding: 8rpx 40rpx;
				border-radius: 100rpx;
				margin-top: 30rpx;
			}
			
			.active {
				color: #FFFFFF;
				background-color: $u-type-primary;
			}
		}
	}
</style>



<style lang="scss" scoped>
	.wrap {
		padding: 24rpx 24rpx 24rpx 40rpx;
	}
	
	.u-node {
		width: 44rpx;
		height: 44rpx;
		border-radius: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background: #d0d0d0;
	}
	
	.u-order-title {
		color: #333333;
		font-weight: bold;
		font-size: 32rpx;
	}
	
	.u-order-title.unacive {
		color: rgb(150, 150, 150);
	}
	
	.u-order-desc {
		color: rgb(150, 150, 150);
		font-size: 28rpx;
		margin-bottom: 6rpx;
	}
	
	.u-order-time {
		color: rgb(200, 200, 200);
		font-size: 26rpx;
	}
	
	.tel {
		color: $u-type-primary;
	}
</style>
