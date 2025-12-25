import { FullRefund, NoRefund, PartialRefund } from "./refund";
import { createRefundRule } from "./refund_rule.factory";

describe("RefundRuleFactory", () => {
	it("should return FullRefund for daysDiff > 7", () => {
		const refundRule = createRefundRule(10);
		expect(refundRule).toBeInstanceOf(FullRefund);
	});

	it("should return PartialRefund for 0 < daysDiff <= 7", () => {
		const refundRule = createRefundRule(5);
		expect(refundRule).toBeInstanceOf(PartialRefund);
	});

	it("should return NoRefund for daysDiff <= 0", () => {
		const refundRule = createRefundRule(0);
		expect(refundRule).toBeInstanceOf(NoRefund);
	});

	it("should return NoRefund for negative daysDiff", () => {
		const refundRule = createRefundRule(-3);
		expect(refundRule).toBeInstanceOf(NoRefund);
	});

	it("should throw an error for invalid daysDiff", () => {
		expect(() => createRefundRule(NaN)).toThrow("Invalid days difference");
	});
});
