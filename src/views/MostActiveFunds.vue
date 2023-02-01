<template>
  <BlockChart :loading="loading">
    <template #title>
      <div class="w-full">
        <h2 class="text-white font-bold text-[20px]">
          Most Active Funds
          <TimeFrame
            class="relative z-[1] top-[4px]"
            :time_frame="time_frame"
            :time_fetch="time"
            @set_time_frame="(v) => (time = v)"
          />
        </h2>
      </div>
    </template>
    <HighChart
      id="most-active-funds"
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
import { roundValue } from "@/ultis";
let highcharts = require("highcharts");
require("highcharts/highcharts-more")(highcharts);
require("highcharts/modules/accessibility")(highcharts);
require("highcharts/modules/exporting")(highcharts);
var pieColors = [
  "rgb(255, 164, 200)",
  "rgb(145, 232, 225)",
  "rgb(124, 181, 236)",
  "rgb(97, 100, 255)",
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
    legendX: 0,
    legendY: 0,
    verticalAlign: "top",
    labelFormat: "{value:%b, %y}",
    tickInterval: 30 * 24 * 3600 * 1000,
    startDate: null,
    endDate: null,
    buttonPositionX: 0,
    buttonPositionY: -8,
    buttonPositionAlign: "right",
    time_frame: ["6m", "1y", "2y", "YTD", "All"],
    time: "6m",
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
          type: "bubble",
          zoomType: "xy",
          // events: {
          //   load() {
          //     const chart = this,
          //       startDate = vm.startDate,
          //       endDate = vm.endDate;

          //     chart.xAxis[0].setExtremes(startDate, endDate);
          //   },
          // },
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
            align: this.buttonPositionAlign,
            x: this.buttonPositionX,
            y: this.buttonPositionY,
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
            style: {
              fontWeight: 600,
            },
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
            stacking: "normnal",
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

    async setDataChart() {
      let data = this.data;
      this.seriesOptions = [];
      let investors = [];
      let time = null;
      let now = moment(new Date().getTime());
      if (this.time == "6m")
        time = new Date(
          Date.UTC(now.year(), now.month() - 6, 1, 0, 0, 0)
        ).getTime();
      if (this.time == "1y")
        time = new Date(
          Date.UTC(now.year() - 1, now.month(), 1, 0, 0, 0)
        ).getTime();
      if (this.time == "2y")
        time = new Date(
          Date.UTC(now.year() - 2, now.month(), 1, 0, 0, 0)
        ).getTime();
      if (this.time == "ytd")
        time = new Date(Date.UTC(now.year(), 0, 1, 0, 0, 0)).getTime();
      if (this.time == "all") time = new Date(time).getTime();
      data = data.filter((x) => !(x.time < time));
      data.forEach((item) => {
        investors = investors.concat(item.investor);
      });
      let investorDeals = [];
      for (const investor of investors) {
        let index = investorDeals.findIndex((x) => x.name == investor);
        if (index == -1) investorDeals.push({ name: investor, deals: 1 });
        else investorDeals[index].deals++;
      }
      investorDeals = investorDeals.sort((a, b) => b.deals - a.deals);
      investorDeals = investorDeals.slice(0, 10);
      let dataSeries = [];
      let i = 0;
      investorDeals.forEach((item) => {
        dataSeries.push({ name: item.name, data: [], color: pieColors[i] });
        i++;
      });
      dataSeries.forEach((item) => {
        item.data = data.map((v) => {
          let index = v.investorDeals.findIndex((x) => x.name == item.name);
          if (index != -1)
            return [
              v.time,
              v.investorDeals[index].deals,
              v.investorDeals[index].deals,
            ];
        });
        item.data = item.data.filter((x) => x);
      });
      dataSeries.forEach((item) => {
        this.seriesOptions.push(item);
      });
    },
  },
};
</script>
