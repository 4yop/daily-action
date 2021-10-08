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
				<view class="u-font-14 u-tips-color">ID:{{userInfo.id}}</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="scan" @click="scanCode()" color="#969799" size="28"></u-icon>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right"  color="#969799" size="28"></u-icon>
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
			<u-cell-group>
				<u-cell-item @click="pubWxMsg"  icon="setting" title="开启提醒"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<!-- <u-cell-group>
				<u-cell-item @click="noHas"  icon="setting" title="设置"></u-cell-item>
			</u-cell-group> -->
			<u-cell-group>
				<u-cell-item @click="showHelp"  icon="setting" title="使用说明"></u-cell-item>
			</u-cell-group>
		</view>
		
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item @click="loginOut"  icon="setting" title="退出登录"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
				show:true,
				userInfo : {},
				tmplIds : [],
			}
		},
		onShow() {
			let that = this
			that.updateUserInfo();
		},
		onLoad() {
			this.getTmpIds();
		},
		methods: {
			
			sCanCode () {
				wx.scanCode({
				  onlyFromCamera: true,
				  success(res) {
				    console.log(res)
				  },
				  fail(res) {
					console.log(res)  
				  }
				})
			}, // end sCanCode
			
			getTmpIds () {
				let that = this;
				that.$u.get('/tmp_ids').then(res => {
					if (res.Code == 1)
					{
						console.log(res)
						that.tmplIds = res.Data
					}
				})
			},//end getTmpIds()
			
			pubWxMsg () {
				let that = this;
				if (that.tmplIds.length < 1) 
				{
					return;
				}
				wx.requestSubscribeMessage({
					tmplIds: that.tmplIds,
					success (res) {
						console.log(res)
						
						let titles = {
							accept : "订阅成功",
							reject : "拒绝订阅",
							ban : "消息后台封禁",
							filter : "消息后台过滤",
						};
						
						for(let i in that.tmplIds) 
						{
							let r = res[that.tmplIds[i]]
							console.log(r)
							console.log(titles[r])
							uni.showToast({
								title: titles[r],
								duration: 2000,
								icon : 'none',
							});
						}
					},
					fail (res) {
						
						res.errCode;
						
						let errCodes = {
							10001 : '参数传空了',
							10002 : '请求消息列表失败',
							10003 : '订阅请求发送失败',
							10004 : '参数类型错误',
							10005 : '无法展示UI',
							20001 : '没有模板数据',
							20002 : '有一次性又有永久',
							20003 : '消息数量上限',
							20004 : '用关闭了主开关',
							20005 : '小游戏被禁封',
						};
						
						uni.showToast({
							title: errCodes[res.errCode],
							duration: 2000,
							icon : 'none',
						});
					},
				});
			},
			
			loginOut () {
				let that = this;
				that.$u.post('/user/loginout').then(res => {
					if (res.Code == 1)
					{
						uni.removeStorageSync('token');
						uni.removeStorageSync('userInfo');
						uni.navigateTo({
							url: "/pages/user/login",
							fail : function (err) {
								console.log(err);
							}
						});
					}
				})
			},//end  loginOut()
			
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
						uni.removeStorageSync('token');
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
