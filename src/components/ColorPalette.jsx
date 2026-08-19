import { Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";

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
  {
    id: "ocean",
    label: "Ocean",
    colors: {
      primary: "#0b6e99",
      primaryHover: "#095b80",
      accent: "#ffd166",
      bg: "#f2fbff",
      surface: "#ffffff",
      border: "#d6eefc",
    },
  },
  {
    id: "professional-gray",
    label: "Professional Gray",
    colors: {
      primary: "#3a4b56",
      primaryHover: "#2f3c44",
      accent: "#7ea3b2",
      bg: "#f6f7f8",
      surface: "#ffffff",
      border: "#e1e6e9",
    },
  },
  {
    id: "skyline",
    label: "Skyline",
    colors: {
      primary: "#1f6f8b",
      primaryHover: "#16596f",
      accent: "#ffb86b",
      bg: "#f6fbfb",
      surface: "#ffffff",
      border: "#e6f0f2",
    },
  },
  {
    id: "olive",
    label: "Olive",
    colors: {
      primary: "#556b2f",
      primaryHover: "#485a28",
      accent: "#d4b26a",
      bg: "#fafbf5",
      surface: "#ffffff",
      border: "#ececdf",
    },
  },
  {
    id: "deep-teal",
    label: "Deep Teal",
    colors: {
      primary: "#0d6b6b",
      primaryHover: "#0b5757",
      accent: "#ffc9a3",
      bg: "#f7fbfb",
      surface: "#ffffff",
      border: "#e6efef",
    },
  },
  {
    id: "warm-amber",
    label: "Warm Amber",
    colors: {
      primary: "#9b6b00",
      primaryHover: "#7d5600",
      accent: "#f7c873",
      bg: "#fffaf2",
      surface: "#ffffff",
      border: "#f3e6cf",
    },
  },
  {
    id: "slate",
    label: "Slate",
    colors: {
      primary: "#2e3a49",
      primaryHover: "#25313b",
      accent: "#aab7c2",
      bg: "#f7f9fb",
      surface: "#ffffff",
      border: "#e6eaf0",
    },
  },
  {
    id: "midnight",
    label: "Midnight",
    colors: {
      primary: "#111827",
      primaryHover: "#0b1220",
      accent: "#6ee7b7",
      bg: "#f8fafc",
      surface: "#ffffff",
      border: "#e5e7eb",
    },
  },
];

export default function ColorPalette({ onSelect }) {
  const applyPalette = (colors) => {
    if (onSelect) onSelect(colors);
  };

  return (
    <Dropdown className="me-2">
      <Dropdown.Toggle variant="light" size="sm" id="color-palette-dropdown">
        Palette
      </Dropdown.Toggle>

      <Dropdown.Menu
        popperConfig={{
          strategy: "fixed",
          modifiers: [{ name: "preventOverflow", options: { boundary: "viewport", padding: 8 } }],
        }}
        style={{ maxWidth: "min(280px, 90vw)", maxHeight: "60vh", overflowY: "auto" }}
      >
        {PALETTES.map((p) => (
          <OverlayTrigger
            key={p.id}
            placement="right"
            overlay={<Tooltip id={`tp-${p.id}`}>{p.label}</Tooltip>}
          >
            <Dropdown.Item onClick={() => applyPalette(p.colors)}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 20, height: 14, background: p.colors.primary, borderRadius: 2, border: "1px solid #eee" }} />
                <div style={{ width: 20, height: 14, background: p.colors.accent, borderRadius: 2, border: "1px solid #eee" }} />
                <span style={{ marginLeft: 8 }}>{p.label}</span>
              </div>
            </Dropdown.Item>
          </OverlayTrigger>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}