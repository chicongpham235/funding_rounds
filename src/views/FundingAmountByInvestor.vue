<template>
  <BlockChart :loading="loading">
    <template #title>
      <div class="w-full">
        <h2 class="text-white font-bold text-[20px]">
          Funding Amount By Investor
          <TimeFrame
            class="absolute top-[42px] right-0 z-[3]"
            :time_frame="time_frame"
            :time_fetch="time"
            @set_time_frame="(v) => (time = v)"
          />
        </h2>
      </div>
    </template>
    <HighChart
      id="funding-amount-by-investor"
      :options="options"
      height="500px"
      ref="highchart"
    />
  </BlockChart>
</template>

<script>
import { roundValue, handlerPrice } from "@/ultis";
import moment from "moment";
import BlockChart from "@/components/BlockChart.vue";
import HighChart from "@/components/HighChart.vue";
import TimeFrame from "@/components/TimeFrame.vue";
let highcharts = require("highcharts");
require("highcharts/highcharts-more")(highcharts);
require("highcharts/modules/accessibility")(highcharts);
require("highcharts/modules/exporting")(highcharts);
var pieColors = (function () {
  var colors = [],
    base = highcharts.getOptions();
  for (let i = 0; i < 10; i += 1) {
    colors.push(base.colors[i]);
  }
  for (let i = 10; i < 20; i++) {
    colors.push(
      highcharts
        .color(base.colors[i - 10])
        .brighten((i - 5) / 35)
        .get()
    );
  }
  return colors;
})();
export default {
  components: {
    BlockChart,
    HighChart,
    TimeFrame,
  },
  name: "funding-amount-by-investor",
  props: {
    api_res_data: { type: Array },
  },
  data: () => ({
    data: [],
    time_frame: ["7d", "1m", "3m", "6m", "1y", "2y", "YTD", "All"],
    time: "all",
    seriesOptions: [],
    loading: true,
    legendX: 110,
    legendY: 30,
    verticalAlign: "middle",
    total: 0,
    titleText: "",
    highchartTemp: null,
    handlerPrice,
  }),
  watch: {
    api_res_data: {
      handler() {
        this.init();
      },
    },
    total: {
      handler(val) {
        this.highchartTemp?.highChart?.setTitle({
          text: `
          <div class="text-center col-span-12 font-bold text-5xl">$${handlerPrice(
            val,
            2
          )}</div>
          <div class="text-center font-medium text-2xl">Total</div>
          `,
        });
      },
    },
    time: {
      async handler() {
        this.loading = true;
        await this.fetchData();
        this.loading = false;
      },
    },
  },
  computed: {
    options(vm) {
      vm.highchartTemp = vm.$refs.highchart;
      return {
        chart: {
          backgroundColor: "#2e2e33",
          events: {
            load: function () {
              const legend = this.legend,
                boxWrapper = legend.chart.renderer.boxWrapper;
              const points = this.series[0]?.points;
              points?.forEach((point) => {
                ["label", "symbol"].forEach((prop) => {
                  let isPoint = point instanceof highcharts.Point,
                    activeClass =
                      "highcharts-legend-" +
                      (isPoint ? "point" : "series") +
                      "-active";
                  point.legendItem[prop]
                    .on("mouseover", function () {
                      this.style.fontWeight = "bold";
                      if (point.visible) {
                        points.forEach(function (inactiveItem) {
                          if (point !== inactiveItem) {
                            inactiveItem.setState("inactive", !isPoint);
                          }
                        });
                        boxWrapper.addClass(activeClass);
                        let text = `
                    <div class="text-center col-span-12 font-bold text-5xl">$${handlerPrice(
                      point.y,
                      2
                    )}</div>
                    <div class="text-center font-medium text-2xl" style="color: ${
                      point.color
                    }">${point.name}</div>
                    `;
                        vm.highchartTemp?.highChart?.setTitle({
                          text: text,
                        });
                      }
                      if (!point.visible) {
                        let text = `
                    <div class="text-center col-span-12 font-bold text-5xl">0</div>
                    <div class="text-center font-medium text-2xl">${point.name}</div>
                    `;
                        vm.highchartTemp?.highChart?.setTitle({
                          text: text,
                        });
                      }
                      point.setState("hover");
                    })
                    .on("mouseout", function () {
                      this.style.fontWeight = "normal";
                      points.forEach(function (inactiveItem) {
                        if (point !== inactiveItem) {
                          inactiveItem.setState("", !isPoint);
                        }
                      });
                      let text = `
                    <div class="text-center col-span-12 font-bold text-5xl">$${handlerPrice(
                      point.total,
                      2
                    )}</div>
                    <div class="text-center font-medium text-2xl">Total</div>
                    `;
                      vm.highchartTemp?.highChart?.setTitle({
                        text: text,
                      });
                    });
                });
              });
            },
          },
        },
        title: {
          useHTML: true,
          style: {
            color: "#ffffff",
          },
          text: this.titleText,
          align: "center",
          verticalAlign: "middle",
          x: this.legendX,
          y: this.legendY,
        },
        credits: {
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
          shared: true,
          formatter: function () {
            let result = `<div class="border border-white rounded p-2">
                <div style="color: ${this.color}">${
              this.key
            }: <span class="text-white font-semibold mr-2">$${handlerPrice(
              this.y,
              2
            )}</span><span class="text-gray-500 mr-2">
              (${roundValue(this.percentage, 2)}%)
            </span></div>
                </div>`;
            return result;
          },
        },
        legend: {
          enabled: true,
          useHTML: true,
          borderWidth: 0,
          verticalAlign: this.verticalAlign,
          layout: "vertical",
          align: "left",
          width: 200,
          itemStyle: {
            fontSize: "12px",
            color: "rgb(148 163 184)",
            fontWeight: "normal",
          },
          labelFormatter: function () {
            vm.total = this.total;
            return (
              '<div class=" "> ' +
              '<div style="display: flex; width: 170px; height:25px; justify-content: space-between;"> ' +
              "<div>" +
              this.name +
              "</div>" +
              "<div>" +
              roundValue(this.percentage, 2) +
              "%" +
              "</div>" +
              "</div>" +
              "</div>"
            );
          },
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            innerSize: "60%",
            colors: pieColors,
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
            point: {
              events: {
                mouseOver: function () {
                  let text = `
                    <div class="text-center col-span-12 font-bold text-5xl">$${handlerPrice(
                      this.y,
                      2
                    )}</div>
                    <div class="text-center font-medium text-2xl" style="color: ${
                      this.color
                    }">${this.name}</div>
                    `;
                  vm.highchartTemp?.highChart?.setTitle({
                    text: text,
                  });
                },
                mouseOut: function () {
                  let text = `
                    <div class="text-center col-span-12 font-bold text-5xl">$${handlerPrice(
                      this.total,
                      2
                    )}</div>
                    <div class="text-center font-medium text-2xl"">Total</div>
                    `;
                  vm.highchartTemp?.highChart?.setTitle({
                    text: text,
                  });
                },
              },
            },
          },
        },
        series: this.seriesOptions,
        responsive: {
          rules: [
            {
              condition: {
                maxWidth: 600,
              },
              chartOptions: {
                plotOptions: {
                  pie: {
                    innerSize: "70%",
                  },
                },
              },
            },
          ],
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
      let now = moment(new Date().getTime());
      let time = null;
      if (this.time == "7d")
        time = new Date(
          Date.UTC(now.year(), now.month(), now.date() - 7, 0, 0, 0)
        ).getTime();
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
      let data = res_data.filter((v) => !(v.date < time));
      data = data.map((v) => ({ ...v, investors: "" }));
      data = data.map((v) => {
        let investors = [];
        investors = investors.concat(v.leadInvestors);
        investors = investors.concat(v.otherInvestors);
        v.investors = investors.join(", ");
        return v;
      });
      let investorsArr = [
        { name: "a16z", amount: 0 },
        { name: "Paradigm", amount: 0 },
        { name: "Tiger Global", amount: 0 },
        { name: "Coinbase Venture", amount: 0 },
        { name: "FTX Ventures", amount: 0 },
        { name: "Sequoia Capital", amount: 0 },
        { name: "Animoca Brands", amount: 0 },
        { name: "KIRKBI", amount: 0 },
        { name: "Sony", amount: 0 },
        { name: "SoftBank", amount: 0 },
        { name: "Lightspeed Venture", amount: 0 },
        { name: "Alameda Research", amount: 0 },
        { name: "ParaFi Capital", amount: 0 },
        { name: "Circle", amount: 0 },
        { name: "Coatue", amount: 0 },
        { name: "Republic", amount: 0 },
        { name: "Dragonfly Capital", amount: 0 },
        { name: "Digital Currency", amount: 0 },
        { name: "Seven Seven Six", amount: 0 },
        { name: "Jump Crypto", amount: 0 },
      ];
      let total = 0;
      investorsArr.forEach((item) => {
        data.forEach((x) => {
          if (x.investors.includes(item.name)) item.amount += x.amount;
        });
        item.amount = roundValue(item.amount * 1000000);
        total += item.amount;
      });
      this.total = 0;
      data.forEach((item) => {
        this.total += item.amount;
      });
      this.total = roundValue(this.total * 1000000);
      let dataSeries = [];
      let i = 0;
      investorsArr.forEach((element) => {
        dataSeries.push({
          name: element.name,
          y: element.amount,
          color: pieColors[i],
        });
        i++;
      });
      dataSeries = dataSeries.sort((a, b) => b.y - a.y);
      dataSeries.push({
        name: "Others",
        y: this.total - total,
        color: "rgb(209 213 219)",
      });
      let indexOthers = dataSeries.findIndex((x) => x.name == "Others");
      dataSeries.forEach((x) => {
        if (x.y / this.total <= 0.02 && x.name != "Others") {
          dataSeries[indexOthers].y += x.y;
        }
      });
      dataSeries = dataSeries.filter(
        (x) => x.y / this.total > 0.02 || (x.name == "Others" && x.y > 0)
      );
      this.seriesOptions = [
        {
          type: "pie",
          name: "Percent",
          data: dataSeries,
        },
      ];
      this.titleText = `
        <div class="text-center col-span-12 font-bold text-5xl">$${handlerPrice(
          this.total,
          2
        )}</div>
        <div class="text-center font-medium text-2xl">Total</div>`;
    },
  },
};
</script>
