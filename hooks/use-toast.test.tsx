import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { reducer, useToast } from "./use-toast";

type State = { toasts: any[] };

const base: State = { toasts: [] };

describe("use-toast reducer", () => {
  it("ADD_TOAST adds a toast and respects the limit of 3", () => {
    let state: State = { ...base };
    for (let i = 0; i < 5; i++) {
      state = reducer(state as any, {
        type: "ADD_TOAST",
        toast: { id: String(i), title: `t${i}`, open: true },
      } as any);
    }
    expect(state.toasts).toHaveLength(3);
    // newest first
    expect(state.toasts[0].id).toBe("4");
  });

  it("UPDATE_TOAST merges fields by id", () => {
    const start: State = { toasts: [{ id: "1", title: "old", open: true }] };
    const next = reducer(start as any, {
      type: "UPDATE_TOAST",
      toast: { id: "1", title: "new" },
    } as any);
    expect(next.toasts[0].title).toBe("new");
  });

  it("DISMISS_TOAST sets open to false", () => {
    const start: State = { toasts: [{ id: "1", title: "x", open: true }] };
    const next = reducer(start as any, { type: "DISMISS_TOAST", toastId: "1" } as any);
    expect(next.toasts[0].open).toBe(false);
  });

  it("REMOVE_TOAST removes by id, and clears all when id is undefined", () => {
    const start: State = {
      toasts: [
        { id: "1", title: "a", open: true },
        { id: "2", title: "b", open: true },
      ],
    };
    const afterOne = reducer(start as any, { type: "REMOVE_TOAST", toastId: "1" } as any);
    expect(afterOne.toasts.map((t) => t.id)).toEqual(["2"]);

    const afterAll = reducer(start as any, { type: "REMOVE_TOAST" } as any);
    expect(afterAll.toasts).toHaveLength(0);
  });
});

describe("useToast", () => {
  it("adds a toast via the toast() action", () => {
    const { result } = renderHook(() => useToast());
    const before = result.current.toasts.length;
    act(() => {
      result.current.toast({ title: "Hi there" });
    });
    expect(result.current.toasts.length).toBeGreaterThan(before);
    expect(result.current.toasts.some((t) => t.title === "Hi there")).toBe(true);
  });
});
