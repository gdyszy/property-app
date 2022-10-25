const QueryAuth = {
	data(){
		return {
			authList:[]
		}
	},
	created() {
	},
	computed: {
		
	},
	watch: {
	},
	
	methods:{
		//查询权限
		queryAuth(authType) {
			let _self = this;
			this.request({
				url: '/mobile/auth',
				method: 'get',
				data: {
					handler: authType
				},
			}).then((res) => {
				_self.authList = res.data.data
			
			})
		}
	}
	
}

export default QueryAuth