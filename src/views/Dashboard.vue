<template>
  <div class="bg-[#16151a] w-full">
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-12">
        <VCMoneyInvestedAndBTCPrice :api_res_data="res_data" />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="xl:col-span-6 lg:col-span-6 md:col-span-12">
        <FundingRoundsByInvestor :api_res_data="res_data" />
      </div>
      <div class="xl:col-span-6 lg:col-span-6 md:col-span-12">
        <FundingAmountByInvestor :api_res_data="res_data" />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-12">
        <FundingRoundsByInvestorAndCategory :api_res_data="res_data" />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-4 mb-4">
      <div class="col-span-12">
        <MostActiveFunds :api_res_data="res_data" />
      </div>
    </div>
  </div>
</template>
<script>
import { FUNDING_API } from "@/services/api";
import FundingRoundsByInvestor from "./FundingRoundsByInvestor.vue";
import FundingAmountByInvestor from "./FundingAmountByInvestor.vue";
import FundingRoundsByInvestorAndCategory from "./FundingRoundsByInvestorAndCategory.vue";
import MostActiveFunds from "./MostActiveFunds.vue";
import VCMoneyInvestedAndBTCPrice from "./VCMoneyInvestedAndBTCPrice.vue";
export default {
  components: {
    FundingRoundsByInvestor,
    FundingAmountByInvestor,
    FundingRoundsByInvestorAndCategory,
    MostActiveFunds,
    VCMoneyInvestedAndBTCPrice,
  },
  name: "dash-board",
  data: () => ({
    res_data: [],
  }),
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const res = await FUNDING_API();
        this.res_data =
          res.data.map((v) => {
            v.date = v.date * 1000;
            return v;
          }) ?? [];
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
