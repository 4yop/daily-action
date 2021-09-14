<template>
	<view class="">
		
		<view class="u-m-p-50">
			<view class="u-demo-area u-flex u-row-center u-position ">
				<u-dropdown
					style="background-color: #FFF;"
					:close-on-click-mask="dropdown.mask"
					ref="uDropdown"
					:activeColor="dropdown.activeColor"
					:borderBottom="dropdown.borderBottom"
				>
					<u-dropdown-item @change="changeOrder" v-model="dropdown.value1" title="排序" :options="dropdown.options1"></u-dropdown-item>
					<u-dropdown-item @change="changePlace" v-model="dropdown.value2" title="地点" :options="dropdown.options2"></u-dropdown-item>
					<!-- <u-dropdown-item @change="change" v-model="dropdown.value3" title="操作人" :options="dropdown.options3"></u-dropdown-item>
				 -->
				</u-dropdown>
			</view>
		</view>

		<view class="u-demo u-demo-empty" v-if="actionLog.length < 1">
			<view class="u-demo-wrap">
				<view class="u-demo-area">
					<u-empty :mode="empty.mode"><u-button v-if="empty.slot" slot="bottom" size="medium">slot按钮</u-button></u-empty>
				</view>
			</view>
		</view>

		<view class="wrap" >
			<u-time-line>
				<u-time-line-item nodeTop="2" v-for="item in actionLog">
					<template v-slot:node>
						<view class="u-node" style="background: #19be6b;"><u-icon name="lock-fill" color="#fff" :size="24"></u-icon></view>
					</template>
					<template v-slot:content>
						<view>
							<view class="u-order-title">已锁门</view>
							<view class="u-order-desc">{{ item.tip }}</view>
							<view class="u-order-time">{{ item.created_at }}</view>
						</view>
					</template>
				</u-time-line-item>
			</u-time-line>
		</view>
		
		<view class="u-demo-wrap"  v-if="btn.show">
			<view class="u-demo-area"  >
				<u-button
					@click="changePage"
					data-name="3333"
					:loading="btn.loading"
					:plain="btn.plain"
					:shape="btn.shape"
					:size="btn.size"
					:ripple="btn.ripple"
					:hairLine="btn.hairLine"
					:type="btn.type"
				>
					加载更多
				</u-button>
			</view>
		</view>
	</view>
	
</template>

<script>
import {isLogin} from "../../common/userService.js"	
export default {
	data() {
		return {
			empty: {
				mode: 'data',
				slot: false
			},

			btn: {
				show: false,
				hairLine: true,
				type: 'default',
				size: 'medium',
				shape: 'square',
				plain: false,
				ripple: false,
				loading: false
			},

			dropdown: {
				value1: 0,
				value2: 0,
				value3: '3',
				mask: false,
				title1: '排序',
				title2: '地点',
				options1: [
					{
						label: '默认排序',
						value: 0
					},
					{
						label: '时间倒序',
						value: 1
					},
					{
						label: '时间顺序',
						value: 2
					}
				],
				options2: [
					{
						label: 'ycy707',
						value: 1
					},
					{
						label: '番禺区',
						value: 2
					}
				],
				options3: [
					{
						label: 'pzt',
						value: 1
					},
					{
						label: 'lzh',
						value: 2
					}
				],

				borderBottom: true,
				activeColor: '#2979ff'
			},

			page: 1,

			actionLog: []
		};
	},
	onShow() {
		isLogin()
		if (!this.actionLog || this.actionLog.length < 1) {
			this.getActionLog()
		}
	},
	onLoad() {
		let that = this;
		that.getActionLog();
		that.getPlaceList();
	},
	methods: {
		
		
		
		changePage() {
			console.log("sdfsdg");
			let that = this;
			that.btn.show = false;
			that.page++;
			that.getActionLog();
		},

		getActionLog() {
			let that = this;
			that.$u
				.get('/action/log', {
					page: that.page,
					place_id: that.dropdown.value2,
					order: that.dropdown.value1
				})
				.then(res => {
					if (res.Code != 1) {
						uni.showToast({ title: res.Msg, icon: 'none' });
					}
					if (that.page > 1) {
						for (let i in res.Data) {
							that.actionLog.push(res.Data[i]);
						}
					} else {
						that.actionLog = res.Data;
					}
					if (!res.Data || res.Data.length < 1) {
						if (that.page > 1) {
							uni.showToast({ title: "没有更多了", icon: 'none' });
						}
						return;
					}
					that.btn.show = true;
				});
		}, //******end getActionLog()*********

		getPlaceList() {
			let that = this;
			that.placeList = uni.getStorageSync('placeList');
			that.$u.get('/place/list').then(res => {
				if (res.Code != 1) {
					uni.showToast({ title: res.Msg, icon: 'none' });
				} else {
					let options2 = [];
					for (let i in res.Data) {
						options2.push({
							label: res.Data[i].PlaceName,
							value: res.Data[i].ID
						});
					}
					that.dropdown.options2 = options2;
				}
			});
		}, //******end getPlaceList()*********

		change(index) {
			this.$u.toast(`点击了第${index}项`);
		},

		changeOrder(index) {
			this.dropdown.value1 = index;
			this.btn.show = false;
			this.page = 1;
			this.getActionLog();
		},

		changePlace(index) {
			this.dropdown.value2 = index;
			this.btn.show = false;
			this.page = 1;
			this.getActionLog();
		}
	}
};
</script>

<style scoped lang="scss">
.u-position {
	// position: fixed;
	width: 100%;
	top: 0;
	background: #fff;
	z-index: 100;
}

.u-config-wrap {
	padding: 40rpx;
}

.slot-content {
	background-color: #ffffff;
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
			color: #ffffff;
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

<style lang="scss" scoped>
.u-demo-empty .u-demo-area {
	height: 160px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.u-demo-empty .u-demo-area .u-empty {
	padding-top: 0;
}
</style>
