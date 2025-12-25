import type { RefundRule } from "./refund_rule.interface";

export class FullRefund implements RefundRule {
	calculateRefund(totalPrice: number): number {
		return totalPrice * 0;
	}
}

export class NoRefund implements RefundRule {
	calculateRefund(totalPrice: number): number {
		return totalPrice;
	}
}

export class PartialRefund implements RefundRule {
	constructor(private refundPercentage: number = 0.5) {
		this.refundPercentage = 0.5;
	}

	calculateRefund(totalPrice: number): number {
		return totalPrice * this.refundPercentage;
	}
}
