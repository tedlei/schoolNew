/* eslint-disable no-undef */
/* eslint-disable no-control-regex */
import Vue from 'vue'
import axios from 'axios'

Vue.config.productionTip = false;
import { Message, Notification, MessageBox } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// lay-ui 引入
import 'layui-src/src/css/layui.css'
import 'layui-src/src/layui.js'


layui.config({
	version: false, //一般用于更新模块缓存，默认不开启。设为true即让浏览器不缓存。也可以设为一个固定的值，如：201610
	debug: false, //用于开启调试模式，默认false，如果设为true，则JS模块的节点会保留在页面
	base: '' //设定扩展的Lay-ui模块的所在目录，一般用于外部模块扩展
});

// 富文本编辑器
import editorInit from "../../public/js/editor";
import errorPage from "../components/common/error";

const Api = {
	install() {
		// 注册网络请求
		this.prototype.fetch = Api.netWork;

		this.prototype.userInfo = null	// 用户信息
		this.prototype.hideError = true	// 是否隐藏404
		this.prototype.authLogin = false	// 是否开启登陆权限验证
		this.prototype.localtion = 'http://112.74.18.182:9101/cnjy-search-web'  //其他接口ip
		this.prototype.editor = editorInit,  // 富文本编辑器初始化函数

		this.prototype.parse = Api.parse;
		this.prototype.stringify = Api.stringify;
		this.prototype.push = Api.push;
		this.prototype.pop = Api.pop;
		this.prototype.quit = Api.quit;
		this.prototype.getTimer = Api.getTimer;
		this.prototype.getItem = Api.getItem;
		this.prototype.setItem = Api.setItem;
		this.prototype.$message = Api.$message;
		this.prototype.$notify = Api.$notify;
		this.prototype.$msgbox = Api.$msgbox;
		this.prototype.showScroll = Api.showScroll;
		this.prototype.verifyLogin = Api.verifyLogin;
		this.prototype.childRouteJump = Api.childRouteJump;
	},
	netWork: (() => {
		let _this = null;
		let ipList = [
			'http://112.74.18.182:9101/cnjy-search-web/',
			'http://112.74.16.235:9102/cnjy-user-web/',
			'http://112.74.16.235:9103/cnjy-curriculum-web/',
			'http://120.24.45.159:9104/cnjy-school-web/',
			'http://120.24.45.159:9105/cnjy-teacher-web/',
			'http://120.78.145.39:9106/cnjy-chuniao-web/'
		];
		// 网络请求
		axios.defaults.timeout = 20000;
		axios.defaults.validateStatus = function (status) {
			//验证响应状态码=>自定义成功失败规则：状态码以2/3开头算作成功
			let result = /^(2|3)\d{2}$/.test(status);
			if (!result) {
				let errorMsg = '';
				switch (status) {
					case 404:
						errorMsg = '网址错误';
						break;
					default:
						errorMsg = '请求失败';
				}
				throw new Error(errorMsg + '， 错误码为：' + status);
			}
			//判断用户是否登陆，201：未登录
			if (status === 201) {
				_this.verifyLogin({
					message: '未登陆，请先登陆！',
					url: 'http://127.0.0.1:8080/#/loginAndRegister'
				}, false)
			}
			if (status === 202) {
				_this.$message({ message: '您的学校账户状态异常，请重新登陆！', type: 'warning' })
			}
			return result;
		};
		return function (params, id, isImage) {
			_this = this;
			if (typeof id === 'undefined') id = 1;
			axios.defaults.baseURL = typeof id === 'string' ? id : ipList[id - 1];

			// 是否为图片上传
			if (isImage) {
				axios.defaults.headers = { 'Content-Type': 'multipart/form-data' };
			} else {
				axios.defaults.headers = { 'Content-Type': 'application/json;charset=UTF-8' };    //设置请求头
			}
			
			let url = params;
			if (/^\//.test(url)) params.url = url.slice(1);

			let userInfo = _this.getItem('userInfo');    //所有接口都需要传的值
			let data = params.data;
			if (userInfo) {
				data.phone = userInfo.user.phone;
				data.schoolId = userInfo.schoolUser.id;
			}
			if (params.method === 'get') {
				if (data) {
					Object.keys(data).forEach((key, i) => {
						if (!i) params.url += "?";
						if (i < 1) params.url += key + '=' + data[key];
						else params.url += '&' + key + '=' + data[key];
					});
					data = {};
				}
			}
			return axios(params);
		};
	})(),
	// 序列化
	parse(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	stringify(obj) {
		return JSON.stringify(obj);
	},
	// 路由跳转
	push(param) {
		this.$router.push(param);
	},
	// 返回
	pop() { this.$router.go(-1) },
	// 退出
	quit() {
		// 清除本地所有数据
		window.localStorage.clear();
		this.fetch({
			url: '/logout.do',
			method: 'get',
			data: { username: phone }
		}, 2, () => { });
		setTimeout(() => {
			location.href = 'http://127.0.0.1:8080/#/index';
		}, 2000)
	},
	getTimer() {
		function double(val) {
			if (val < 10) val = '0' + val;
			return val;
		}
		let nowTimer = new Date(),
			year = double(nowTimer.getFullYear()),
			month = double(nowTimer.getMonth() + 1),
			date = double(nowTimer.getDate()),
			hours = double(nowTimer.getHours()),
			minutes = double(nowTimer.getMinutes()),
			seconds = double(nowTimer.getSeconds());

		return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
	},
	getItem(name) {
		let result = window.localStorage.getItem(name);
		if (name !== 'userInfo' && result) {
			result = result.split('&&id&&');
			// 当不为userInfo时 判断是否为当前用户数据 真则获取 假则返回null
			// console.log(result[1], this.getItem('userInfo').user.phone, 9595)
			if (result[1] === this.getItem('userInfo').user.phone) {
				result = result[0];
			} else {
				return null;
			}
		}
		return JSON.parse(result);
	},
	setItem(name, value) {
		value = JSON.stringify(value);
		if (name !== 'userInfo') { // 将本地数据与用户绑定
			value = value + '&&id&&' + this.getItem('userInfo').user.phone;
		}
		window.localStorage.setItem(name, value);
	},
	$message(msg) {
		if (!msg.duration) {
			Object.assign(msg, { duration: 2000 })
		}
		Message(msg);
	},
	$notify(msg) {
		Notification(msg)
	},
	$msgbox(msg) {
		return MessageBox(msg);
	},
	/**
	 * @param refName*    Object    ref值
	 * @param boole        boolean    是否减去导航栏右侧主内容内边距
	 * @param reduce    Number    自定义需减少值
	 * @param isMaxHeight	boolean  是否设置max-height
	 */
	showScroll(refName, boole, reduce, isMaxHeight) {
		let w = screen.width;
		w = Math.max(1440, w);

		// 头部高度
		w = 80 / 1920 * w;
		// 导航栏右侧主内容内边距
		let padding = getComputedStyle(document.querySelector('.main_select')).paddingTop.substring(0, 2) * 1;

		reduce = reduce || 0;
		w = (boole ? (w + padding * 2) : w) + reduce;

		this.$refs[refName].style.height = `calc(100vh - ${w}px)`;
		if (isMaxHeight) this.$refs[refName].style.maxHeight = `calc(100vh - ${w}px)`;
	},

	/**
	 * @param param.message	提示信息
	 * @param param.url		跳转的url
	 * @param result		Boolean or Function: 函数返回值为Boolean
	 */
	verifyLogin(param, result) {
		// 未登陆跳转到登录页
		result = typeof result === 'function' ? result() : result;

		if (!result) {
			this.$msgbox({
				message: param.message,
				beforeClose: (action, instance, done) => {
					instance.confirmButtonLoading = true;
					instance.confirmButtonText = '跳转中...';
					setTimeout(() => {
						// 跳转到登录页
						window.location.href = param.url;
						done();
						setTimeout(() => {
							instance.confirmButtonLoading = false;
						}, 300);
					}, 1000);
				}
			});
		}
	},
	/**
	 * url 跳转的子路由
	 */
	childRouteJump(url) {
		this.push(this.$route.fullPath.replace('?', '/' + url + '?'))
	}
}


const mixins = new class Mixins {
	install() {
		Vue.mixin({
			components: { errorPage },
			created() {
				this.userInfo = this.getItem('userInfo');
			}
		})
	}
}

export {Api, mixins }
