<template>
  <BlockChart title="Most Active Funds" :loading="loading">
    <HighChart
      id="most-active-funds"
      :options="options"
      height="600px"
      ref="highchart"
      isStockChart
    />
  </BlockChart>
</template>

<script>
import moment from "moment";
import BlockChart from "@/components/BlockChart.vue";
import HighChart from "@/components/HighChart.vue";
import { roundValue } from "@/ultis";
let highcharts = require("highcharts");
require("highcharts/highcharts-more")(highcharts);
require("highcharts/modules/accessibility")(highcharts);
require("highcharts/modules/exporting")(highcharts);
var pieColors = [
  "rgb(255, 164, 200)",
  "rgb(145, 232, 225)",
  "rgb(124, 181, 236)",
  "#7c7cf4",
  "rgb(255, 221, 150)",
  "purple",
  "rgb(247, 163, 92)",
  "rgb(144, 237, 125)",
  "rgb(255, 255, 164)",
  "rgb(241, 92, 128)",
];
export default {
  name: "most-active-funds",
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
    legendY: -25,
    verticalAlign: "top",
    labelFormat: "{value:%b, %y}",
    tickInterval: 30 * 24 * 3600 * 1000,
    startDate: null,
    endDate: null,
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
          type: "bubble",
          zoomType: "xy",
          events: {
            load() {
              const chart = this,
                startDate = vm.startDate,
                endDate = vm.endDate;

              chart.xAxis[0].setExtremes(startDate, endDate);
            },
          },
        },
        rangeSelector: {
          inputEnabled: false,
          enabled: true,
          verticalAlign: "top",
          selected: 5,
          height: 45,
          buttons: [
            {
              type: "month",
              count: 6,
              text: "6m",
            },
            {
              type: "year",
              count: 1,
              text: "1y",
            },
            {
              type: "year",
              count: 2,
              text: "2y",
            },
            {
              type: "ytd",
              text: "YTD",
            },
            {
              type: "all",
              text: "All",
            },
          ],
          buttonTheme: {
            fill: "none",
            stroke: "none",
            "stroke-width": 0,
            r: 8,
            style: {
              color: "#fff",
              fontWeight: "normal",
            },
            states: {
              hover: {
                fill: "#404044",
              },
              select: {
                fill: "#404044",
                style: {
                  color: "white",
                  fontWeight: "normal",
                },
              },
              disabled: { fontWeight: "normal" },
            },
          },
          inputStyle: {
            color: "#fff",
            fontWeight: "normal",
            fontFamily: "'Rubik' sans-serif",
          },
          labelStyle: {
            color: "#fff",
            fontWeight: "normal",
          },
          buttonPosition: {
            align: "left",
            x: 0,
            y: 0,
          },
        },
        title: {
          text: null,
        },
        xAxis: {
          type: "datetime",
          labels: {
            format: "{value:%b, %y}",
            style: {
              color: "rgb(156 163 175)",
            },
          },
          crosshair: false,
          tickInterval: this.tickInterval,
        },
        yAxis: {
          startOnTick: false,
          endOnTick: false,
          gridLineColor: "transparent",
          labels: {
            style: {
              color: "rgb(156 163 175)",
            },
          },
          title: {
            text: "Number of Deals",
          },
          opposite: false,
          showLastLabel: true,
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: true,
          align: "left",
          verticalAlign: this.verticalAlign,
          x: this.legendX,
          y: this.legendY,
          itemMarginBottom: 4,
          itemStyle: {
            color: "rgb(148 163 184)",
            fontWeight: "normal",
            fontFamily: "'Rubik', sans-serif",
          },
          itemHoverStyle: {
            color: "rgb(148 163 184)",
            fontWeight: "bold",
            fontFamily: "'Rubik', sans-serif",
          },
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
                <div class="text-gray-500">Month: <b class="text-white font-semibold">${moment(
                  this.x
                ).format("MMM, YYYY")}</b></div>
                <div class="text-gray-500">Investor: <b style="color: ${
                  this.color
                }" class="font-semibold">${this.series.name}</b></div>
                <div class="text-gray-500">Number of Deals: <b class="text-white font-semibold">${
                  this.y
                }</b></div>
                </div>`;
          },
        },
        plotOptions: {
          bubble: {
            minSize: 30,
            maxSize: 80,
            marker: {
              lineWidth: 0,
              fillOpacity: 0.6,
              states: {
                hover: {
                  lineWidth: 0,
                },
              },
            },
          },
        },
        series: this.seriesOptions,
        navigator: {
          enabled: false,
        },
        scrollbar: {
          enabled: false,
        },
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
      let data = res_data;
      await this.configData(data);
      this.setDataChart();
    },

    async configData(data) {
      let result = [];
      result = data.reduce(function (accumulator, currentValue) {
        let timestamp = currentValue.date;
        let time = moment(timestamp);
        time = new Date(
          Date.UTC(time.year(), time.month(), 1, 0, 0, 0)
        ).getTime();
        if (!accumulator[time]) {
          accumulator[time] = {
            time: time,
            investor: [],
          };
          result.push([accumulator[time]]);
        }
        let currentInvestors = [];
        currentInvestors = currentInvestors
          .concat(currentValue.leadInvestors)
          .concat(currentValue.otherInvestors);
        accumulator[time].investor =
          accumulator[time].investor.concat(currentInvestors);
        return accumulator;
      }, {});
      result = Object.entries(result).map(([key, value]) => {
        let investorDeals = [];
        value.investor.forEach((item) => {
          let index = investorDeals.findIndex((x) => x.name == item);
          if (index == -1) investorDeals.push({ name: item, deals: 1 });
          else {
            investorDeals[index].deals++;
          }
        });
        value.investorDeals = investorDeals;
        return value;
      });
      result = result.sort((a, b) => a.time - b.time);
      this.data = result;
    },
    setDataChart() {
      let data = this.data;
      data.forEach((item) => {
        item.investorDeals = item.investorDeals.filter(
          (v) =>
            v.name.includes("Spartan Group") ||
            v.name.includes("Animoca Brands") ||
            v.name.includes("Alameda Research") ||
            v.name.includes("Coinbase Ventures") ||
            v.name.includes("LD Capital") ||
            v.name.includes("Infinity Ventures") ||
            v.name.includes("Hashed") ||
            v.name.includes("Andreessen Horowitz") ||
            v.name.includes("Shima Capital") ||
            v.name.includes("Hashkey Capital")
        );
      });
      data = data.map(({ investor, ...rest }) => ({ ...rest }));
      this.endDate = data[data.length - 1].time;
      let time = moment(this.endDate);
      this.startDate = new Date(
        Date.UTC(time.year(), time.month() - 6, time.date(), 0, 0, 0)
      ).getTime();
      let spartan_group = {
        name: "Spartan Group",
        data: [],
        color: pieColors[0],
      };
      let animoca_brands = {
        name: "Animoca Brands",
        data: [],
        color: pieColors[1],
      };
      let alameda_research = {
        name: "Alameda Research",
        data: [],
        color: pieColors[2],
      };
      let coinbase_ventures = {
        name: "Coinbase Ventures",
        data: [],
        color: pieColors[3],
      };
      let ld_capital = {
        name: "LD Capital",
        data: [],
        color: pieColors[4],
      };
      let infinity_ventures = {
        name: "Infinity Ventures",
        data: [],
        color: pieColors[5],
      };
      let hashed = {
        name: "Hashed",
        data: [],
        color: pieColors[6],
      };
      let andreessen_horowitz = {
        name: "Andreessen Horowitz",
        data: [],
        color: pieColors[7],
      };
      let shima_capital = {
        name: "Shima Capital",
        data: [],
        color: pieColors[8],
      };
      let hashkey_capital = {
        name: "Hashkey Capital",
        data: [],
        color: pieColors[9],
      };
      spartan_group.data = data.map((v) => {
        let index = v.investorDeals.findIndex((x) =>
          x.name.includes("Spartan Group")
        );
        if (index != -1)
          return [
            v.time,
            v.investorDeals[index].deals,
            v.investorDeals[index].deals,
          ];
      });
      spartan_group.data = spartan_group.data.filter((x) => x);
      // spartan_group.data.push([
      //   data[data.length - 1].time,
      //   null,
      //   null,
      // ]);
      console.log(spartan_group.data);
      animoca_brands.data = data.map((v) => {
        let index = v.investorDeals.findIndex((x) =>
          x.name.includes("Animoca Brands")
        );
        if (index != -1)
          return [
            v.time,
            v.investorDeals[index].deals,
            v.investorDeals[index].deals,
          ];
      });
      animoca_brands.data = animoca_brands.data.filter((x) => x);

      alameda_research.data = data.map((v) => {
        let index = v.investorDeals.findIndex((x) =>
          x.name.includes("Alameda Research")
        );
        if (index != -1)
          return [
            v.time,
            v.investorDeals[index].deals,
            v.investorDeals[index].deals,
          ];
      });
      alameda_research.data = alameda_research.data.filter((x) => x);

      coinbase_ventures.data = data.map((v) => {
        let index = v.investorDeals.findIndex((x) =>
          x.name.includes("Coinbase Ventures")
        );
        if (index != -1)
          return [
            v.time,
            v.investorDeals[index].deals,
            v.investorDeals[index].deals,
          ];
      });
      coinbase_ventures.data = coinbase_ventures.data.filter((x) => x);

      ld_capital.data = data.map((v) => {
        let index = v.investorDeals.findIndex((x) =>
          x.name.includes("LD Capital")
        );
        if (index != -1)
          return [
            v.time,
            v.investorDeals[index].deals,
            v.investorDeals[index].deals,
          ];
      });
      ld_capital.data = ld_capital.data.filter((x) => x);

      infinity_ventures.data = data.map((v) => {
        let index = v.investorDeals.findIndex((x) =>
          x.name.includes("Infinity Ventures")
        );
        if (index != -1)
          return [
            v.time,
            v.investorDeals[index].deals,
            v.investorDeals[index].deals,
          ];
      });
      infinity_ventures.data = infinity_ventures.data.filter((x) => x);

      hashed.data = data.map((v) => {
        let index = v.investorDeals.findIndex((x) => x.name.includes("Hashed"));
        if (index != -1)
          return [
            v.time,
            v.investorDeals[index].deals,
            v.investorDeals[index].deals,
          ];
      });
      hashed.data = hashed.data.filter((x) => x);

      andreessen_horowitz.data = data.map((v) => {
        let index = v.investorDeals.findIndex((x) =>
          x.name.includes("Andreessen Horowitz")
        );
        if (index != -1)
          return [
            v.time,
            v.investorDeals[index].deals,
            v.investorDeals[index].deals,
          ];
      });
      andreessen_horowitz.data = andreessen_horowitz.data.filter((x) => x);

      shima_capital.data = data.map((v) => {
        let index = v.investorDeals.findIndex((x) =>
          x.name.includes("Shima Capital")
        );
        if (index != -1)
          return [
            v.time,
            v.investorDeals[index].deals,
            v.investorDeals[index].deals,
          ];
      });
      shima_capital.data = shima_capital.data.filter((x) => x);

      hashkey_capital.data = data.map((v) => {
        let index = v.investorDeals.findIndex((x) =>
          x.name.includes("Hashkey Capital")
        );
        if (index != -1)
          return [
            v.time,
            v.investorDeals[index].deals,
            v.investorDeals[index].deals,
          ];
      });
      hashkey_capital.data = hashkey_capital.data.filter((x) => x);
      this.seriesOptions = [
        spartan_group,
        animoca_brands,
        alameda_research,
        coinbase_ventures,
        ld_capital,
        infinity_ventures,
        hashed,
        andreessen_horowitz,
        shima_capital,
        hashkey_capital,
      ];
    },
  },
};
</script>
