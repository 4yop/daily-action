

function isLogin () {
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
}

export {
	isLogin
}