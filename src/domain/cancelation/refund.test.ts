import { FullRefund, NoRefund, PartialRefund } from "./refund";

describe("Refund", () => {
	it("it should return 0 as the price for FullRefund", () => {
		const fullRefund = new FullRefund();
		const price = fullRefund.calculateRefund(100);
		expect(price).toBe(0);
	});

	it("it should return 100 as the price for NoRefund", () => {
		const noRefund = new NoRefund();
		const price = noRefund.calculateRefund(100);
		expect(price).toBe(100);
	});

	it("it should return 50 as the price for PartialRefund", () => {
		const partialRefund = new PartialRefund();
		const price = partialRefund.calculateRefund(100);
		expect(price).toBe(50);
	});
});
