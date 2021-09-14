<template>
	<view class="">
		<view class="u-demo-wrap" v-if="placeList.length < 10">
			<u-button @click="toSavePlace">添加</u-button>
		</view>
		<view class="u-card-wrap">
			
			
			<u-card v-for="(val,index) in placeList" @click="showAction(val.ID)" @head-click="showAction(val.ID)" :title="val.PlaceName" :sub-title="timeFormat(val.CreatedAt.Time)"  :padding="padding" :border="border">
				<view class="" slot="body"> 
					<view class="u-body-item u-flex u-border-bottom u-col-between u-p-t-0">
						<view class="u-body-item-title u-line-2">
							<u-tag  text="默认"
									type="error" 
									shape="square" 
									mode="light" 
									show="true" 
									size="default" 
									v-if="val.IsDefault==1"
							/>
							{{val.Desc}}
							
						</view>
					</view>
				</view>
				
			</u-card>
			
			
			
			
			
		</view>
		
		<u-action-sheet :cancel-btn="cancel" :mask-close-able="maskClick" :tips="tips"
		@click="click" :list="list" v-model="show" :safe-area-inset-bottom="true"></u-action-sheet>
	</view>
</template>

<script>
	import {isLogin} from "../../common/userService.js"	
	export default {
		data() {
			return {
				
				placeList : {
					
				},
				
				
				padding: 20,
				bottomSlot: false,
				border: false,
				
				
				list: [
					{
						text: '生成关门码'
					},
					{
						text: '设为默认'
					},
					{
						text: '修改'
					},
					{
						text: '删除'
					},
				],
				tips: {
					text: ''
				},
				show: false,
				cancel: true,
				maskClick: true,
				placeId :0,
			}
		},
		
		onShow() {
			isLogin()
			let that = this;
			that.getPlaceList();
		},
		
		methods: {
			timeFormat(time) {
				return this.$u.timeFormat(time, "yyyy-mm-dd");
			},
			getPlaceList () {
				let that = this
				that.placeList = uni.getStorageSync("placeList")
				that.$u.post('/place/list').then(res => {
					if (res.Code != 1) {
						uni.showToast({ title: res.Msg, icon: 'none' });
					}else{
						that.placeList = res.Data;
						uni.setStorage({
							key: 'placeList',
							data: res.Data,
						})
					}
				})
			},
			
			toSavePlace () {
				let that = this;
				if (that.placeList.length >= 10) 
				{
					uni.showToast({ title: "最多10条,因为开发者懒得做分页加载功能!!", icon: 'none' });
					return;
				}
				
				uni.navigateTo({
					url : "/pages/place/save?id="+0
				})
			},
			
			showAction(id) {
				this.show = true;
				this.placeId = id;
			},
			click(index) {
				console.log(index)
				if (this.placeId == 0) {
					return;
				}
				if (index == 2) {
					this.updatePlace();
				}else if (index == 3) {
					this.delPlace();
				}else if (index == 1) {
					this.setDefaultPlace()
				}else if (index == 0) {
					this.toPaceCodePage()
				}
			},//
			
			toPaceCodePage () {
				let that = this;
				uni.navigateTo({
					url: "/pages/place/code?id="+that.placeId
				})
			},//**********end toPaceCodePage()*************
			
			
			
			
			delPlace () {
				let that = this;
				uni.showModal({
				    title: '提示',
				    content: '您确定要删除?',
				    success: function (res) {
				        if (res.cancel) {
				            return;
				        }
						that.$u.post('/place/del',{id:that.placeId}).then(res => {
							if (res.Code != 1) {
								uni.showToast({ title: res.Msg, icon: 'none' });
							}else{
								that.getPlaceList();
							}
						})
				    }
				});
			},//*******end delPlace************
			
			setDefaultPlace () {
				let that = this;
				
				that.$u.post('/place/default',{id:that.placeId}).then(res => {
					uni.showToast({ title: res.Msg, icon: 'none' });
					if (res.Code != 1) {
						return;
					}else{
						
						that.getPlaceList();
					}
				})
			},//*******end setDefaultPlace()************
			
			
			updatePlace () {
				let that = this;
				uni.navigateTo({
					url : "/pages/place/save?id="+that.placeId
				})
			},//*******end updatePlace************
			
		}
	}
</script>

<style scoped lang="scss">
	.u-demo {
		padding-top: 0;
	}
	
	.u-card-wrap { 
		background-color: $u-bg-color;
		padding: 1px;
	}
	
	.u-body-item {
		font-size: 32rpx;
		color: #333;
		padding: 20rpx 10rpx;
	}
		
	.u-body-item image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
	}
</style>
