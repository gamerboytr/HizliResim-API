/**
 * HızlıResim Unofficial API By GamerboyTR
 * Licensed under the MIT license
 */
const { post, get } = require("axios");
const HizliResimRequestException = require("./Exceptions/HizliResimRequestException");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");

const Options = {
	FLAGS: {
		OVERWRITE: 0,
	},
};

const Retention = {
	FLAGS: {
		INFINITE: 0,
		ONE_DAY: 1,
		THREE_DAYS: 3,
		ONE_WEEK: 7,
		TWO_WEEK: 14,
		ONE_MONTH: 30,
	},
};

/**
 * HızlıResim Unofficial API
 *
 * @author GamerboyTR
 * @version 1.0.0
 * @license MIT
 * @copyright 2022 GamerboyTR
 */
class HizliResim {
	/**
	 * Upload image
	 *
	 * @param {String} file Filename
	 * @param {String} description Description
	 * @param {String|CallableFunction} password [optional] Password or CallableFunction
	 * @param {int|CallableFunction} retention [optional] Retention or CallableFunction
	 * @param {CallableFunction} callback [optional] Callback
	 *
	 * @returns {Promise<JSON>} JSON
	 */
	async upload(file, description, password = "", retention = Retention.FLAGS.INFINITE, callback = null) {
		const data = new FormData();
		const { csrf, cookie } = await this.getCsrfToken();

		callback = typeof password === "function" ? password : typeof retention === "function" ? retention : callback;
		password = typeof password === "function" ? "" : password;
		retention = typeof retention === "function" ? Infinity : retention;
		if (!fs.existsSync(file)) throw new HizliResimRequestException("File not found");

		data.append("file[]", fs.createReadStream(file));
		data.append("not", description);
		data.append("image-retention-time", retention === Retention.FLAGS.INFINITE ? "" : retention);
		data.append("image-password", password);

		return new Promise((resolve, reject) => {
			post("https://www.hizliresim.com/image-upload", data, {
				headers: {
					"Content-Type": data.getHeaders()["content-type"],
					"x-csrf-token": csrf,
					Cookie: cookie,
				},
			})
				.then(response => {
					let data = response.data;
					if (data.type === "upload-success")
						get(response.data.url, {
							headers: {
								Cookie: this.parseCookie(response.headers["set-cookie"]),
							},
						})
							.then(response => {
								let code = response.data.match(/<input required="required" type="email" name="email" id="web-.*" class="input" value="https:\/\/www\.hizliresim\.com\/(.*)" onclick="this\.select\(\);">/)[1];
								if (callback && typeof callback === "function") callback({ code, url: `https://www.hizliresim.com/${code}`, imageUrl: `https://i.hizliresim.com/${code}${path.extname(file)}` });
								resolve({ code, url: `https://www.hizliresim.com/${code}`, imageUrl: `https://i.hizliresim.com/${code}${path.extname(file)}` });
							})
							.catch(err => reject(new HizliResimRequestException(err)));
					else if (data.type.startsWith("error-")) return reject(new HizliResimRequestException(data.msg));
					else return reject(new HizliResimRequestException(data));
				})
				.catch(err => reject(new HizliResimRequestException(err)));
		});
	}

	/**
	 * Get image
	 *
	 * @param {string} code Image code
	 * @param {string} fileName File name
	 * @param {CallableFunction} callback [optional] Callback
	 * @param {Array} options [optional] Options
	 *
	 * @returns {Promise<String>} FileName
	 */
	getImage(code, fileName, callback = null, options = []) {
		if (fs.existsSync(fileName) && !options.includes(Options.FLAGS.OVERWRITE)) throw new HizliResimRequestException("File already exists");
		return new Promise((resolve, reject) => {
			get(`https://www.hizliresim.com/${code}`)
				.then(response => {
					let ext = response.data.match(new RegExp(`<a class="fancybox" data-fancybox="gallery" href="https?:\/\/i\.hizliresim.com\/${code}\.(.*)">`))[1];
					get(`https://i.hizliresim.com/${code}.${ext}`, { responseType: "stream" })
						.then(response => {
							response.data.pipe(fs.createWriteStream(`${fileName}.${ext}`));
							if (callback && typeof callback === "function") callback(`${fileName}.${ext}`);
							resolve(`${fileName}.${ext}`);
						})
						.catch(err => reject(new HizliResimRequestException(err)));
				})
				.catch(err => reject(new HizliResimRequestException(err)));
		});
	}

	/**
	 * Get CSRF Token
	 *
	 * @returns {Promise<JSON>} JSON
	 */
	getCsrfToken() {
		return new Promise((resolve, reject) => {
			get("https://hizliresim.com/")
				.then(response => resolve({ csrf: response.data.match(/<meta name="csrf-token" content="(.*)?" \/>/)[1], cookie: this.parseCookie(response.headers["set-cookie"]) }))
				.catch(err => reject(new HizliResimRequestException(err)));
		});
	}

	/**
	 * Parse CSRF Cookie
	 *
	 * @param {array} cookie Cookie
	 *
	 * @returns {string} Cookie
	 */
	parseCookie(cookie) {
		const raw = cookie.join("; ").split("=").join("; ").split("; ");
		return raw[0] + "=" + raw[1] + "; " + raw[11] + "=" + raw[12] + ";";
	}
}

module.exports.Options = Options;
module.exports.Retention = Retention;
module.exports.Client = HizliResim;
