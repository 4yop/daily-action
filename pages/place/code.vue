<template>
	<view class="u-demo">
		<view class="u-demo-wrap">
			<!-- <view class="u-demo-title">演示效果</view> -->
			<view class="u-demo-area">
				<u-avatar :mode="img.mode" :size="img.size" :src="img.src" :text="img.text" :showLevel="img.showLevel" :showSex="img.showSex" :bgColor="img.bgColor"></u-avatar>
			</view>
		</view>

		<view class="u-demo-wrap">
			<view class="u-demo-area">
				<u-button
					@click="saveFile"
					data-name="3333"
					:loading="btn.loading"
					:plain="btn.plain"
					:shape="btn.shape"
					:size="btn.size"
					:ripple="btn.ripple"
					:hairLine="btn.hairLine"
					:type="btn.type"
				>
					保存
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			img: {
				mode: 'square',
				src: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2119_s.jpg',
				text: '', // 优先级比src高
				size: '430',
				showLevel: false,
				showSex: false,
				bgColor: '#fcbd71'
			},

			btn: {
				hairLine: true,
				type: 'success',
				size: 'default',
				shape: 'square',
				plain: false,
				ripple: false,
				loading: false
			}
		};
	},
	onLoad(option) {
		let that = this;
		let placeId = parseInt(option.id);
		if (placeId < 1) {
			uni.showToast({ title: '缺少参数', icon: 'none' });
			return;
		}
		that.getPlaceWxCode(placeId);
	},
	methods: {
		getPlaceWxCode(placeId) {
			let that = this;
			that.$u.get('/place/code', { id: placeId }).then(res => {
				if (res.Code != 1) {
					uni.showToast({ title: res.Msg, icon: 'none' });
					return;
				}
				if (res.Data) {
					that.img.src = res.Data;
				}
			});
		}, //********end getPlaceWxCode()************

		saveFile() {
			this.$u.toast('按钮被点击');
			this.getSettingFun();
			this.dlFile("image");
		}, //********end saveFile()************

		getSettingFun() {
			wx.getSetting({
				success(res) {
					if (!res.authSetting['scope.writePhotosAlbum']) {
						wx.authorize({
							scope: 'scope.writePhotosAlbum',
							success() {
								console.log('授权成功');
							}
						});
					}
				}
			});
		}, //********end getSettingFun()************

		//2. 保存图片/视频到本地

		dlFile(type) {
			let url = null;
			let api = null;
			// 保存视频到本地
			// if (type == 'video') {
			// 	url = this.src.url;
			// 	api = 'saveVideoToPhotosAlbum';
			// }
			// 保存图片到本地
			if (type == 'image') {
				url = this.img.src;
				api = 'saveImageToPhotosAlbum';
			}

			uni.showLoading({
				title: '加载中..'
			});
			wx.downloadFile({
				url, //图片地址
				success: res => {
					console.log(res);
					//图片保存到本地
					// saveVideoToPhotosAlbum
					wx[api]({
						filePath: res.tempFilePath,
						success: data => {
							wx.hideLoading();
							wx.showModal({
								title: '提示',
								content: type == 'video' ? '短视频保存成功~' : '保存成功,去打印再贴门后吧',
								showCancel: false
							});
							this.$refs.uToast.close();
						},
						fail: err => {
							if (err.errMsg === api + ':fail:auth denied' || err.errMsg === api + ':fail auth deny' || err.errMsg === api + ':fail authorize no response') {
								// 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
								wx.showModal({
									title: '提示',
									content: '需要您授权保存相册',
									showCancel: false,
									success: modalSuccess => {
										wx.openSetting({
											success(settingdata) {
												console.log('settingdata', settingdata);
												if (settingdata.authSetting['scope.writePhotosAlbum']) {
													wx.showModal({
														title: '提示',
														content: '获取权限成功,再次点击保存即可保存',
														showCancel: false
													});
												} else {
													wx.showModal({
														title: '提示',
														content: '获取权限失败，将无法保存到相册哦~',
														showCancel: false
													});
												}
											},
											fail(failData) {
												console.log('failData', failData);
											},
											complete(finishData) {
												console.log('finishData', finishData);
											}
										});
									}
								});
							}
						},
						complete(res) {
							wx.hideLoading();
						}
					});
				}
			});
			setTimeout(() => {
				uni.hideLoading();
			}, 5000);
		},//**********end dlfile**************
	}
};
</script>

<style lang="scss" scoped>
.box {
	padding: 30rpx;
}

.box /deep/ button {
	margin-bottom: 40rpx;
}
</style>
