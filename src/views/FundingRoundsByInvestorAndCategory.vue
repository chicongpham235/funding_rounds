<template>
  <BlockChart
    title="Number of funding rounds by Investor and Category"
    :loading="loading"
  >
    <HighChart
      id="fundraising-by-category"
      :options="options"
      height="600px"
      ref="highchart"
    />
  </BlockChart>
</template>

<script>
import BlockChart from "@/components/BlockChart.vue";
import HighChart from "@/components/HighChart.vue";
let highcharts = require("highcharts");
require("highcharts/highcharts-more")(highcharts);
require("highcharts/modules/accessibility")(highcharts);
require("highcharts/modules/exporting")(highcharts);
export default {
  components: {
    BlockChart,
    HighChart,
  },
  name: "funding-rounds-by-investor-and-category",
  props: {
    api_res_data: { type: Array },
  },
  data: () => ({
    web3: {
      name: "Web3",
      data: [],
      color: "#7c7cf4",
    },
    nfts: {
      name: "NFTs",
      data: [],
      color: "#6495ED",
    },
    defi: {
      name: "DeFi",
      data: [],
      color: "#8ab4f8",
    },
    cefi: {
      name: "CeFi",
      data: [],
      color: "#DA70D6",
    },
    infrastructure: {
      name: "Infrastructure",
      data: [],
      color: "#aecbfa",
    },
    seriesOptions: [],
    loading: true,
    legendX: 0,
    legendY: 0,
    verticalAlign: "top",
    maxTotal: null,
  }),
  watch: {
    api_res_data: {
      handler() {
        this.init();
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
          // style: {
          //   color: "transparent",
          //   fontSize: "20px",
          //   fontWeight: "bold",
          // },
          // align: "left",
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
          title: null,
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
            maxPointWidth: 20,
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
      this.setDataChart();
    },
    async setDataChart() {
      const res_data = this.api_res_data;
      let data = res_data.filter((x) => x.round);
      let investorsArr = [
        "Animoca Brands",
        "Coinbase Ventures",
        "Alameda Research",
        "Shima Capital",
        "Spartan Group",
        "Andreessen Horowitz",
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
        (this.web3.data = []);
      investorsArr.forEach((item) => {
        this.defi.data.push({
          name: item,
          y: data.filter((x) => {
            if (x.category != null) {
              return (
                x.leadInvestors
                  .concat(x.otherInvestors)
                  .join(", ")
                  .includes(item) && x.category == "DeFi"
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
                  .includes(item) && x.category == "CeFi"
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
                  .includes(item) && x.category == "Infrastructure"
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
      });
      this.seriesOptions = [
        this.nfts,
        this.web3,
        this.defi,
        this.infrastructure,
        this.cefi,
      ];
    },

    // mapCategory(e) {
    //   e = e.map((v) => {
    //     if (
    //       v.categoryArr.includes("L1") ||
    //       v.categoryArr.includes("L2") ||
    //       v.categoryArr.includes("Infrastructure") ||
    //       v.categoryArr.includes("Smart Contract Platform") ||
    //       v.categoryArr.includes("Zero Knowledge Industry")
    //     ) {
    //       v.category[0].count++;
    //     }
    //     if (
    //       v.categoryArr.includes("Blockchain-as-a-Service") ||
    //       v.categoryArr.includes("Cloud Intelligence") ||
    //       v.categoryArr.includes("Custody") ||
    //       v.categoryArr.includes("Cybersecurity") ||
    //       v.categoryArr.includes("Information security") ||
    //       v.categoryArr.includes("Information services digital assets") ||
    //       v.categoryArr.includes("IoT") ||
    //       v.categoryArr.includes("MEV") ||
    //       v.categoryArr.includes("Mining") ||
    //       v.categoryArr.includes("Scaling Solution") ||
    //       v.categoryArr.includes("Smart contract audits") ||
    //       v.categoryArr.includes("Smart contract security") ||
    //       v.categoryArr.includes("Storage")
    //     ) {
    //       v.category[1].count++;
    //     }
    //     if (
    //       v.categoryArr.includes("CEX") ||
    //       v.categoryArr.includes("CeFi") ||
    //       v.categoryArr.includes("CeFi Yield") ||
    //       v.categoryArr.includes("Centralized Exchange")
    //     ) {
    //       v.category[2].count++;
    //     }
    //     if (
    //       v.categoryArr.includes("DEX") ||
    //       v.categoryArr.includes("DeFi") ||
    //       v.categoryArr.includes("DAO Infrastructure")
    //     ) {
    //       v.category[3].count++;
    //     }
    //     if (
    //       v.categoryArr.includes("Game") ||
    //       v.categoryArr.includes("Gaming") ||
    //       v.categoryArr.includes("Metaverse")
    //     ) {
    //       v.category[4].count++;
    //     }
    //     if (v.categoryArr.includes("NFT")) v.category[5].count++;
    //     if (v.categoryArr.includes("Web3")) v.category[6].count++;
    //     if (v.categoryArr.includes("Payments")) v.category[7].count++;
    //     if (v.categoryArr.includes("Social Platform")) v.category[8].count++;
    //     if (v.categoryArr.includes(null)) {
    //       v.sectorArr.forEach((e) => {
    //         if (
    //           ["layer 1", "layer1", "dao"].some((x) =>
    //             e?.toLowerCase().includes(x)
    //           )
    //         )
    //           v.category[0].count++;
    //         else if (
    //           [
    //             "sass",
    //             "data",
    //             "management",
    //             "analytics",
    //             "solution",
    //             "solutions",
    //           ].some((x) => e?.toLowerCase().includes(x))
    //         )
    //           v.category[1].count++;
    //         else if (
    //           ["market maker", "exchange"].some((x) => {
    //             if (!e?.toLowerCase().includes("decentralized"))
    //               return e?.toLowerCase().includes(x);
    //           })
    //         )
    //           v.category[2].count++;
    //         else if (
    //           [
    //             "decentralized",
    //             "wallet",
    //             "amm",
    //             "liquidity",
    //             "swap",
    //             "leveraged",
    //             "lending",
    //             "borrowing",
    //             "money",
    //           ].some((x) => e?.toLowerCase().includes(x))
    //         )
    //           v.category[3].count++;
    //         else if (["play"].some((x) => e?.toLowerCase().includes(x)))
    //           v.category[4].count++;
    //         else if (["web3"].some((x) => e?.toLowerCase().includes(x)))
    //           v.category[5].count++;
    //         else if (["nft"].some((x) => e?.toLowerCase().includes(x)))
    //           v.category[5].count++;
    //         else if (["fiat"].some((x) => e?.toLowerCase().includes(x)))
    //           v.category[7].count++;
    //         else if (
    //           ["social", "network"].some((x) => e?.toLowerCase().includes(x))
    //         )
    //           v.category[8].count++;
    //       });
    //     }
    //     return v;
    //   });
    // },
  },
};
</script>
