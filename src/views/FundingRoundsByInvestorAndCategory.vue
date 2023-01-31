<template>
  <BlockChart :loading="loading">
    <template #title>
      <div class="w-full">
        <h2 class="text-white font-bold text-[20px]">
          Number of funding rounds by Investor and Category
          <TimeFrame
            class="absolute top-[11px] right-0 z-[1]"
            :time_frame="time_frame"
            :time_fetch="time"
            @set_time_frame="(v) => (time = v)"
          />
        </h2>
      </div>
    </template>
    <HighChart
      id="funding-rounds-by-investor-and-category"
      :options="options"
      height="600px"
      ref="highchart"
    />
  </BlockChart>
</template>

<script>
import moment from "moment";
import BlockChart from "@/components/BlockChart.vue";
import HighChart from "@/components/HighChart.vue";
import TimeFrame from "@/components/TimeFrame.vue";
let highcharts = require("highcharts");
require("highcharts/highcharts-more")(highcharts);
require("highcharts/modules/accessibility")(highcharts);
require("highcharts/modules/exporting")(highcharts);
export default {
  components: {
    BlockChart,
    HighChart,
    TimeFrame,
  },
  name: "funding-rounds-by-investor-and-category",
  props: {
    api_res_data: { type: Array },
  },
  data: () => ({
    data: [],
    web3: {
      name: "Web3",
      data: [],
      color: "#7c7cf4",
    },
    nfts: {
      name: "NFTs",
      data: [],
      color: "#7F00FF",
    },
    gamefi: {
      name: "GameFi",
      data: [],
      color: "#DA70D6",
    },
    defi: {
      name: "DeFi",
      data: [],
      color: "#8ab4f8",
    },
    cefi: {
      name: "CeFi",
      data: [],
      color: "#01bbbb",
    },
    blockchain: {
      name: "Blockchain Service",
      data: [],
      color: "#6495ED",
    },
    infrastructure: {
      name: "Infrastructure",
      data: [],
      color: "#3dca3d",
    },
    currency: {
      name: "Currency",
      data: [],
      color: "#aecbfa",
    },
    social: {
      name: "Social",
      data: [],
      color: "rgb(234 179 8)",
    },
    seriesOptions: [],
    loading: true,
    legendX: 140,
    legendY: 0,
    verticalAlign: "top",
    maxTotal: null,
    time_frame: ["1m", "3m", "6m", "1y", "2y", "YTD", "All"],
    time: "all",
  }),
  watch: {
    api_res_data: {
      handler() {
        this.init();
      },
    },
    time: {
      async handler() {
        this.loading = true;
        await this.setDataChart();
        this.loading = false;
      },
    },
  },
  computed: {
    options(vm) {
      return {
        chart: {
          backgroundColor: "#2e2e33",
          type: "column",
        },
        title: {
          text: null,
        },
        xAxis: {
          title: null,
          type: "category",
          labels: {
            style: {
              color: "rgb(156 163 175)",
            },
          },
          crosshair: {
            color: "#ffffff1f",
            snap: false,
            width: 1,
            dashStyle: "longdash",
          },
        },
        yAxis: {
          min: 0,
          max: vm.maxTotal,
          gridLineColor: "transparent",
          labels: {
            style: {
              color: "rgb(156 163 175)",
            },
          },
          stackLabels: {
            enabled: true,
            style: {
              color: "rgb(209 213 219)",
              fontWeight: "normal",
              fontSize: 10,
              textOutline: 0,
            },
            formatter: function () {
              if (!vm.maxTotal) vm.maxTotal = this.total;
              if (vm.maxTotal < this.total) vm.maxTotal = this.total;
              vm.maxTotal = Math.ceil(vm.maxTotal / 10) * 10;
              return this.total;
            },
          },
          title: {
            text: "Number of Funding Rounds",
            style: {
              fontWeight: 600,
            },
          },
          opposite: false,
          //   tickAmount: 5,
          showLastLabel: true,
        },

        credits: {
          enabled: false,
        },
        legend: {
          enabled: true,
          reversed: true,
          floating: true,
          align: "left",
          verticalAlign: this.verticalAlign,
          x: this.legendX,
          y: this.legendY,
          itemMarginBottom: 4,
          itemStyle: {
            color: "rgb(148 163 184)",
            fontWeight: "normal",
          },
          itemHoverStyle: {
            color: "rgb(148 163 184)",
            fontWeight: "bold",
          },
        },
        tooltip: {
          useHTML: true,
          backgroundColor: "#1f2937",
          followPointer: true,
          split: false,
          followTouchMove: false,
          animation: false,
          borderWidth: 0,
          shadow: false,
          padding: 0,
          hideDelay: 0,
          shared: true,
          formatter: function () {
            let points = this.points;
            let title = `<div class="text-white font-semibold">${points[0].key}</div>`;
            let content = [];
            points.forEach((point) => {
              content.push(`<div style="color:${point.color}">${point.series.name}: <b class="text-gray-400 font-semibold"> ${point.y}
               </b> </div>`);
            });
            content = content.join("");
            let result =
              `<div class="border border-white rounded p-2">` +
              title +
              content +
              `</div>`;
            return result;
          },
        },
        plotOptions: {
          column: {
            maxPointWidth: 50,
            stacking: "normal",
            states: {
              inactive: {
                opacity: 1,
              },
            },
          },
          series: {
            borderWidth: 0,
            groupPadding: 0,
          },
        },
        series: this.seriesOptions,
      };
    },
  },
  methods: {
    async init() {
      try {
        this.loading = true;
        await this.fetchData();
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchData() {
      this.data = this.api_res_data;
      this.setDataChart();
    },
    async setDataChart() {
      let data = this.data.filter((x) => x.round);
      let now = moment(new Date().getTime());
      let time = null;
      if (this.time == "1m")
        time = new Date(
          Date.UTC(now.year(), now.month() - 1, now.date(), 0, 0, 0)
        ).getTime();
      if (this.time == "3m")
        time = new Date(
          Date.UTC(now.year(), now.month() - 3, now.date(), 0, 0, 0)
        ).getTime();
      if (this.time == "6m")
        time = new Date(
          Date.UTC(now.year(), now.month() - 6, now.date(), 0, 0, 0)
        ).getTime();
      if (this.time == "1y")
        time = new Date(
          Date.UTC(now.year() - 1, now.month(), now.date(), 0, 0, 0)
        ).getTime();
      if (this.time == "2y")
        time = new Date(
          Date.UTC(now.year() - 2, now.month(), now.date(), 0, 0, 0)
        ).getTime();
      if (this.time == "ytd")
        time = new Date(Date.UTC(now.year(), 0, 1, 0, 0, 0)).getTime();
      if (this.time == "all") time = new Date(time).getTime();
      data = data.filter((v) => !(v.date < time));
      let investorsArr = [
        "Animoca Brands",
        "Coinbase Ventures",
        "Alameda Research",
        // "FTX Ventures",
        "Shima Capital",
        "Spartan Group",
        "a16z",
        "GSR",
        "Dragonfly Capital",
        "LD Capital",
        "Skyvision Capital",
        "Jump Capital",
        "Hashkey Capital",
        "Digital Currency Group",
        "ZBS CAPITAL",
        "Infinity Ventures Crypto",
        "Hashed",
        "Solana Ventures",
        "GBV Capital",
        "AU21 Capital",
        "CMS Holdings",
        "CMT Digital",
        "X21 Digital",
        "Sequoia Capital",
        "Genblock Capital",
        "Multicoin Capital",
        "NGC Ventures",
        "Delphi Digital",
        "DeFiance Capital",
        "Polygon",
        "Morningstar Ventures",
      ];
      (this.defi.data = []),
        (this.cefi.data = []),
        (this.nfts.data = []),
        (this.infrastructure.data = []),
        (this.web3.data = []),
        (this.gamefi.data = []),
        (this.blockchain.data = []),
        (this.currency.data = []),
        (this.social.data = []);
      investorsArr.forEach((item) => {
        this.defi.data.push({
          name: item,
          y: data.filter((x) => {
            if (x.category != null) {
              return (
                x.leadInvestors
                  .concat(x.otherInvestors)
                  .join(", ")
                  .includes(item) &&
                ["dex", "defi", "dao infrastructure"].some((v) =>
                  x.category.toLowerCase().includes(v)
                )
              );
            }
            return (
              x.leadInvestors
                .concat(x.otherInvestors)
                .join(", ")
                .includes(item) &&
              [
                "decentralized",
                "wallet",
                "amm",
                "liquidity",
                "swap",
                "leveraged",
                "lending",
                "borrowing",
                "money",
              ].some((v) => x.sector?.toLowerCase().includes(v))
            );
          }).length,
        });
        this.cefi.data.push({
          name: item,
          y: data.filter((x) => {
            if (x.category != null) {
              return (
                x.leadInvestors
                  .concat(x.otherInvestors)
                  .join(", ")
                  .includes(item) &&
                ["cex", "cefi", "cefi yield", "centralized exchange"].some(
                  (v) => x.category.toLowerCase().includes(v)
                )
              );
            }
            return (
              x.leadInvestors
                .concat(x.otherInvestors)
                .join(", ")
                .includes(item) &&
              ["market maker", "exchange"].some((v) =>
                x.sector?.toLowerCase().includes(v)
              )
            );
          }).length,
        });
        this.nfts.data.push({
          name: item,
          y: data.filter((x) => {
            if (x.category != null) {
              return (
                x.leadInvestors
                  .concat(x.otherInvestors)
                  .join(", ")
                  .includes(item) && x.category == "NFT"
              );
            }
            return (
              x.leadInvestors
                .concat(x.otherInvestors)
                .join(", ")
                .includes(item) && x.sector?.includes("NFT")
            );
          }).length,
        });
        this.infrastructure.data.push({
          name: item,
          y: data.filter((x) => {
            if (x.category != null) {
              return (
                x.leadInvestors
                  .concat(x.otherInvestors)
                  .join(", ")
                  .includes(item) &&
                [
                  "l1",
                  "l2",
                  "infrastructure",
                  "smart contract platform",
                  "zero knowledge industry",
                ].includes(x.category.toLowerCase())
              );
            }
            return (
              x.leadInvestors
                .concat(x.otherInvestors)
                .join(", ")
                .includes(item) &&
              ["Layer 1", "Layer1", "DAO"].some((v) => x.sector?.includes(v))
            );
          }).length,
        });
        this.web3.data.push({
          name: item,
          y: data.filter((x) => {
            if (x.category != null) {
              return (
                x.leadInvestors
                  .concat(x.otherInvestors)
                  .join(", ")
                  .includes(item) && x.category == "Web3"
              );
            }
            return (
              x.leadInvestors
                .concat(x.otherInvestors)
                .join(", ")
                .includes(item) && x.sector?.includes("Web3")
            );
          }).length,
        });
        this.gamefi.data.push({
          name: item,
          y: data.filter((x) => {
            if (x.category != null) {
              return (
                x.leadInvestors
                  .concat(x.otherInvestors)
                  .join(", ")
                  .includes(item) &&
                ["gaming", "game", "metaverse"].includes(
                  x.category.toLowerCase()
                )
              );
            }
            return (
              x.leadInvestors
                .concat(x.otherInvestors)
                .join(", ")
                .includes(item) && x.sector?.includes("play")
            );
          }).length,
        });
        this.blockchain.data.push({
          name: item,
          y: data.filter((x) => {
            if (x.category != null) {
              return (
                x.leadInvestors
                  .concat(x.otherInvestors)
                  .join(", ")
                  .includes(item) &&
                [
                  "blockchain-as-a-service",
                  "cloud intelligence",
                  "custody",
                  "cybersecurity",
                  "information security",
                  "information services digital assets",
                  "iot",
                  "mev",
                  "mining",
                  "scaling solution",
                  "smart contract audits",
                  "smart contract security",
                  "storage",
                ].includes(x.category.toLowerCase())
              );
            }
            return (
              x.leadInvestors
                .concat(x.otherInvestors)
                .join(", ")
                .includes(item) &&
              [
                "sass",
                "data",
                "analytics",
                "management",
                "solution",
                "solutions",
              ].some((v) => x.sector?.toLowerCase().includes(v))
            );
          }).length,
        });
        this.currency.data.push({
          name: item,
          y: data.filter((x) => {
            if (x.category != null) {
              return (
                x.leadInvestors
                  .concat(x.otherInvestors)
                  .join(", ")
                  .includes(item) && x.category == "Payments"
              );
            }
            return (
              x.leadInvestors
                .concat(x.otherInvestors)
                .join(", ")
                .includes(item) && x.sector?.toLowerCase().includes("fiat")
            );
          }).length,
        });
        this.social.data.push({
          name: item,
          y: data.filter((x) => {
            if (x.category != null) {
              return (
                x.leadInvestors
                  .concat(x.otherInvestors)
                  .join(", ")
                  .includes(item) && x.category == "Social Platform"
              );
            }
            return (
              x.leadInvestors
                .concat(x.otherInvestors)
                .join(", ")
                .includes(item) &&
              ["social", "network"].some((v) =>
                x.sector?.toLowerCase().includes(v)
              )
            );
          }).length,
        });
      });
      this.seriesOptions = [
        this.social,
        this.currency,
        this.web3,
        this.nfts,
        this.gamefi,
        this.defi,
        this.cefi,
        this.blockchain,
        this.infrastructure,
      ];
    },
  },
};
</script>
