<template>
  <BlockChart :loading="loading">
    <template #title>
      <div class="w-full">
        <h2 class="text-white font-bold text-[20px]">
          Number of Funding rounds by Investor
          <TimeFrame
            class="mt-1"
            :time_frame="time_frame"
            :time_fetch="time"
            @set_time_frame="(v) => (time = v)"
          />
        </h2>
      </div>
    </template>
    <HighChart
      id="funding-rounds-by-investor"
      :options="options"
      height="470px"
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
  name: "funding-rounds-by-investor",
  components: {
    BlockChart,
    HighChart,
    TimeFrame,
  },
  props: {
    api_res_data: { type: Array },
  },
  data: () => ({
    data: [],
    loading: true,
    functionFireChart: null,
    seriesOptions: [],
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
              fontFamily: "'Rubik', sans-serif",
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
        ["a16z", investorsArr.filter((x) => x.includes("a16z")).length],
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
        [
          "FTX Ventures",
          investorsArr.filter((x) => x.includes("FTX Ventures")).length,
        ],
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
      dataSeries = dataSeries.filter((x) => x[1] != 0);
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
