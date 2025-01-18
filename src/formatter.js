import get from "lodash/get";
import { key_utils } from "./auth/ecc";

module.exports = pixaAPI => {
  function numberWithCommas(x) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function vestingPixa(account, gprops) {
    const vests = parseFloat(account.vesting_shares.split(" ")[0]);
    const total_vests = parseFloat(gprops.total_vesting_shares.split(" ")[0]);
    const total_vest_pixa = parseFloat(
      gprops.total_vesting_fund_pixa.split(" ")[0]
    );
    const vesting_pixaf = total_vest_pixa * (vests / total_vests);
    return vesting_pixaf;
  }

  function processOrders(open_orders, assetPrecision) {
    const pxsOrders = !open_orders
      ? 0
      : open_orders.reduce((o, order) => {
          if (order.sell_price.base.indexOf("PXS") !== -1) {
            o += order.for_sale;
          }
          return o;
        }, 0) / assetPrecision;

    const pixaOrders = !open_orders
      ? 0
      : open_orders.reduce((o, order) => {
          if (order.sell_price.base.indexOf("PXC") !== -1) {
            o += order.for_sale;
          }
          return o;
        }, 0) / assetPrecision;

    return { pixaOrders, pxsOrders };
  }

  function calculateSaving(savings_withdraws) {
    let savings_pending = 0;
    let savings_pxs_pending = 0;
    savings_withdraws.forEach(withdraw => {
      const [amount, asset] = withdraw.amount.split(" ");
      if (asset === "PXC") savings_pending += parseFloat(amount);
      else {
        if (asset === "PXS") savings_pxs_pending += parseFloat(amount);
      }
    });
    return { savings_pending, savings_pxs_pending };
  }

  function pricePerPixa(feed_price) {
    let price_per_pixa = undefined;
    const { base, quote } = feed_price;
    if (/ PXS$/.test(base) && / PXC$/.test(quote)) {
      price_per_pixa = parseFloat(base.split(" ")[0]) / parseFloat(quote.split(" ")[0]);
    }
    return price_per_pixa;
  }

  function estimateAccountValue(
    account,
    { gprops, feed_price, open_orders, savings_withdraws, vesting_pixa } = {}
  ) {
    const promises = [];
    const username = account.name;
    const assetPrecision = 1000;
    let orders, savings;

    if (!vesting_pixa || !feed_price) {
      if (!gprops || !feed_price) {
        promises.push(
          pixaAPI.getStateAsync(`/@${username}`).then(data => {
            gprops = data.props;
            feed_price = data.feed_price;
            vesting_pixa = vestingPixa(account, gprops);
          })
        );
      } else {
        vesting_pixa = vestingPixa(account, gprops);
      }
    }

    if (!open_orders) {
      promises.push(
        pixaAPI.getOpenOrdersAsync(username).then(open_orders => {
          orders = processOrders(open_orders, assetPrecision);
        })
      );
    } else {
      orders = processOrders(open_orders, assetPrecision);
    }

    if (!savings_withdraws) {
      promises.push(
        pixaAPI
          .getSavingsWithdrawFromAsync(username)
          .then(savings_withdraws => {
            savings = calculateSaving(savings_withdraws);
          })
      );
    } else {
      savings = calculateSaving(savings_withdraws);
    }

    return Promise.all(promises).then(() => {
      let price_per_pixa = pricePerPixa(feed_price);

      const savings_balance = account.savings_balance;
      const savings_pxs_balance = account.savings_pxs_balance;
      const balance_pixa = parseFloat(account.balance.split(" ")[0]);
      const saving_balance_pixa = parseFloat(savings_balance.split(" ")[0]);
      const pxs_balance = parseFloat(account.pxs_balance);
      const pxs_balance_savings = parseFloat(savings_pxs_balance.split(" ")[0]);

      let conversionValue = 0;
      const currentTime = new Date().getTime();
      (account.other_history || []).reduce((out, item) => {
        if (get(item, [1, "op", 0], "") !== "convert") return out;

        const timestamp = new Date(get(item, [1, "timestamp"])).getTime();
        const finishTime = timestamp + 86400000 * 3.5; // add 3.5day conversion delay
        if (finishTime < currentTime) return out;

        const amount = parseFloat(
          get(item, [1, "op", 1, "amount"]).replace(" PXS", "")
        );
        conversionValue += amount;
      }, []);

      const total_pxs =
        pxs_balance +
        pxs_balance_savings +
        savings.savings_pxs_pending +
        orders.pxsOrders +
        conversionValue;

      const total_pixa =
        vesting_pixa +
        balance_pixa +
        saving_balance_pixa +
        savings.savings_pending +
        orders.pixaOrders;

      return (total_pixa * price_per_pixa + total_pxs).toFixed(2);
    });
  }

  function createSuggestedPassword() {
    const PASSWORD_LENGTH = 32;
    const privateKey = key_utils.get_random_key();
    return privateKey.toWif().substring(3, 3 + PASSWORD_LENGTH);
  }

  return {
    reputation: function(reputation) {
      if (reputation == 0) return 25;
      if (!reputation) return reputation;
      let neg = reputation < 0;
      let rep = String(reputation);
      rep = neg ? rep.substring(1) : rep;
      let v = (Math.log10((rep > 0 ? rep : -rep) - 10) - 9);
      v =  neg ? -v : v;
      return parseInt(v * 9 + 25);
    },

    vestToPixa: function(
      vestingShares,
      totalVestingShares,
      totalVestingFundPixa
    ) {
      return (
        parseFloat(totalVestingFundPixa) *
        (parseFloat(vestingShares) / parseFloat(totalVestingShares))
      );
    },

    commentPermlink: function(parentAuthor, parentPermlink) {
      const timeStr = new Date()
        .toISOString()
        .replace(/[^a-zA-Z0-9]+/g, "")
        .toLowerCase();
      parentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, "");
      return "re-" + parentAuthor + "-" + parentPermlink + "-" + timeStr;
    },

    amount: function(amount, asset) {
      return amount.toFixed(3) + " " + asset;
    },
    numberWithCommas,
    vestingPixa,
    estimateAccountValue,
    createSuggestedPassword,
    pricePerPixa
  };
};
