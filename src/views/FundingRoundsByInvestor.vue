<template>
  <BlockChart title="Number of funding rounds by Investor" :loading="loading">
    <HighChart
      id="crypto-fundraising-trend"
      :options="options"
      height="556px"
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
  name: "funding-rounds-by-investor",
  components: {
    BlockChart,
    HighChart,
  },
  props: {
    api_res_data: { type: Array },
  },
  data: () => ({
    data: [],
    loading: true,
    functionFireChart: null,
    seriesOptions: [],
    legendX: 0,
    legendY: -30,
    verticalAlign: "top",
  }),
  watch: {
    api_res_data: {
      handler() {
        this.init();
      },
    },
  },
  computed: {
    options() {
      return {
        chart: {
          backgroundColor: "#2e2e33",
          type: "bar",
        },
        title: {
          text: null,
        },
        xAxis: {
          type: "category",
          lineWidth: 0,
          labels: {
            align: "left",
            x: 0,
            style: {
              color: "#ffffff",
              fontSize: 12,
              fontFamily: "'Rubik' sans-serif",
              textShadow: false,
              fontWeight: "normal",
              pointerEvents: "none",
            },
          },
        },
        yAxis: {
          gridLineColor: "#ffffff1f",
          // gridLineDashStyle: "longdash",
          lineWidth: 1,
          lineColor: "#ffffff1f",
          labels: {
            style: {
              color: "rgb(156 163 175)",
            },
          },
          title: null,
          opposite: false,
          tickAmount: 5,
          showLastLabel: true,
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          useHTML: true,
          backgroundColor: "#1f2937",
          followPointer: true,
          split: false,
          followTouchMove: false,
          animation: false,
          borderRadius: 5,
          borderWidth: 0,
          shadow: false,
          padding: 0,
          hideDelay: 0,
          formatter: function () {
            return `<div class="border border-white rounded p-2">
                <div class="text-white font-semibold mb-1">${this.key}</div>
                <div class="text-gray-500">Number of funding rounds: <b class="text-white font-semibold">${this.y}</b></div>
                </div>`;
          },
        },
        plotOptions: {
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
      this.seriesOptions = [];
      try {
        this.loading = true;
        await this.fetchData();
      } catch (error) {
        console.log(error);
        this.seriesOptions = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchData() {
      const res_data = this.api_res_data;
      this.data = res_data;
      await this.setDataChart();
    },

    async setDataChart() {
      let data = this.data.filter((x) => x.round);
      let investorsArr = [];
      for (const d of data) {
        investorsArr = investorsArr
          .concat(d.leadInvestors)
          .concat(d.otherInvestors);
      }
      let dataSeries = [
        [
          "Animoca Brands",
          investorsArr.filter((x) => x.includes("Animoca Brands")).length,
        ],
        [
          "Coinbase Ventures",
          investorsArr.filter((x) => x.includes("Coinbase Ventures")).length,
        ],
        [
          "Shima Capital",
          investorsArr.filter((x) => x.includes("Shima Capital")).length,
        ],
        ["GSR", investorsArr.filter((x) => x.includes("GSR")).length],
        [
          "Alameda Research",
          investorsArr.filter((x) => x.includes("Alameda Research")).length,
        ],
        [
          "Spartan Group",
          investorsArr.filter((x) => x.includes("Spartan Group")).length,
        ],
        [
          "Dragonfly Capital",
          investorsArr.filter((x) => x.includes("Dragonfly Capital")).length,
        ],
        [
          "Andreessen Horowitz",
          investorsArr.filter((x) => x.includes("Andreessen Horowitz")).length,
        ],
        [
          "Solana Ventures",
          investorsArr.filter((x) => x.includes("Solana Ventures")).length,
        ],
        [
          "Infinity Ventures Crypto",
          investorsArr.filter((x) => x.includes("Infinity Ventures Crypto"))
            .length,
        ],
        [
          "Jump Crypto",
          investorsArr.filter((x) => x.includes("Jump Crypto")).length,
        ],
        ["Polygon", investorsArr.filter((x) => x.includes("Polygon")).length],
        [
          "Big Brain Holdings",
          investorsArr.filter((x) => x.includes("Big Brain Holdings")).length,
        ],
        [
          "Balaji Srinivasan",
          investorsArr.filter((x) => x.includes("Balaji Srinivasan")).length,
        ],
        ["FTX", investorsArr.filter((x) => x.includes("FTX")).length],
        [
          "Hashkey Capital",
          investorsArr.filter((x) => x.includes("Hashkey Capital")).length,
        ],
        [
          "Binance Labs",
          investorsArr.filter((x) => x.includes("Binance Labs")).length,
        ],
        ["Hashed", investorsArr.filter((x) => x.includes("Hashed")).length],
        [
          "LD Capital",
          investorsArr.filter((x) => x.includes("LD Capital")).length,
        ],
      ];
      dataSeries = dataSeries.sort((a, b) => b[1] - a[1]);
      this.seriesOptions = [
        {
          data: dataSeries,
          color: "rgb(97, 100, 255)",
        },
      ];
    },
  },
};
</script>
