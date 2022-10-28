const app = Vue.createApp({
  data() {
    return {
      jsonData: [],
      page: {
        currentPage: 1,
        pageTotal: 1,
      },
      perpage: 20,
    };
  },
  methods: {
    pagination(nowPage) {
      const dataLength = this.jsonData.length;
      this.page.pageTotal = Math.ceil(dataLength / this.perpage);
      this.page.currentPage = nowPage;
    },
    changePage(num) {
      if (num < 1 || num > this.page.pageTotal) {
        return;
      } else {
        this.page.currentPage = num;
      }
      scrollTo(top);
    },
  },
  computed: {
    pageData() {
      const minData = this.page.currentPage * this.perpage - this.perpage + 1;
      const maxData = this.page.currentPage * this.perpage;
      let data = [];
      this.jsonData.forEach((item, index) => {
        let num = index + 1;
        if (num >= minData && num <= maxData) {
          data.push(item);
        }
      });
      return data;
    },
  },
  created() {
    const jsonUrl =
      "https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c";
    fetch(jsonUrl, { method: "get" })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.jsonData = data.data.XML_Head.Infos.Info;
        this.pagination(1);
      });
  },
});

app.component("cards", {
  props: ["item"],
  template: `<div class="col-md-6 py-2 px-1">
  <div class="card h-100">
    <div class="card bg-dark text-white text-left">
      <img class="card-img-top img-cover" height="200" :src="item.Picture1">
      <div class="card-img-overlay d-flex justify-content-between align-items-end p-0 px-3" style="background-color: rgba(0, 0, 0, .2)">
      <h5 class="card-img-title-lg">{{item.Name}}</h5><h5 class="card-img-title-sm">{{item.Zone}}</h5>
    </div>
    </div>
    <div class="card-body text-left">
        <p class="card-text"><i class="far fa-clock fa-clock-time"></i>&nbsp;{{item.Opentime}}</p>
        <p class="card-text"><i class="fas fa-map-marker-alt fa-map-gps"></i>&nbsp;{{item.Add}}</p>
        <p class="card-text"><i class="fas fa-mobile-alt fa-mobile"></i>&nbsp;{{item.Tel}}</p>
        <p class="card-text">
        <i v-if='item.Ticketinfo' class="fas fa-tags text-warning"></i>{{ item.Ticketinfo}}</p>
    </div>
  </div>
</div>`,
});

app.component("pageNum", {
  methods: {
    pageClick(index) {
      this.$emit("emit-page", index);
    },
  },
  props: ["page"],
  template: `<li class="page-item" :class="{disabled:page.currentPage <=1}" @click.prevent='pageClick(page.currentPage-1)'><a class="page-link" href="#"
  >Previous</a></li>
  <li class="page-item" :class="{'active':page.currentPage === i}" @click.prevent='pageClick(i)' v-for='i in page.pageTotal' :key="i"><a class="page-link" href="#">{{i}}</a></li>
  <li class="page-item" :class="{disabled:page.currentPage >=page.pageTotal}" @click.prevent='pageClick(page.currentPage+1)'><a class="page-link" href="#">Next</a></li>
  `,
});

app.mount("#app");
