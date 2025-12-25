import { FullRefund, NoRefund, PartialRefund } from "./refund";
import type { RefundRule } from "./refund_rule.interface";

export const createRefundRule = (daysDiff: number): RefundRule => {
	if (daysDiff > 7) {
		return new FullRefund();
	}

	if (daysDiff <= 7 && daysDiff > 0) {
		return new PartialRefund();
	}

	if (daysDiff <= 0) {
		return new NoRefund();
	}

	throw new Error("Invalid days difference");
};
