/**
 * 无限次调用异步函数，只执行一次，并且以promise形式返回执行结果
 * 用法：AsyncOnce.call(函数名, 函数参数, 是否启用严格模式).then(res => {}).catch(err => {})
 * 
 * @author laravuel<45761113@qq.com>
 */
 
class AsyncOnce {
	/**
	 * 调用某个函数，并等待执行结果
	 * 
     * @param {function} func 函数名称
     * @param {array} args 函数参数
     * @param {boolean} strict 是否启用严格模式（根据参数的不同来决定是否等待异步结果）  
	 * 
	 * @return {Promise}
	 */
	static async call(func, args, strict = false) {
		// 检测要执行的函数是否已经存在
		let index = AsyncOnce.funcs.findIndex(item => {
			if (strict) {
				return item.func == func && item.args == args;
			} else {
				return item.func == func;
			}
		});

		if (index == -1) {
			AsyncOnce.funcs.push({
				running: false,
				func,
				args,
				success: null,
				fail: null,
			});
			index = AsyncOnce.funcs.length - 1;
		}
		return new Promise(async (resolve, reject) => {
			let item = AsyncOnce.funcs[index];
			// 函数未执行状态
			if (!item.running) {
				item.running = true;
				await item.func(...item.args).then(res => {
					item.success = res;
					item.running = false;
					resolve(res);
				}).catch(err => {
					item.fail = err;
					item.running = false;
					reject(err);
				})
				// 删除该函数的相关执行数据
				AsyncOnce.funcs.splice(index, 1);
			} else {
				setInterval(() => {
					if (item.running == false) {
						if (item.fail) {
							reject(item.fail);
						} else if (item.success) {
							resolve(item.success)
						}
					}
				}, 1)
			}
		});
	}
}

AsyncOnce.funcs = [];

export default AsyncOnce;
