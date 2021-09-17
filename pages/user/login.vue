<template>
	<view class="wrap">
		<view class="top"></view>
		<view class="content">
			<view class="title">欢迎登录</view>

			<button open-type="getUserInfo" lang="zh_CN" @getuserinfo="appLoginWx" class="getCaptcha">小程序登录授权</button>
		</view>
		<view class="buttom">
			<view class="hint">
				登录代表同意
				<text class="link">用户协议、隐私政策，</text>
				并授权使用您的账号信息（如昵称、头像、收获地址）以便您统一管理
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	
	onShow() {
		let that = this;
		that.isLogin();
	},
	
	computed: {
		mounted(){
		   
		}
		
	},
	methods: {
		submit() {},

		//******start appLoginWx()***********
		appLoginWx() {
			let that = this;
			// #ifdef MP-WEIXIN
			uni.getProvider({
				service: 'oauth',
				success: function(res) {
					if (~res.provider.indexOf('weixin')) {
						uni.login({
							provider: 'weixin',
							success: res2 => {
								
								// that.getUserProfile();
								
								
								uni.showModal({
									title: '温馨提示',
									content: '亲，授权微信登录后才能正常使用小程序功能',
									success(res) {
										console.log("getUserProfile start 222");
										uni.getUserProfile({
											desc : "用于完善会员资料",
											lang : "zh_CN",
											success : function (info) {
												console.log(res)
												that.$u.post('/login', {
													code: res2.code,
													rawData : info.rawData,
													signature : info.signature,
												}).then(res => {
													if (res.Code != 1) {
														uni.showToast({ title: res.Msg, icon: 'none' });
														return ;
													}
													uni.setStorageSync('token',res.Data.token)
													console.log(res)
													that.loginSuccess(info.userInfo);
												}).catch(e=>{})
											},//end success callback()
											fail : function (err) {
												console.log(err)
												console.log(err)
												uni.showToast({ title: '微信登录授权失败', icon: 'none' });
											},//end fail callback() 
											complete : function () {
												console.log("getUserProfile complete");
											},//end complete callback()
										});
									}
								})
								
								return;
								
								uni.getUserInfo({
									provider: 'weixin',
									success: info => {
										//这里请求接口
										console.log(res2);
										
										that.$u.post('/login', {
											code: res2.code,
											rawData : info.rawData,
											signature : info.signature,
										}).then(res => {
											if (res.Code != 1) {
												uni.showToast({ title: res.Msg, icon: 'none' });
												return ;
											}
											uni.setStorageSync('token',res.Data.token)
											console.log(res)
											that.loginSuccess(info.userInfo);
										}).catch(e=>{})
										
										
										console.log(info);
										console.log(info.userInfo);
										
									},
									fail: (err) => {
										console.log(err)
										uni.showToast({ title: '微信登录授权失败', icon: 'none' });
									}
								});
							},
							fail: (err) => {
								console.log(err)
								uni.showToast({ title: '微信登录授权失败2', icon: 'none' });
							}
						});
					} else {
						uni.showToast({
							title: '请先安装微信或升级版本',
							icon: 'none'
						});
					}
				}
			});
			//#endif
		}, //******end appLoginWx()***********
		
		getUserProfile () {
			uni.showModal({
				title: '温馨提示',
				content: '亲，授权微信登录后才能正常使用小程序功能',
				success(res) {
					console.log("getUserProfile start 1111");
					uni.getUserProfile({
						desc : "用于完善会员资料",
						lang : "zh_CN",
						success : function (res) {
							console.log(res)
						},//end success callback()
						fail : function (err) {
							console.log(err)
						},//end fail callback() 
						complete : function () {
							console.log("getUserProfile complete");
						},//end complete callback()
					});
				}
			})
		},//end getUserProfile()
		
		
		isLogin () {
			let token = uni.getStorageSync('token');
			if ( token ) 
			{
				uni.navigateBack();
				// uni.switchTab({
				// 	url: "/pages/user/index",
				// 	fail : function (err) {
				// 		console.log(err);
				// 	}
				// })
			}
		},//end isLogin()
		
		
		loginSuccess (userInfo) {
			let that = this;
			if (!userInfo) 
			{
				uni.showToast({ title: '微信登录失败', icon: 'none' });
				return;
			}
			try {
				uni.setStorageSync('userInfo', userInfo);
				uni.showToast({ title: '微信登录授权成功', icon: 'none' });
				that.isLogin();
			} catch (e) {
			    // error
				console.log(e);
				uni.showToast({ title: '微信登录状态保存失败', icon: 'none' });
			}
		},//end loginSuccess()
		
	}
};
</script>

<style lang="scss" scoped>
.wrap {
	font-size: 28rpx;
	.content {
		width: 600rpx;
		margin: 80rpx auto 0;

		.title {
			text-align: left;
			font-size: 60rpx;
			font-weight: 500;
			margin-bottom: 100rpx;
		}
		input {
			text-align: left;
			margin-bottom: 10rpx;
			padding-bottom: 6rpx;
		}
		.tips {
			color: $u-type-info;
			margin-bottom: 60rpx;
			margin-top: 8rpx;
		}
		.getCaptcha {
			background-color: rgb(253, 243, 208);
			color: $u-tips-color;

			color: rgb(255, 255, 255);
			background-color: rgb(255, 153, 0);
			border: none;
			font-size: 30rpx;
			padding: 12rpx 0;

			&::after {
				border: none;
			}
		}
		.alternative {
			color: $u-tips-color;
			display: flex;
			justify-content: space-between;
			margin-top: 30rpx;
		}
	}
	.buttom {
		.loginType {
			display: flex;
			padding: 350rpx 150rpx 150rpx 150rpx;
			justify-content: space-between;

			.item {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: $u-content-color;
				font-size: 28rpx;
			}
		}

		.hint {
			padding: 20rpx 40rpx;
			font-size: 20rpx;
			color: $u-tips-color;

			.link {
				color: $u-type-warning;
			}
		}
	}
}
</style>
