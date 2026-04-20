import { describe, it, expect } from "vitest";
import { slugify, formatPartituraTitle, partituraSlug, composerSlug } from "@/lib/slug";

describe("slugify", () => {
  it("converts accented characters", () => {
    expect(slugify("Música Clásica")).toBe("musica-clasica");
  });

  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Johann Sebastian Bach")).toBe("johann-sebastian-bach");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("a  b---c")).toBe("a-b-c");
  });

  it("removes special characters", () => {
    expect(slugify("Op. 9, No. 2")).toBe("op-9-no-2");
  });

  it("truncates at 80 characters", () => {
    const long = "a".repeat(100);
    expect(slugify(long).length).toBeLessThanOrEqual(80);
  });
});

describe("formatPartituraTitle", () => {
  it("removes -a4.pdf suffix", () => {
    expect(formatPartituraTitle("fur-elise-a4.pdf")).toBe("Fur Elise");
  });

  it("capitalises words", () => {
    expect(formatPartituraTitle("moonlight-sonata-a4.pdf")).toBe("Moonlight Sonata");
  });

  it("replaces underscores with spaces", () => {
    expect(formatPartituraTitle("bien_tempered_clavier-a4.pdf")).toBe("Bien Tempered Clavier");
  });
});

describe("partituraSlug", () => {
  it("uses last composer name + title", () => {
    const slug = partituraSlug({ filename: "fur-elise-a4.pdf", compositor: "Ludwig van Beethoven" });
    expect(slug).toBe("beethoven-fur-elise");
  });
});

describe("composerSlug", () => {
  it("slugifies composer name", () => {
    expect(composerSlug("Frédéric Chopin")).toBe("frederic-chopin");
  });
});
