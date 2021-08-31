let vmCheck_in1 = new Vue({
    el: "#check_in",
    data: {
        sendFlag: false,
        error: 'Помилка при відправці запиту',
        success: 'Запит відправлено',
        editResult: '',
        errorFlag: false,
        successFlag: false,
        mailData: {
            age: '',
            email: '',
            name: '',
            phone: '',
            href: ''
        }
    },
    created() {
        this.mailData.href = this.getParams(document.referrer);
    },
    methods: {

        sendMail() {
            let req = new XMLHttpRequest()
            req.responseType = 'json';
            req.open("POST", '/v1/sendMail')
            req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            req.onreadystatechange = function () {
                if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
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
            if (this.checkInfo(this.mailData)) {
                let data = 'data=' + JSON.stringify(this.mailData)
                req.send(data)
            }
        },
        checkInfo(data) {
            let i = 0
            let errors = {
                name: 'Прізвище та ім\'я, ',
                email: 'Адреса електронної пошти, ',
                phone: 'Номер телефону, ',
                age: 'Вік дитини.',
            }
            if (data.email !== "" && data.email.match(/@.*?\./g)) {
                i++;
                errors.email = ''
            }
            if (data.name !== "") {
                i++
                errors.name = ''
            }
            if (data.phone !== "" && data.phone.length >= 10) {
                i++
                errors.phone = ''
            }
            if (data.age !== "" && data.age !== 0 && data.age < 60) {
                i++
                errors.age = '.'
            }
            if (i === 4) {
                return true
            } else {
                this.editResult = 'Невірно введені наступні дані: ' +
                    errors.name + errors.email + errors.phone + errors.age;
                this.errorFlag = true;
                this.removeEditFlags()
                return false
            }
        },
        removeEditFlags() {
            let a = setInterval(function () {
                this.sendFlag = false
                this.successFlag = false;
                this.errorFlag = false;
                this.editResult = '';

                clearInterval(a);
            }.bind(this), 10000)
        },
        getParams(url) {
            let params = url.split('/')
            return params[params.length - 1].split('?')[0]
        },
    }
})