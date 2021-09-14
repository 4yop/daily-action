<template>
	<view>
		<u-navbar :is-back="false" title="　" :border-bottom="false">
			<view class="u-flex u-row-right" style="width: 100%;">
				<view class="camera u-flex u-row-center">
					<u-icon name="camera-fill" color="#000000" size="48"></u-icon>
				</view>
			</view>
		</u-navbar>
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<u-avatar :src="userInfo.avatarUrl" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{userInfo.nickName}}</view>
				<view class="u-font-14 u-tips-color">手机号:未绑定</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="scan" color="#969799" size="28"></u-icon>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>
		
		<!-- <view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @click="noHas" icon="rmb-circle" title="支付"></u-cell-item>
			</u-cell-group>
		</view> -->
		
		<!-- <view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @click="noHas" icon="star" title="收藏"></u-cell-item>
				<u-cell-item @click="noHas"icon="photo" title="相册"></u-cell-item>
				<u-cell-item @click="noHas"icon="coupon" title="卡券"></u-cell-item>
				<u-cell-item @click="noHas"icon="heart" title="关注"></u-cell-item>
			</u-cell-group>
		</view> -->
		
		<view class="u-m-t-20">
			<!-- <u-cell-group>
				<u-cell-item @click="noHas"  icon="setting" title="设置"></u-cell-item>
			</u-cell-group> -->
			<u-cell-group>
				<u-cell-item @click="showHelp"  icon="setting" title="使用说明"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				show:true,
				userInfo : {}
			}
		},
		onShow() {
			let that = this
			that.updateUserInfo();
		},
		onLoad() {
			
		},
		methods: {
			
			showHelp () {
				uni.showModal({
				    title: '使用说明',
				    content: '添加地点,然后生成小程序码,然后将码打印贴门后；然后关门后扫一扫;有时会突然又想:到底有没有关门？这时然扫码记录就知道有没有关门了',
				    success: function (res) {
				        if (res.confirm) {
				            console.log('用户点击确定');
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			
			noHas () {
				uni.showToast({ title: "没有开发这功能", icon: 'none' });
			},
			
			updateUserInfo () {
				let that = this;
				let token = uni.getStorageSync('token');
				
				if ( !token ) 
				{
					uni.navigateTo({
						url: "/pages/user/login",
						fail : function (err) {
							console.log(err);
						}
					});
					return;
				}
				let userInfo = uni.getStorageSync('userInfo');
				if (userInfo) 
				{
					that.userInfo = userInfo;
				}
				that.getUserInfoByToken();
			},//end isLogin()
			getUserInfoByToken () {
				let that = this;
				that.$u.get('/user').then(res => {
					if (res.Code != 1) {
						uni.navigateTo({
							url: "/pages/user/login",
							fail : function (err) {
								console.log(err);
							}
						});
						return;
					}
					
					let userData = {
						avatarUrl : res.Data.Avatar,
						city : res.Data.City,
						country : res.Data.Country,
						gender : res.Data.Gender,
						id : res.Data.ID,
						language : res.Data.Language,
						nickName : res.Data.Nickname,
						province : res.Data.Province,
					}	
					
					uni.setStorageSync('userInfo',userData);
					let userInfo = uni.getStorageSync('userInfo');
					if (userInfo) 
					{
						that.userInfo = userInfo;
					}
				}).catch(e=>{})
			}
		
		}
	}
</script>

<style lang="scss">
page{
	background-color: #ededed;
}

.camera{
	width: 54px;
	height: 44px;
	
	&:active{
		background-color: #ededed;
	}
}
.user-box{
	background-color: #fff;
}
</style>
