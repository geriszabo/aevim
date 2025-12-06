import { describe, expect, it } from "vitest";
import { mapPrimaryMuscles, toSentenceCase } from "./utils";

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

describe("toSentenceCase", () => {
  it("converts string to sentence case", () => {
    const input = "hELLO wORLD";
    const result = toSentenceCase(input);
    expect(result).toBe("Hello world");
  });

  it("returns undefined when input is undefined", () => {
    const result = toSentenceCase(undefined);
    expect(result).toBeUndefined();
  });

  it("handles empty string", () => {
    const result = toSentenceCase("");
    expect(result).toBe("");
  });

  it("handles numbers", () => {
    const input = "69 hehe lol";
    const result = toSentenceCase(input);
    expect(result).toBe("69 hehe lol");
  });
});
