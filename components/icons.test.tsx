import type { ComponentType, SVGProps } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ArrowIcon,
  BagIcon,
  ChevronIcon,
  MinusIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "@/components/icons";

const icons: Array<
  [string, ComponentType<SVGProps<SVGSVGElement>>]
> = [
  ["Bag", BagIcon],
  ["Search", SearchIcon],
  ["Arrow", ArrowIcon],
  ["Minus", MinusIcon],
  ["Plus", PlusIcon],
  ["Trash", TrashIcon],
  ["Chevron", ChevronIcon],
];

describe("icons", () => {
  it.each(icons)("%sIcon is decorative and forwards SVG props", (_name, Icon) => {
    render(<Icon data-testid="icon" className="custom-icon" width={32} />);

    const icon = screen.getByTestId("icon");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
    expect(icon).toHaveAttribute("width", "32");
    expect(icon).toHaveClass("custom-icon");
    expect(icon.childElementCount).toBeGreaterThan(0);
  });
});
