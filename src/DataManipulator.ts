import { ServerRespond } from './DataStreamer';
// updating the interface to sync with what we are receiving and send to render
export interface Row {
  abc_price: number,
  def_price: number,
  ratio_of_prices: number,
  timestamp: Date,
  upper_bound_val: number,
  lower_bound_val: number,
  alert_val: number | undefined,
}


export class DataManipulator {
  static generateRow(serverRespond: ServerRespond[]): Row {
    const ABCprice = (serverRespond[0].top_ask.price + serverRespond[0].top_bid.price) / 2;
    const DEFprice = (serverRespond[1].top_ask.price + serverRespond[1].top_bid.price) / 2;
    const ratio = ABCprice / DEFprice;
    const upperBound = 1 + 0.05;
    const lowerBound = 1 - 0.05;
    return {
      abc_price  : ABCprice,
      def_price  : DEFprice,
      ratio_of_prices:ratio,
      timestamp: serverRespond[0].timestamp > serverRespond[1].timestamp ?
        serverRespond[0].timestamp : serverRespond[1].timestamp,
        upper_bound_val: upperBound,
        lower_bound_val: lowerBound,
        alert_val: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}
