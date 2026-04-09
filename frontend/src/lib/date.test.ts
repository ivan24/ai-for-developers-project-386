import { describe, expect, it } from "vitest";
import { getSlotQueryRange, groupSlotsByDay } from "./date";

describe("date helpers", () => {
  it("builds a UTC query range for a selected local day", () => {
    const range = getSlotQueryRange(new Date("2026-04-08T10:15:00.000Z"));

    expect(range.from).toContain("T");
    expect(range.to).toContain("T");
    expect(range.limit).toBe(200);
    expect(range.offset).toBe(0);
  });

  it("groups slots by local calendar day", () => {
    const grouped = groupSlotsByDay([
      {
        eventTypeId: "demo",
        startAt: "2026-04-08T10:00:00.000Z",
        endAt: "2026-04-08T10:30:00.000Z",
        isAvailable: true,
      },
      {
        eventTypeId: "demo",
        startAt: "2026-04-08T12:00:00.000Z",
        endAt: "2026-04-08T12:30:00.000Z",
        isAvailable: true,
      },
    ]);

    expect(Object.keys(grouped)).toHaveLength(1);
    expect(Object.values(grouped)[0]).toHaveLength(2);
  });
});
