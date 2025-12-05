import { describe, expect, it } from "vitest";
import { mapPrimaryMuscles } from "./helpers";

describe("mapPrimaryMuscles", () => {
  it("summarises primary muscles correctly", () => {
    const primaryMuscles = ["Legs", "Legs", "Arms"];
    const result = mapPrimaryMuscles(primaryMuscles);
    expect(result).toEqual({ Legs: 2, Arms: 1 });
  });

  it("handles undefined values", () => {
    const primaryMuscles = ["Back", undefined, "Back", "Chest"];
    const result = mapPrimaryMuscles(primaryMuscles);
    expect(result).toEqual({ Back: 2, Chest: 1 });
  });

  it("handles undefined input array", () => {
    const result = mapPrimaryMuscles([undefined, undefined, undefined]);
    expect(result).toEqual({});
  });
});
