let vmIndex1 = new Vue({
    el: "#courses",
    data: {
        cats: {},
        coursesFlag: false,
        mainPageFlag: false,
        sendFlag: false,
        error: 'Помилка при зміні даних',
        success: 'Дані змінено вдало',
        editResult:'',
        errorFlag: false,
        successFlag: false,
    },
    created() {
        this.getData("/v1/getMainPage")
    },
    methods: {
        getData(url) {
            let req = new XMLHttpRequest()
            req.responseType = 'json';
            req.open("POST", url)
            req.onreadystatechange = function () {
                if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
                    // console.log("mainPage => ", req.response)
                    this.setData(req)
                }
            }.bind(this)
            req.send()

        },
        setData(req) {
            switch (Object.keys(req.response)[0]) {
                // case 'courses':
                //     this.courses = req.response.courses
                //     this.coursesFlag = true
                //     break
                case 'cats':
                    this.cats = req.response.cats
                    this.mainPageFlag = true
                    this.coursesFlag = true
                    break
            }
        },
        sendData(data) {
            let req = new XMLHttpRequest()
            req.responseType = 'json';
            req.open("POST", '/v1/setMainPage')
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            req.onreadystatechange = function () {
                if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
                    // console.log("send => ", req.response)
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
            req.send(data)
        },
        edit() {
            if (this.sendFlag === false) {
                this.sendFlag = true
                let data = Array()
                for (let i in this.cats) {
                    data.push({
                        description: this.cats[i].description,
                        title: this.cats[i].title,
                        id: this.cats[i].id
                    })
                }
                // console.log(data)
                this.sendData('data=' + JSON.stringify(data))
                // this.sendData(JSON.stringify({'data': data))
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