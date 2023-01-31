<template>
  <BlockChart :loading="loading">
    <template #title>
      <div class="w-full">
        <h2 class="text-white font-bold text-[20px]">
          VC Money Invested in Crypto & BTC Price
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
      id="vc-money-invested-and-btc-price"
      :options="options"
      height="600px"
      ref="highchart"
      isStockChart
    />
  </BlockChart>
</template>

<script>
import moment from "moment";
import { getQuarterFromMonth, handlerPrice, roundValue } from "@/ultis";
import { BTC_API } from "@/services/api";
import BlockChart from "@/components/BlockChart.vue";
import HighChart from "@/components/HighChart.vue";
import TimeFrame from "@/components/TimeFrame.vue";
let highchartStock = require("highcharts/highstock");
require("highcharts/highcharts-more")(highchartStock);
// highchartStock.seriesTypes.arearange.prototype.drawLegendSymbol =
//   highchartStock.seriesTypes.line.prototype.drawLegendSymbol;
moment.updateLocale("en", {
  week: {
    dow: 1, // First day of week is Monday
  },
});
// var groupingUnits = [
//   ["day", [7]],
//   ["month", [1, 3]],
// ];
export default {
  name: "vc-money-invested-and-btc-price",
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
    btc_data: [],
    vc_money_invested: [],
    btc: [],
    time_frame: ["Weekly", "Monthly", "Quarterly"],
    time: "monthly",
    labelFormat: "{value:%b, %y}",
    symbol: {},
    interval: null,
    loading: true,
    functionFireChart: null,
    yCategories: [],
    seriesOptions: [],
    legendX: 50,
    legendY: -10,
    verticalAlign: "top",
    tickInterval: 1 * 30 * 24 * 3600 * 1000,
  }),
  watch: {
    api_res_data: {
      handler() {
        this.data = this.api_res_data;
        this.init();
      },
    },
    time: {
      handler() {
        this.loading = true;
        this.setChart();
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
        rangeSelector: {
          inputEnabled: false,
          enabled: false,
        },
        title: {
          text: null,
        },
        xAxis: {
          title: null,
          type: "datetime",
          labels: {
            format: this.labelFormat,
            style: {
              color: "rgb(156 163 175)",
            },
          },
          crosshair: {
            color: "#ffffff1f",
            snap: false,
            dashStyle: "longdash",
          },
          // tickAmount: 5,
          // tickPixelInterval: 0,
          tickInterval: this.tickInterval,
        },
        yAxis: [
          {
            gridLineColor: "#ffffff1f",
            // gridLineDashStyle: "longdash",
            labels: {
              formatter: function () {
                return "$" + handlerPrice(this.value);
              },
              style: {
                color: "rgb(156 163 175)",
              },
            },
            title: {
              text: "VC Money Invested",
              style: {
                fontWeight: 600,
              },
            },
            opposite: false,
            tickAmount: 5,
            showLastLabel: true,
          },
          {
            // Secondary yAxis
            gridLineColor: "#ffffff1f",
            // gridLineDashStyle: "longdash",
            gridLineWidth: 0,
            title: {
              text: "BTC Price",
              style: {
                fontWeight: 600,
              },
            },
            labels: {
              formatter: function () {
                return "$" + handlerPrice(this.value);
              },
              style: {
                color: "rgb(156 163 175)",
              },
            },
            opposite: true,
            crosshair: {
              color: "#ffffff1f",
              snap: false,
              dashStyle: "longdash",
            },
            showLastLabel: true,
          },
        ],
        credits: {
          enabled: false,
        },
        legend: {
          enabled: true,
          align: "left",
          verticalAlign: this.verticalAlign,
          x: this.legendX,
          y: this.legendY,
          itemStyle: {
            color: "#fff",
            fontWeight: "normal",
          },
          itemHoverStyle: {
            color: "#fff",
            fontWeight: "bold",
          },
          itemMarginBottom: 8,
        },
        tooltip: {
          useHTML: true,
          backgroundColor: "#1f2937",
          followPointer: true,
          split: true,
          followTouchMove: false,
          animation: false,
          borderRadius: 5,
          borderWidth: 1,
          shadow: false,
          padding: 4,
          hideDelay: 0,
          style: {
            color: "#fff",
          },
          headerFormat: null,
          pointFormatter: function () {
            let time = moment(this.x);
            if (vm.time == "weekly") {
              // time = "Week " + time.week() + ", " + time.year();
              let startWeek = time.startOf("week").format("DD, MMM, YYYY");
              let endWeek = time.endOf("week");
              let now = new Date().getTime();
              if (endWeek.unix() * 1000 > now)
                endWeek = moment(now).format("DD, MMM, YYYY");
              else endWeek = endWeek.format("DD, MMM, YYYY");
              time = startWeek + " - " + endWeek;
            }
            if (vm.time == "monthly") time = time.format("MMM, YYYY");
            if (vm.time == "quarterly")
              time =
                "Quarter " +
                (getQuarterFromMonth(time.month()) + 1) +
                ", " +
                time.year();
            let content = `<div class="text-gray-500 font-semibold">${time}</div>
            <div><span style="color:${this.series.color}">${
              this.series.name
            }</span>: <span class="font-semibold">$${handlerPrice(
              this.y,
              2
            )}</span></div>`;
            return content;
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
            groupPadding: 0.15,
            fillOpacity: 0.4,
          },
        },
        series: this.seriesOptions,
      };
    },
  },
  methods: {
    async init() {
      let amount = {
        name: "VC Money Invested",
        data: [],
        yAxis: 0,
        color: "rgb(97, 100, 255)",
        borderWidth: 0,
        dataGrouping: {
          // units: groupingUnits,
          enabled: false,
        },
      };
      let btc = {
        name: "BTC Price",
        data: [],
        type: "spline",
        color: "#f2ba2a",
        yAxis: 1,
        marker: {
          enabled: false,
        },
        dataGrouping: {
          // units: groupingUnits,
          enabled: false,
        },
      };
      try {
        this.loading = true;
        await this.fetchBTCData();
        this.setChart();
      } catch (error) {
        console.log(error);
        this.seriesOptions = [amount, btc];
      } finally {
        this.loading = false;
      }
    },

    async fetchBTCData() {
      try {
        const res = await BTC_API();
        this.btc_data = res.data;
      } catch (error) {
        console.log(error);
      }
    },

    configData() {
      let vm = this;
      this.vc_money_invested = [];
      this.vc_money_invested = this.data.reduce(function (
        accumulator,
        currentValue
      ) {
        let timestamp = moment(currentValue.date);
        let time = null;
        if (vm.time == "weekly") {
          time = timestamp.startOf("week").unix() * 1000 + 7 * 3600 * 1000;
        }
        if (vm.time == "monthly") {
          time = new Date(
            Date.UTC(timestamp.year(), timestamp.month(), 1, 0, 0, 0)
          ).getTime();
        }
        if (vm.time == "quarterly") {
          let quarter = Math.floor(timestamp.month() / 3) * 3;
          time = new Date(
            Date.UTC(timestamp.year(), quarter, 1, 0, 0, 0)
          ).getTime();
        }
        if (!accumulator[time]) {
          accumulator[time] = {
            time: time,
            amount: 0,
          };
          vm.vc_money_invested.push([accumulator[time]]);
        }
        accumulator[time].amount += currentValue.amount;
        return accumulator;
      },
      {});
      this.vc_money_invested = Object.values(this.vc_money_invested).sort(
        (a, b) => a.time - b.time
      );
    },

    configBTCData() {
      let result = [];
      let vm = this;
      result = this.btc_data.reduce(function (accumulator, currentValue) {
        let timestamp = moment(currentValue.period);
        let time = null;
        if (vm.time == "weekly") {
          time = timestamp.startOf("week").unix() * 1000 + 7 * 3600 * 1000;
        }
        if (vm.time == "monthly") {
          time = new Date(
            Date.UTC(timestamp.year(), timestamp.month(), 1, 0, 0, 0)
          ).getTime();
        }
        if (vm.time == "quarterly") {
          let quarter = Math.floor(timestamp.month() / 3) * 3;
          time = new Date(
            Date.UTC(timestamp.year(), quarter, 1, 0, 0, 0)
          ).getTime();
        }
        if (!accumulator[time]) {
          accumulator[time] = {
            time: time,
            btc_price: null,
          };
          result.push([accumulator[time]]);
        }
        if (!accumulator[time].btc_price)
          accumulator[time].btc_price = Number(currentValue.high);
        else {
          if (accumulator[time].btc_price < Number(currentValue.high))
            accumulator[time].btc_price = Number(currentValue.high);
        }
        return accumulator;
      }, {});
      result = Object.values(result).sort((a, b) => a.time - b.time);
      this.btc = result;
    },

    setChart() {
      this.configBTCData();
      this.configData();
      this.setDataChart();
    },

    setDataChart() {
      let amount = {
        name: "VC Money Invested",
        data: [],
        yAxis: 0,
        color: "rgb(97, 100, 255)",
        borderWidth: 0,
        dataGrouping: {
          // units: groupingUnits,
          enabled: false,
        },
      };
      let btc = {
        name: "BTC Price",
        data: [],
        type: "spline",
        // lineWidth: 1,
        color: "#f2ba2a",
        yAxis: 1,
        marker: {
          enabled: false,
        },
        dataGrouping: {
          // units: groupingUnits,
          enabled: false,
        },
      };
      this.btc.forEach((item) => {
        let index = this.vc_money_invested.findIndex(
          (x) => x.time == item.time
        );
        if (index != -1) {
          this.vc_money_invested[index].btc_price = item.btc_price;
        }
      });

      amount.data = this.vc_money_invested.map((v) => {
        return [v.time, v.amount * 1000000];
      });
      btc.data = this.btc.map((v) => {
        return [v.time, v.btc_price];
      });
      this.seriesOptions = [amount, btc];
      if (this.time == "weekly") {
        this.labelFormat = "{value:W%w, %y}";
        this.tickInterval = 7 * 24 * 3600 * 1000;
      }
      if (this.time == "monthly") {
        this.labelFormat = "{value:%b, %y}";
        this.tickInterval = 1 * 30 * 24 * 3600 * 1000;
      }
      if (this.time == "quarterly") {
        this.labelFormat = "{value:Q%q, %y}";
        this.tickInterval = 3 * 30 * 24 * 3600 * 1000;
      }
    },
  },
};
</script>
