import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { useMediaQuery } from "./use-media-query";

function setMatchMedia(matches: boolean) {
  window.matchMedia = ((q: string) => ({
    matches,
    media: q,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  })) as any;
}

describe("useMediaQuery", () => {
  it("returns true when the query matches", () => {
    setMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery("(min-width: 100px)"));
    expect(result.current).toBe(true);
  });

  it("returns false when the query does not match", () => {
    setMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery("(min-width: 100000px)"));
    expect(result.current).toBe(false);
  });
});
