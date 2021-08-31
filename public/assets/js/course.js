let vmCourse1 = new Vue({
    el: "#course",
    data: {
        courseDescription: {},
        params: {
            lang: 'ua',
            courseName: '',
        },


        sendFlag: false,
        error: 'Помилка при зміні даних',
        success: 'Дані змінено вдало',
        editResult: '',
        errorFlag: false,
        successFlag: false,
    },
    created() {
        this.getParams();
        this.getData("/v1/getCourse")
    },
    methods: {
        getData(url) {
            let req = new XMLHttpRequest()
            let params = 'courseName=' + this.params.courseName + '&lang=' + this.params.lang;
            req.responseType = 'json';
            req.open("POST", url)
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            req.onreadystatechange = function () {
                if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
                    // console.log('req => ', req.response);
                    // console.log('params => ', params);
                    this.setData(req);
                }
            }.bind(this)
            req.send(params)

        },
        setData(req) {
            this.courseDescription = req.response
            this.courseDescription.description = JSON.parse(this.courseDescription.description)
            // console.log(this.courseDescription)
            let title = document.getElementById('title');
            title.innerText = this.courseDescription.title;
        },
        getParams() {
            let url = window.location.href
            let params = url.split('/')
            this.params.courseName = params[params.length - 1].split('?')[0]
            // this.params.courseName = params[params.length - 1]
        },

        sendData(data) {
            let req = new XMLHttpRequest()
            req.responseType = 'json';
            req.open("POST", '/v1/setCoursePage')
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            req.onreadystatechange = function () {
                if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
                    // console.log("response => ", req.response)
                    if (req.response === "success") {
                        this.successFlag = true;
                        this.editResult = this.success;

                    }
                    if (req.response === "unsuccess") {
                        this.errorFlag = true;
                        this.editResult = this.error;
                    }
                    this.removeEditFlags()
                }
            }.bind(this)
            // console.log('send-->',data)
            req.send(data)
        },
        edit() {
            if (this.sendFlag === false) {
                this.sendFlag = true
                // console.log('before stringify:',this.courseDescription)

                let data = JSON.stringify(this.courseDescription)
                // let data = JSON.stringify({a: '&dagger; a'})
                let sendData = 'data=' + data
                // console.log(sendData)
                sendData = sendData.replace(/</g, '\\u003c')
                    .replace(/>/g, '\\u003e')
                    .replace(/&amp;/g, '\\u0026')
                    .replace(/&/g, '\\u0026')
                    .replace(/\\n/g, '')
                    .replace(/\+/g, '\\u002B')
                // console.log('after stringify:',sendData)++
                // console.log("sendData", sendData)
                // console.log("sendData", encodeURI(sendData))
                this.sendData(sendData)
            }
        },
        removeEditFlags() {
            let a = setInterval(function () {
                this.sendFlag = false
                this.successFlag = false;
                this.errorFlag = false;
                this.editResult = '';

                clearInterval(a);
            }.bind(this), 7000)
        }
    }
})