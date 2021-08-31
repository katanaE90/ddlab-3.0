let vmNav1 = new Vue({
    el: "#main-menu",
    data: {
        navigation: {},
        navigationFlag: false,
    },
    created() {
        this.getData("/v1/getNavigation")
    },
    methods: {
        getData(url) {
            let req = new XMLHttpRequest()
            req.responseType = 'json';
            req.open("POST", url)
            req.onreadystatechange = function () {
                if (req.readyState === XMLHttpRequest.DONE && req.status === 200) {
                    // console.log("resp => ", req.response)
                    this.setData(req)
                }
            }.bind(this)
            req.send()
        },
        setData(req) {
            this.navigation = req.response.navigation
            this.navigationFlag = true
        }
    }
})


let vmNav2 = new Vue({
    el: "#main-menu--mobile",
    data: {
        showMobileMenu: false,
        showScroll: false,
        prevYPos: 0
    },

    created() {
        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        showMenu() {
            this.showMobileMenu = !this.showMobileMenu
            // console.log(this.showMobileMenu)
        },
        scrollHome() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        },
        handleScroll() {
            let yPos = window.scrollY;
            this.showScroll = this.prevYPos > yPos;
            this.prevYPos = yPos;
            if(yPos === 0) {
                this.showScroll = false
            }
        }
    }
})