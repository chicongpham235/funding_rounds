export let formatter = (number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number);
};
export let formatUSD = (value) => {
  return new Intl.NumberFormat("en-DE").format(value ? value : 0);
};

export let formatBillion = (value) => {
  if (!value) {
    value = 0;
  }
  return value > 1000000000 ? value / 1000000000 + " B" : value;
};
export let formatBillionUSD = (value) => {
  if (!value) {
    value = 0;
  }
  return value > 1000000000
    ? formatUSD(roundValue(value / 1000000000, 1)) + " B"
    : formatUSD(value);
};

export let handlerPersion = (value, withoutMultiplication = false) => {
  if (!value) {
    return "0 %";
  }
  value = parseFloat(value);
  if (!withoutMultiplication) {
    value = value * 100;
  }
  value = roundValue(value);
  return `${value} %`;
};

export let styleColor = (value, isString = false) => {
  if (isString) {
    value = value.replace(/[^\d.-]/g, "");
  }
  //#e85b5a
  let color = "#8dc950";
  if (value && parseFloat(value) < 0) {
    color = "#e85b5a";
  }

  return color;
};

export let roundValue = (value, precision = 1) => {
  if (!value) {
    return 0;
  }
  value = parseFloat(value);
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export let colorByPercent = (value) => {
  value = roundValue(value, 2);
  if (value <= -15) {
    return "#6A3235";
  }
  if (value <= -10) {
    return "#834246";
  }
  if (value <= -5) {
    return "#953238";
  }
  if (value < -0.1) {
    return "#953238";
  }
  if (value >= 15) {
    return "#00593D";
  }
  if (value >= 10) {
    return "#01634C";
  }
  if (value > 0.1) {
    return "#00805A";
  }
  // if (value = 0) {
  //   return "#22262b";
  // }
  return "#22262b";
};
export let handlerChange = (now, last) => {
  let change = now - last;
  let positive = change >= 0 ? 1 : -1;
  if (positive == -1) {
    change *= -1;
  }
  return (change / last) * 100 * positive;
};

export let handlerPrice = (price, precision = 1) => {
  price = parseFloat(price);
  if (price >= 1000000000) {
    return roundValue(price / 1000000000, precision) + "B";
  }
  if (price >= 1000000) {
    return roundValue(price / 1000000, precision) + "M";
  }
  if (price >= 1000) {
    return roundValue(price / 1000, precision) + "K";
  }
  return roundValue(price);
};

export let handlerColor = (value) => {
  value = roundValue(value, 2);
  if (value > 0) {
    return {
      bgColor: "#0f8f6233",
      color: "#8dc950",
    };
  }
  if (value < 0) {
    return {
      bgColor: "#f8496033",
      color: "#e0294a",
    };
  }
  return {
    color: "#fff",
    bgColor: "#22262b",
  };
};
