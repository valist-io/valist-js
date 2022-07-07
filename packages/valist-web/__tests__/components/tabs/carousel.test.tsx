import { spliceCircular } from "../../../components/Discovery/Carousel";

describe("spliceCircular", () => {
  it("works", () => {
    expect(spliceCircular([1, 2, 3, 4], 0, 4)).toEqual([1, 2, 3, 4]);
    expect(spliceCircular([1, 2, 3, 4, 5, 6, 7, 8], 0, 4)).toEqual([1, 2, 3, 4]);
    expect(spliceCircular([1, 2, 3, 4, 5, 6, 7, 8], 1, 4)).toEqual([2, 3, 4, 5]);

    expect(spliceCircular([1, 2, 3, 4, 5, 6, 7, 8], -1, 4)).toEqual([8, 1, 2, 3]);
    expect(spliceCircular([1, 2, 3, 4, 5, 6, 7, 8], -2, 4)).toEqual([7, 8, 1, 2]);
    expect(spliceCircular([1, 2, 3, 4, 5, 6, 7, 8], -6, 4)).toEqual([3, 4, 5, 6]);
    expect(spliceCircular([1, 2, 3, 4, 5, 6, 7, 8], -7, 4)).toEqual([2, 3, 4, 5]);
    expect(spliceCircular([1, 2, 3, 4, 5, 6, 7, 8], -8, 4)).toEqual([1, 2, 3, 4]);
  });
});
