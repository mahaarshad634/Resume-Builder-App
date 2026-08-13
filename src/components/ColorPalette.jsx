import { ButtonGroup, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import React from "react";

const PALETTES = [
  {
    id: "calm-blue",
    label: "Calm Blue",
    colors: {
      primary: "#235a7e",
      primaryHover: "#1b4a65",
      accent: "#f0a845",
      bg: "#eef4f9",
      surface: "#ffffff",
      border: "#d7e1e9",
    },
  },
  {
    id: "sage",
    label: "Sage",
    colors: {
      primary: "#356859",
      primaryHover: "#2a5045",
      accent: "#c9a85b",
      bg: "#f4f7f4",
      surface: "#ffffff",
      border: "#e6ebe6",
    },
  },
  {
    id: "charcoal",
    label: "Charcoal",
    colors: {
      primary: "#2b3a42",
      primaryHover: "#202a30",
      accent: "#9bb4c0",
      bg: "#f7f8f9",
      surface: "#ffffff",
      border: "#e6eaec",
    },
  },
  {
    id: "muted-rose",
    label: "Muted Rose",
    colors: {
      primary: "#6b3d4a",
      primaryHover: "#55303a",
      accent: "#d9a6a6",
      bg: "#fbf6f6",
      surface: "#ffffff",
      border: "#f0e6e6",
    },
  },
];

export default function ColorPalette({ currentColors = {}, onSelect }) {
  const applyPalette = (colors) => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", colors.primary);
    root.style.setProperty("--color-primary-hover", colors.primaryHover);
    root.style.setProperty("--color-accent", colors.accent);
    root.style.setProperty("--color-bg", colors.bg);
    root.style.setProperty("--color-surface", colors.surface);
    root.style.setProperty("--color-border", colors.border);

    if (onSelect) onSelect(colors);
  };

  return (
    <ButtonGroup aria-label="Color palettes" className="me-2">
      {PALETTES.map((p) => (
        <OverlayTrigger
          key={p.id}
          placement="bottom"
          overlay={<Tooltip id={`tp-${p.id}`}>{p.label}</Tooltip>}
        >
          <Button
            variant="light"
            size="sm"
            onClick={() => applyPalette(p.colors)}
            style={{ padding: 0, border: "1px solid var(--color-border)" }}
            title={p.label}
          >
            <div style={{ display: "flex", gap: 0 }}>
              <div style={{ width: 20, height: 20, background: p.colors.primary }} />
              <div style={{ width: 20, height: 20, background: p.colors.accent }} />
            </div>
          </Button>
        </OverlayTrigger>
      ))}
    </ButtonGroup>
  );
}
