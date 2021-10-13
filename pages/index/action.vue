<template>
	<view class="u-demo">
		<view class="u-demo-wrap">
			<view class="u-demo-title">{{userInfo.nickName}}</view>
			<view class="u-demo-area">
				<u-avatar
					:mode="img.mode"
					:size="img.size"
					:src="userInfo.avatarUrl"
					:text="text"
					:showLevel="img.showLevel"
					:showSex="img.showSex"
					:sexIcon="img.sexIcon"
					:bgColor="img.bgColor"
				></u-avatar>
			</view>
			
		</view>
		<view class="u-demo-area">
			<u-alert-tips
				
				:closeAble="tip.closeAble"
				:show="tip.show"
				
				:type="tip.type"
				:title="tip.title"
				:description="tip.description"
				:showIcon="tip.showIcon"
			></u-alert-tips>
		</view>
	</view>
</template>

<script>
	import {isLogin} from "../../common/userService.js"	
export default {
	data() {
		return {
			img: {
				mode: 'circle',
				src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
				text: '', // 优先级比src高
				size: '90',
				showLevel: false,
				showSex: true,
				sexIcon: 'man',
				bgColor: '#fcbd71'
			},
			tip: {
				title: '操作结果',
				description: '获取中...',
				show: true,
				closeAble: false,
				showIcon: false,
				type: 'warning'
			},
			userInfo : {
				avatarUrl : "http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg",
				nickName : "",
			}
		};
	},
	onLoad(option) {
		wx.hideShareMenu()
		isLogin();
		let that = this;
		that.updateUserInfo();
		let placeId = parseInt(option.id);
		if (placeId < 1) {
			uni.showToast({ title: '缺少参数', icon: 'none' });
			return;
		}
		that.userAction(placeId);
	},
	methods: {
		
		userAction (placeId) {
			let that = this;
			that.$u.post('/user/action',{place_id:placeId}).then(res => {
				if (res.Msg) 
				{
					that.tip.description = res.Msg + (res.Data != null ? ","+res.Data : "")
				}
			})
		},//******end userAction()**********
		
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
};
</script>

<style lang="scss" scoped></style>
