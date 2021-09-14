<template>
	<view class="wrap">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="errorType">
			<u-form-item :label-position="labelPosition" label="地点" prop="place_name">
				<u-input :border="border" :maxlength="20" placeholder="请输入地点" v-model="model.place_name" type="text"></u-input>
			</u-form-item>
			
			<u-form-item :label-position="labelPosition" label="简介" prop="desc">
				<u-input type="textarea" :maxlength="50" :border="border" placeholder="请填写简介" v-model="model.desc" />
			</u-form-item>
		</u-form>
		
		<u-button @click="submit">提交</u-button>
		
	</view>
</template>

<script>
export default {
	data() {
		let that = this;
		return {
			model: {
				place_name: '',
				desc:'',
				id : 0,
			},
			
			rules: {
				place_name: [
					{
						required: true,
						message: '请输入地点',
						trigger: 'blur' ,
					},
				],
				
				
				desc: [
					{
						required: true,
						message: '请填写简介'
					},
				],
			},
			border: true,
			labelPosition: 'top',
			
		};
	},
	onLoad(option) {
		isLogin();
		let that = this;
		that.model.id = parseInt(option.id)
		uni.setNavigationBarTitle({
		　　title:that.model.id == 0 ? "添加" : "编辑"
		});
		that.getPlaceById();
	},
	computed: {
		borderCurrent() {
			return this.border ? 0 : 1;
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		submit() {
			let that = this;
			this.$refs.uForm.validate(valid => {
				if (valid) {
					that.savePlace();
					console.log('验证通过');
				} else {
					console.log('验证失败');
				}
			});
		},
		
		getPlaceById () {
			let that = this;
			if (that.model.id < 1) 
			{
				return;
			}
			that.$u.post('/place', {id:that.model.id}).then(res => {
				if (res.Code != 1) 
				{
					uni.showToast({ title: res.Msg, icon: 'none' });
					return
				}
				if (!res.Data) 
				{
					return;
				}
				that.model.id = res.Data.ID;
				that.model.desc = res.Data.Desc;
				that.model.place_name = res.Data.PlaceName;
			})
		},//**********end getPlaceById()*********
		
		savePlace () {
			let that = this
			that.$u.post('/place/save', that.model).then(res => {
				uni.showToast({ title: res.Msg, icon: 'none' });
				if (res.Code != 1) {
					return ;
				}
				setTimeout(function  () {
					uni.switchTab({
						url: "/pages/place/index",
						fail : function (err) {
							console.log(err);
						}
					})
				},1000);
				
			})
		},
	}
};
</script>

<style scoped lang="scss">
.wrap {
	padding: 30rpx;
}

.agreement {
	display: flex;
	align-items: center;
	margin: 40rpx 0;

	.agreement-text {
		padding-left: 8rpx;
		color: $u-tips-color;
	}
}
</style>
