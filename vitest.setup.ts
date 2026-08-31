import "@testing-library/jest-dom/vitest";
import type {
  AnchorHTMLAttributes,
  ImgHTMLAttributes,
  ReactNode,
} from "react";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

type MockLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string | URL;
  children?: ReactNode;
};

type MockImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string | { src: string };
  fill?: boolean;
  priority?: boolean;
};

vi.mock("next/link", async () => {
  const { createElement, forwardRef } = await import("react");

  return {
    default: forwardRef<HTMLAnchorElement, MockLinkProps>(function MockLink(
      { href, children, ...props },
      ref,
    ) {
      return createElement(
        "a",
        { ...props, href: typeof href === "string" ? href : href.toString(), ref },
        children,
      );
    }),
  };
});

vi.mock("next/image", async () => {
  const { createElement } = await import("react");

  return {
    default: function MockImage({
      src,
      fill,
      priority,
      ...props
    }: MockImageProps) {
      void fill;
      void priority;
      return createElement("img", {
        ...props,
        src: typeof src === "string" ? src : src.src,
      });
    },
  };
});

vi.mock("next/navigation", () => ({
  usePathname: () => "/products",
}));

afterEach(() => cleanup());
