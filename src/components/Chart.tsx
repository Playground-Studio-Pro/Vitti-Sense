import React, { useRef, useState, useLayoutEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ReferenceLine,
} from "recharts";

type Lang = "en" | "es";

type BarPoint = { labelEN: string; labelES: string; value: number };
type PieSlice = { labelEN: string; labelES: string; value: number };
type LinePoint = { t: string; v: number };
type AreaPoint = { t: string; v: number };
type RadarPoint = { subjectEN: string; subjectES: string; value: number };

export type ChartSpec =
  | {
    type: "bar";
    titleEN: string;
    titleES: string;
    unit?: "percent" | "count" | "minutes";
    series: BarPoint[];
    highlightIndex?: number;
  }
  | {
    type: "pie";
    titleEN: string;
    titleES: string;
    slices: PieSlice[];
    highlightIndex?: number;
  }
  | {
    type: "line";
    titleEN: string;
    titleES: string;
    unit?: "percent" | "count" | "minutes";
    points: LinePoint[];
    anomalyThreshold?: number;
  }
  | {
    type: "area";
    titleEN: string;
    titleES: string;
    unit?: "percent" | "count" | "minutes";
    points: AreaPoint[];
    anomalyThreshold?: number;
  }
  | {
    type: "radar";
    titleEN: string;
    titleES: string;
    unit?: "percent" | "count" | "minutes";
    metrics: RadarPoint[];
    highlightIndex?: number;
  };

function getLabel(lang: Lang, x: { labelEN: string; labelES: string }) {
  return lang === "es" ? x.labelES : x.labelEN;
}

function formatValue(value: number, unit?: "percent" | "count" | "minutes") {
  if (unit === "percent") return `${Math.round(value * 100)}%`;
  if (unit === "minutes") return `${Math.round(value)}m`;
  if (unit === "count") return `${Math.round(value)}`;
  return `${value}`;
}

/** Hook that tracks the width of a container via ResizeObserver */
function useContainerWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        if (w > 0) {
          setWidth(w);
          setReady(true);
        }
      }
    });

    ro.observe(el);

    const rect = el.getBoundingClientRect();
    if (rect.width > 0) {
      setWidth(rect.width);
      setReady(true);
    }

    return () => ro.disconnect();
  }, []);

  return { ref, width, ready };
}

const CHART_HEIGHT = 256;

const TOOLTIP_STYLE = {
  borderRadius: "8px",
  border: "none",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
};

export function Chart({
  chartSpec,
  language,
  blue = "#7183F5",
  greenHighlight = "#26D07C",
}: {
  chartSpec?: ChartSpec;
  language: Lang;
  blue?: string;
  greenHighlight?: string;
}) {
  if (!chartSpec) return null;

  const title = language === "es" ? chartSpec.titleES : chartSpec.titleEN;

  return (
    <div className="w-full mt-4">
      <div className="text-sm font-semibold text-[#242424] mb-2">{title}</div>

      {chartSpec.type === "bar" && (
        <BarChartView
          spec={chartSpec}
          language={language}
          blue={blue}
          greenHighlight={greenHighlight}
        />
      )}

      {chartSpec.type === "pie" && (
        <PieChartView
          spec={chartSpec}
          language={language}
          blue={blue}
          greenHighlight={greenHighlight}
        />
      )}

      {chartSpec.type === "line" && (
        <LineChartView
          spec={chartSpec}
          language={language}
          blue={blue}
          greenHighlight={greenHighlight}
        />
      )}

      {chartSpec.type === "area" && (
        <AreaChartView
          spec={chartSpec}
          language={language}
          blue={blue}
          greenHighlight={greenHighlight}
        />
      )}

      {chartSpec.type === "radar" && (
        <RadarChartView
          spec={chartSpec}
          language={language}
          blue={blue}
          greenHighlight={greenHighlight}
        />
      )}
    </div>
  );
}

// ---------------- BAR ----------------
function BarChartView({
  spec,
  language,
  blue,
  greenHighlight,
}: {
  spec: Extract<ChartSpec, { type: "bar" }>;
  language: Lang;
  blue: string;
  greenHighlight: string;
}) {
  const hi = spec.highlightIndex ?? -1;
  const { ref, width, ready } = useContainerWidth();

  const data = spec.series.map((s, idx) => ({
    label: getLabel(language, s),
    value: s.value,
    highlight: idx === hi,
    unit: spec.unit,
  }));

  const safeWidth = Math.max(width, 320);

  return (
    <div ref={ref} className="w-full" style={{ height: CHART_HEIGHT }}>
      {ready && width > 0 && (
        <BarChart data={data} width={safeWidth} height={CHART_HEIGHT} margin={{ top: 5, right: 18, left: 8, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "transparent" }}
            formatter={(v: any, _name: any, ctx: any) => {
              const unit = ctx?.payload?.unit as any;
              const num = typeof v === "number" ? v : Number(v);
              return formatValue(num, unit);
            }}
            contentStyle={TOOLTIP_STYLE}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.highlight ? greenHighlight : blue} />
            ))}
          </Bar>
        </BarChart>
      )}
    </div>
  );
}

// ---------------- PIE ----------------
function PieChartView({
  spec,
  language,
  blue,
  greenHighlight,
}: {
  spec: Extract<ChartSpec, { type: "pie" }>;
  language: Lang;
  blue: string;
  greenHighlight: string;
}) {
  const hi = Math.max(0, Math.min(spec.highlightIndex ?? 0, spec.slices.length - 1));
  const { ref, width, ready } = useContainerWidth();

  // Limit slices to 5 by grouping remainder into Other / Otros (production-safe)
  const slices = spec.slices.length <= 5
    ? spec.slices
    : [
      ...spec.slices.slice(0, 4),
      {
        labelEN: "Other",
        labelES: "Otros",
        value: spec.slices.slice(4).reduce((a, s) => a + s.value, 0),
      },
    ];

  const data = slices.map((s, idx) => ({
    label: getLabel(language, s),
    value: s.value,
    highlight: idx === hi,
  }));

  // Blue shades for data; highlight in green
  const fills = data.map((d, idx) =>
    d.highlight ? greenHighlight : `rgba(113,131,245,${0.25 + (idx / Math.max(1, data.length - 1)) * 0.55})`
  );

  const safeWidth = Math.max(width, 320);
  const size = Math.min(safeWidth, CHART_HEIGHT);

  return (
    <div ref={ref} className="w-full flex items-center justify-center" style={{ height: CHART_HEIGHT }}>
      {ready && width > 0 && (
        <PieChart width={size} height={size}>
          <Tooltip contentStyle={TOOLTIP_STYLE} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="80%"
            paddingAngle={2}
          >
            {data.map((_entry, index) => (
              <Cell key={`slice-${index}`} fill={fills[index]} />
            ))}
          </Pie>
        </PieChart>
      )}
    </div>
  );
}

// ---------------- LINE ----------------
function LineChartView({
  spec,
  blue,
  greenHighlight,
}: {
  spec: Extract<ChartSpec, { type: "line" }>;
  language: Lang;
  blue: string;
  greenHighlight: string;
}) {
  const threshold = spec.anomalyThreshold;
  const { ref, width, ready } = useContainerWidth();

  const data = spec.points.map((p) => ({
    label: p.t,
    value: p.v,
    unit: spec.unit,
  }));

  const safeWidth = Math.max(width, 320);

  return (
    <div ref={ref} className="w-full" style={{ height: CHART_HEIGHT }}>
      {ready && width > 0 && (
        <LineChart data={data} width={safeWidth} height={CHART_HEIGHT} margin={{ top: 5, right: 18, left: 8, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip
            formatter={(v: any, _name: any, ctx: any) => {
              const unit = ctx?.payload?.unit as any;
              const num = typeof v === "number" ? v : Number(v);
              return formatValue(num, unit);
            }}
            contentStyle={TOOLTIP_STYLE}
          />
          {typeof threshold === "number" && (
            <ReferenceLine
              y={threshold}
              stroke={greenHighlight}
              strokeDasharray="6 3"
              ifOverflow="extendDomain"
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            stroke={blue}
            strokeWidth={2.5}
            dot={{ fill: blue, r: 4, strokeWidth: 0 }}
            activeDot={{ fill: greenHighlight, r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      )}
    </div>
  );
}

// ---------------- AREA ----------------
function AreaChartView({
  spec,
  blue,
  greenHighlight,
}: {
  spec: Extract<ChartSpec, { type: "area" }>;
  language: Lang;
  blue: string;
  greenHighlight: string;
}) {
  const { ref, width, ready } = useContainerWidth();

  const data = spec.points.map((p) => ({
    label: p.t,
    value: p.v,
    unit: spec.unit,
  }));

  const gradientId = "areaGradient";
  const safeWidth = Math.max(width, 320);

  return (
    <div ref={ref} className="w-full" style={{ height: CHART_HEIGHT }}>
      {ready && width > 0 && (
        <AreaChart data={data} width={safeWidth} height={CHART_HEIGHT} margin={{ top: 5, right: 18, left: 8, bottom: 10 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={blue} stopOpacity={0.35} />
              <stop offset="95%" stopColor={blue} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            dy={10}
          />
          <YAxis hide />
          <Tooltip
            formatter={(v: any, _name: any, ctx: any) => {
              const unit = ctx?.payload?.unit as any;
              const num = typeof v === "number" ? v : Number(v);
              return formatValue(num, unit);
            }}
            contentStyle={TOOLTIP_STYLE}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={blue}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={{ fill: blue, r: 3, strokeWidth: 0 }}
            activeDot={{ fill: greenHighlight, r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      )}
    </div>
  );
}

// ---------------- RADAR ----------------
function RadarChartView({
  spec,
  language,
  blue,
  greenHighlight,
}: {
  spec: Extract<ChartSpec, { type: "radar" }>;
  language: Lang;
  blue: string;
  greenHighlight: string;
}) {
  const { ref, width, ready } = useContainerWidth();

  const data = spec.metrics.map((m) => ({
    subject: language === "es" ? m.subjectES : m.subjectEN,
    value: m.value,
  }));

  const safeWidth = Math.max(width, 320);

  return (
    <div ref={ref} className="w-full flex justify-center" style={{ height: CHART_HEIGHT }}>
      {ready && width > 0 && (
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data} width={safeWidth} height={CHART_HEIGHT}>
          <PolarGrid stroke="#E5E7EB" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#6B7280", fontSize: 11 }}
          />
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Tooltip
            formatter={(v: any) => {
              const num = typeof v === "number" ? v : Number(v);
              return formatValue(num, spec.unit);
            }}
            contentStyle={TOOLTIP_STYLE}
          />
          <Radar
            dataKey="value"
            stroke={blue}
            fill={blue}
            fillOpacity={0.25}
            strokeWidth={2}
            dot={{ fill: blue, r: 3, strokeWidth: 0 }}
            activeDot={{ fill: greenHighlight, r: 5, strokeWidth: 0 }}
          />
        </RadarChart>
      )}
    </div>
  );
}
