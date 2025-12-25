import { FullRefund, NoRefund, PartialRefund } from "./refund";

describe("Refund", () => {
	it("it should return 100 for FullRefund", () => {
		const fullRefund = new FullRefund();
		const refundAmount = fullRefund.calculateRefund(100);
		expect(refundAmount).toBe(0);
	});

	it("it should return 0 for NoRefund", () => {
		const noRefund = new NoRefund();
		const refundAmount = noRefund.calculateRefund(100);
		expect(refundAmount).toBe(100);
	});

	it("it should return 50 for PartialRefund", () => {
		const partialRefund = new PartialRefund();
		const refundAmount = partialRefund.calculateRefund(100);
		expect(refundAmount).toBe(50);
	});
});
